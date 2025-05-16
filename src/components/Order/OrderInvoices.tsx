import queryString from "query-string";
import { z } from "zod";

import { notFound } from "next/navigation";
import { InvoiceCard } from "@/components/Invoice/Card";
import Sqids from "sqids";

interface Props {
  id: string;
}

export const OrderInvoices = async ({ id }: Props) => {
  const { data } = await fetchData(id);

  if (!data) {
    return notFound();
  }

  if (!data?.invoices) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 overflow-x-auto mt-8">
      <h2 className="text-xl font-semibold">Invoices</h2>
      <div className="grid gap-6 xl:grid-cols-2 mt-6">
        {data.invoices.map((invoice) => (
          <InvoiceCard
            key={invoice.id}
            invoice={invoice}
            customer={data.customer}
            encodedId={new Sqids({ minLength: 10 }).encode([invoice.id])}
          />
        ))}
      </div>
    </div>
  );
};

const fetchData = async (
  id: string
): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: [
        "id",
        "status",
        "number",
        "date",
        "customer",
        "amount_total",
        "invoices",
      ],
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/modules/order/${id}?${query}`,
    {
      next: {
        tags: ["global"],
      },
    }
  );

  if (!response.ok) {
    const errorMessage = `Failed to fetch: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  const data = await response.json();

  try {
    return ApiResponseSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.errors);

      throw new Error("API Response validation failed: " + error.message);
    }
    throw error;
  }
};

const Customer = z.object({
  id: z.number(),
  name: z.string(),
  status: z.number(),
  email: z.string(),
  phone: z.string(),
  address: z.string(),
});

const Invoices = z.array(
  z.object({
    id: z.number(),
    status: z.number(),
    number: z.string(),
    date: z.string(),
    due_date: z.string(),
    amount: z.string(),
    payment_status: z.number(),
    checkout_link: z.string(),
    download_link: z.string(),
  })
);

const Order = z.object({
  id: z.number(),
  status: z.number(),
  number: z.string(),
  date: z.string(),
  amount_total: z.string(),
  invoices: Invoices.nullable(),
  customer: Customer,
});

const ApiResponseSchema = z.object({
  data: Order.nullable(),
});

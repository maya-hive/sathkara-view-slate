import { notFound } from "next/navigation";
import queryString from "query-string";
import Sqids from "sqids";
import { z } from "zod";

import { InvoiceCard } from "@/components/Invoice/Card";

interface Props {
  encodedId: string;
}

export const CheckoutForm = async ({ encodedId }: Props) => {
  if (!encodedId) {
    return notFound();
  }

  const id = new Sqids().decode(encodedId)[0];

  if (!id) {
    return notFound();
  }

  const { data } = await fetchData(id.toString());

  return (
    <div className="container mx-auto px-4 sm:px-6 mt-8">
      <InvoiceCard
        key={data.id}
        invoice={{
          id: data.id,
          number: data.number,
          date: data.date,
          due_date: data.due_date,
          amount: data.amount,
          payment_status: data.payment_status,
          download_link: data.download_link,
        }}
        customer={{
          id: data.order.customer.id,
          status: data.order.customer.status,
          name: data.order.customer.name,
          email: data.order.customer.email,
          phone: data.order.customer.phone,
          address: data.order.customer.address,
        }}
        encodedId={id.toString()}
      />
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
        "due_date",
        "order",
        "amount",
        "payment_status",
        "checkout_link",
        "download_link",
      ],
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/modules/orderInvoice/${id}?${query}`,
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
  status: z.number(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
});

const Order = z.object({
  id: z.number(),
  status: z.number(),
  number: z.string(),
  date: z.string(),
  customer: Customer,
});

const Invoice = z.object({
  id: z.number(),
  status: z.number(),
  number: z.string(),
  date: z.string(),
  due_date: z.string(),
  amount: z.string(),
  payment_status: z.number(),
  checkout_link: z.string(),
  download_link: z.string(),
  order: Order,
});

const ApiResponseSchema = z.object({
  data: Invoice,
});

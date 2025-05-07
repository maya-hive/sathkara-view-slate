import queryString from "query-string";
import Link from "next/link";
import { z } from "zod";

import { PriceTag } from "../PriceTag";

interface Props {
  id: string;
}

export const OrderInvoices = async ({ id }: Props) => {
  const { data } = await fetchData(id);

  if (!data) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 overflow-x-auto mt-8">
      <h2 className="text-center text-2xl font-semibold">Invoices</h2>
      <table className="mt-6 min-w-full border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100 ">
          <tr className="text-left text-gray-700 border-b [&>th]:px-4 [&>th]:py-3">
            <th>Invoice Number</th>
            <th>Date</th>
            <th>Due Date</th>
            <th>Amount</th>
            <th className="text-center">Payment Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.invoices?.map((invoice) => (
            <tr key={invoice.id} className="border-b [&>td]:px-4 [&>td]:py-3">
              <td>{invoice.number}</td>
              <td>{invoice.date}</td>
              <td>{invoice.due_date}</td>
              <td className="font-semibold text-green-600">
                <PriceTag amount={invoice.amount} cents="show" />
              </td>
              <td className="font-medium text-center">
                {invoice.payment_status ? "Paid" : "Pending"}
              </td>
              <td className="flex gap-3 justify-end">
                <Link
                  href={invoice.download_link}
                  className="text-white bg-blue-600 px-3 py-1 rounded-lg hover:bg-blue-700"
                >
                  Download
                </Link>
                {!invoice.payment_status && (
                  <Link
                    href={invoice.checkout_link}
                    className="text-white bg-blue-600 px-3 py-1 rounded-lg hover:bg-blue-700"
                  >
                    Checkout
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
        "total_price",
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
  total_price: z.string(),
  invoices: Invoices.nullable(),
});

const ApiResponseSchema = z.object({
  data: Order.nullable(),
});

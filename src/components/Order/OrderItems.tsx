import queryString from "query-string";
import { z } from "zod";

import { PriceTag } from "../PriceTag";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  id: string;
}

export const OrderItems = async ({ id }: Props) => {
  const { data } = await fetchData(id);

  if (!data) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 overflow-x-auto mt-8">
      <h2 className="text-center text-2xl font-semibold">Order</h2>
      <div className="overflow-x-auto mt-8">
        <table className="min-w-full border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr className="text-left text-gray-700 border-b [&>th]:px-4 [&>th]:py-3">
              <th>Type</th>
              <th>Item</th>
              <th>Description</th>
              <th>Unit Price</th>
              <th className="text-center">Quantity</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data?.items?.map((invoice) => (
              <tr key={invoice.id} className="border-b [&>td]:px-4 [&>td]:py-3">
                <td>{invoice.type}</td>
                <td>{invoice.title}</td>
                <td>{invoice.description}</td>
                <td>
                  <PriceTag amount={invoice.unit_price} cents="show" />
                </td>
                <td className="text-center">{invoice.quantity}</td>
                <td className="text-right">
                  <PriceTag amount={invoice.amount} cents="show" />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-b [&>td]:px-4 [&>td]:py-3">
              <td colSpan={5} className="font-semibold">
                Order Total
              </td>
              <td className="text-right font-semibold">
                <PriceTag amount={data.total_price} cents="show" />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <Link
        href={data.download_link}
        className="mx-auto block rounded w-fit mt-5 px-10 py-2 text-white bg-blue-600  text-center text-md font-semibold uppercase"
      >
        Download Order
      </Link>
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
        "download_link",
        "items",
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

const OrderItem = z.object({
  id: z.number(),
  type: z.string(),
  title: z.string(),
  description: z.string(),
  unit_price: z.string(),
  quantity: z.number(),
  amount: z.string(),
});

const Order = z.object({
  id: z.number(),
  status: z.number(),
  number: z.string(),
  date: z.string(),
  total_price: z.string(),
  items: z.array(OrderItem).nullable(),
  download_link: z.string(),
});

const ApiResponseSchema = z.object({
  data: Order.nullable(),
});

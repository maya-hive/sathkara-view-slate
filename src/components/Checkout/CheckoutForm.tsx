import queryString from "query-string";
import { z } from "zod";
import { PriceTag } from "@/components/PriceTag";

import { PayHereForm } from "./PayHereForm";

interface Props {
  id: string;
}

export const CheckoutForm = async ({ id }: Props) => {
  const { data } = await fetchData(id);

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-center text-2xl font-semibold">
        Checkout for Order: {data.number}
      </h2>

      <div className="mt-6 overflow-x-auto">
        <table className="mt-4 min-w-full border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="text-center">
              <th className="py-3 px-4">Invoice Number</th>
              <th className="py-3 px-4">Payment Status</th>
              <th className="py-3 px-4">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr key={data.id} className="text-center border-b">
              <td className="py-3 px-4">{data.number}</td>
              <td className="py-3 px-4">{data.payment_status}</td>
              <td className="py-3 px-4 font-semibold text-lg">
                <PriceTag amount={data.amount} cents="show" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <PayHereForm
          id={id.toString()}
          reference={data.number}
          amount={parseFloat(data.amount)}
          customer={data.order.customer}
        />
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
  total_price: z.string(),
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

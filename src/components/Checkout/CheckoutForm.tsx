import queryString from "query-string";
import { z } from "zod";
import { PriceTag } from "../PriceTag";
import Link from "next/link";

interface Props {
  id: string;
}

export const CheckoutForm = async ({ id }: Props) => {
  const { data } = await fetchData(id);

  if (!data || !data.invoices || data.invoices.length === 0) {
    return <div>No invoice data available.</div>;
  }

  const totalAmount = 100.0;

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-center text-2xl font-semibold">
        Checkout for Order: {data.number}
      </h2>

      <div className="mt-6 overflow-x-auto">
        <table className="mt-4 min-w-full border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr className="text-left text-gray-700 border-b [&>th]:px-4 [&>th]:py-3">
              <th className="py-3 px-4">Invoice Details</th>
            </tr>
          </thead>
          <tbody>
            {data.invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b">
                <td className="py-3 px-4">
                  <strong>Invoice Number:</strong> {invoice.number}
                </td>
              </tr>
            ))}
            {data.invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b">
                <td className="py-3 px-4">
                  <strong>Amount:</strong>{" "}
                  <PriceTag amount={invoice.amount} cents="show" />
                </td>
              </tr>
            ))}
            {data.invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b">
                <td className="py-3 px-4">
                  <strong>Payment Status:</strong> {invoice.payment_status}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="py-3 px-4 font-semibold text-lg">
                <strong>Total Amount: </strong>
                <PriceTag amount={totalAmount.toString()} cents="show" />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-6">
        <Link
          className="text-white bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700"
          href="/"
        >
          Pay Now
        </Link>
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
  data: Order,
});

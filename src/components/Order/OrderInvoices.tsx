import queryString from "query-string";
import Link from "next/link";
import { z } from "zod";

import { PriceTag } from "../PriceTag";
import { notFound } from "next/navigation";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Calendar, CreditCard, Download } from "lucide-react";
import { Badge } from "../ui/badge";

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
          <Card key={invoice.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <h2 className="text-lg font-semibold">{invoice.number}</h2>
                </div>
                {getStatusBadge(invoice.payment_status)}
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-md">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground mr-1">Date:</span>
                  <span>{invoice.date}</span>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground mr-1">Due:</span>
                  <span>{invoice.due_date}</span>
                </div>
              </div>
            </CardContent>

            <CardContent className="p-0 border-t pb-2">
              <div className="px-4 py-2">
                <div className="mt-2 flex justify-between items-center">
                  <div className="flex items-center">Invoice Amount</div>
                  <div className="text-lg font-semibold ml-2">
                    <PriceTag amount={invoice.amount} cents="show" />
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t pb-4 bg-slate-50 px-4">
              <div className="mt-4 w-full flex justify-end space-x-2">
                <Link
                  href={invoice.download_link}
                  className="rounded w-fit flex items-center justify-center bg-white border text-secondary px-10 py-2 text-center text-md font-semibold uppercase"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Link>
                {invoice.payment_status !== 2 && (
                  <Link
                    href={invoice.checkout_link}
                    className="rounded w-fit flex items-center justify-center bg-yellow-400 text-yellow-800 px-10 py-2 text-center text-md font-semibold uppercase"
                  >
                    <CreditCard className="h-4 w-4 mr-1" />
                    {invoice.payment_status === 0 ? "Pay Now" : "Checkout"}
                  </Link>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

const getStatusBadge = (paymentStatus: number) => {
  switch (paymentStatus) {
    case 3:
      return <Badge className="bg-red-500">Payment Declined</Badge>;
    case 1:
      return <Badge className="bg-green-500">Paid</Badge>;
    case 0:
      return <Badge className="bg-gray-200 text-black">Payment Pending</Badge>;
    default:
      return <Badge className="bg-gray-500">Unknown</Badge>;
  }
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

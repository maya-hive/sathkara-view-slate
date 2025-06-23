import { notFound } from "next/navigation";
import queryString from "query-string";
import { z } from "zod";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PriceTag } from "@/components/PriceTag";
import Link from "next/link";

interface Props {
  id: string;
}

export const OrderDetails = async ({ id }: Props) => {
  const { data } = await fetchData(id);

  if (!data) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 mt-8">
      <div className="border rounded-md">
        <div className="grid gap-4 md:grid-cols-2">
          <OrderCard order={data} />
          <CustomerCard customer={data.customer} />
        </div>
        <DataTable data={data} />
      </div>
    </div>
  );
};

const CustomerCard = ({
  customer,
}: {
  customer: z.infer<typeof Customer> | null;
}) => {
  if (!customer) {
    return null;
  }

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">Customer Details</h2>
        <div className="space-y-3">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="text-md">{customer.name}</p>
            </div>

            {customer.email && (
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-md">{customer.email}</p>
              </div>
            )}

            {customer.phone && (
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="text-md">{customer.phone}</p>
              </div>
            )}

            {customer.address && (
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="text-md">{customer.address}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const OrderCard = ({ order }: { order: z.infer<typeof Order> | null }) => {
  if (!order) {
    return null;
  }

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">Order Information</h2>
        <div className="space-y-3">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="text-md">{order.number}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Order PDF</p>
              <Link
                href={order.download_link}
                className="inline-block text-secondary text-md font-semibold uppercase"
              >
                Download
              </Link>
            </div>

            {order.checkin_date && (
              <div>
                <p className="text-sm text-muted-foreground">Check-in Date</p>
                <p className="text-md">{order.checkin_date}</p>
              </div>
            )}

            {order.checkout_date && (
              <div>
                <p className="text-sm text-muted-foreground">Check-out Date</p>
                <p className="text-md">{order.checkout_date}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DataTable = ({ data }: z.infer<typeof ApiResponseSchema>) => {
  if (!data?.items) {
    return null;
  }

  return (
    <div className="mt-2 border-t shadow-sm overflow-x-auto">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="min-w-[350px]">Item</TableHead>
            <TableHead className="min-w-[200px] text-right">
              Unit Price & Qty
            </TableHead>
            <TableHead className="min-w-[150px] text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.map((invoice) => (
            <TableRow key={invoice.id} className="text-md">
              <TableCell>
                <div className="text-[16px]">
                  <Badge className="bg-gray-100 text-muted-foreground">
                    {invoice.type}
                  </Badge>
                  <div className="mt-2">{invoice.title}</div>
                </div>
                <p className="mt-1 max-w-[450px] text-muted-foreground">
                  {invoice.description}
                </p>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <PriceTag amount={invoice.unit_price} cents="show" />
                  <span className="text-muted-foreground">×</span>
                  <span>{invoice.quantity}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <PriceTag amount={invoice.amount} cents="show" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="text-md">
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell className="text-right">
              <PriceTag amount={data.amount_total} cents="show" />
            </TableCell>
          </TableRow>
          <TableRow className="border-t text-lg">
            <TableCell colSpan={2}>Due Amount</TableCell>
            <TableCell className="text-right">
              <PriceTag amount={data.amount_due} cents="show" />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
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
        "date",
        "number",
        "checkin_date",
        "checkout_date",
        "download_link",
        "amount_total",
        "amount_due",
        "customer",
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

const Customer = z.object({
  id: z.number(),
  name: z.string(),
  status: z.number(),
  email: z.string(),
  phone: z.string(),
  address: z.string(),
});

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
  checkin_date: z.string(),
  checkout_date: z.string(),
  customer: Customer.nullable(),
  amount_total: z.string(),
  amount_due: z.string(),
  download_link: z.string(),
  items: z.array(OrderItem).nullable(),
});

const ApiResponseSchema = z.object({
  data: Order.nullable(),
});

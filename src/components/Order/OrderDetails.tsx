import { notFound } from "next/navigation";
import queryString from "query-string";
import { z } from "zod";

interface Props {
  id: string;
}

export const OrderDetails = async ({ id }: Props) => {
  const { data } = await fetchData(id);

  if (!data) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 overflow-x-auto mt-8">
      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        <div className="bg-muted rounded-lg p-4">
          <h3 className="mb-2 font-semibold">Order Details</h3>
          <p>Order Number: {data.number}</p>
          <p>Check-out Date: {data.checkin_date}</p>
          <p>Check-in Date: {data.checkout_date}</p>
        </div>
        <div className="bg-muted rounded-lg p-4">
          <h3 className="mb-2 font-semibold">Customer Details</h3>
          <p>{data.customer?.name}</p>
          <p>{data.customer?.email}</p>
          <p>{data.customer?.phone}</p>
          <p>{data.customer?.address}</p>
        </div>
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
        "checkin_date",
        "checkout_date",
        "customer",
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
  email: z.string(),
  phone: z.string(),
  address: z.string(),
});

const Order = z.object({
  id: z.number(),
  status: z.number(),
  number: z.string(),
  checkin_date: z.string(),
  checkout_date: z.string(),
  customer: Customer.nullable(),
});

const ApiResponseSchema = z.object({
  data: Order.nullable(),
});

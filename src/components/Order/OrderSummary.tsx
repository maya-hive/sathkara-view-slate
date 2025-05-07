import Image from "next/image";
import Link from "next/link";
import queryString from "query-string";
import { z } from "zod";

interface Props {
  id: string;
}

export const OrderSummary = async ({ id }: Props) => {
  const { data } = await fetchData(id);

  if (!data) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 overflow-x-auto mt-8">
      <div className="mt-6">
        {data.items?.map((item) => (
          <div key={item.id}>
            {item.itinerary && (
              <OrderItemRow type="itinerary" item={item.itinerary} />
            )}
            {item.activity && (
              <OrderItemRow type="activity" item={item.activity} />
            )}
            {item.accommodation && (
              <OrderItemRow type="accommodation" item={item.accommodation} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

type OrderItemRowProps = {
  type: "itinerary" | "activity" | "accommodation";
  item: OrderItemRowType;
};

type OrderItemRowType = {
  name: string;
  short_description: string;
  slug: string;
  featured_image?: string | null;
};

const OrderItemRow = ({ type, item }: OrderItemRowProps) => (
  <div className="mb-4">
    <h3 className="font-semibold capitalize">{type}</h3>
    <div className="py-4">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 lg:items-center">
        <div className="lg:col-span-2">
          <Image
            src={
              "http://localhost:3000/_next/image?url=https%3A%2F%2Fsathkara-backoffice.mayadev.xyz%2Fmedia%2F408%2F53ce21306029c-8311.webp&w=1920&q=75"
            }
            alt={"item image"}
            width={300}
            height={200}
            className="w-full h-[240px] object-cover rounded-lg mr-4"
          />
          {item.featured_image && (
            <Image
              src={item.featured_image}
              alt={item.name}
              width={300}
              height={200}
              className="w-full h-[240px] object-cover rounded-lg mr-4"
            />
          )}
        </div>
        <div className="lg:col-span-4">
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <p className="text-gray-500">{item.short_description}</p>
          <Link
            href={`/${type}/${item.slug}`}
            className="block rounded w-fit mt-5 bg-yellow-400 text-yellow-800 px-10 py-2 text-center text-md font-semibold uppercase"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  </div>
);

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

const OrderItemType = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  short_description: z.string(),
  featured_image: z.string().nullable().optional(),
});

const OrderItem = z.object({
  id: z.number(),
  itinerary: OrderItemType.nullable(),
  activity: OrderItemType.nullable(),
  accommodation: OrderItemType.nullable(),
});

const Order = z.object({
  id: z.number(),
  status: z.number(),
  number: z.string(),
  date: z.string(),
  total_price: z.string(),
  invoices: Invoices.nullable(),
  items: z.array(OrderItem).nullable().optional(),
});

const ApiResponseSchema = z.object({
  data: Order.nullable(),
});

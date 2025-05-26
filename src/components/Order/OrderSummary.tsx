import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import queryString from "query-string";
import { z } from "zod";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
}

export const OrderSummary = async ({ id }: Props) => {
  const { data } = await fetchData(id);

  if (!data) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 overflow-x-auto mt-8">
      <h2 className="text-xl font-semibold">Summary</h2>
      <div className="mt-6 space-y-4">
        {data.items?.map((item, idx, arr) => (
          <div
            key={item.id}
            className={cn(idx !== arr.length - 1 && "border-b")}
          >
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
  url: string;
  featured_image?: string | null;
};

const OrderItemRow = ({ type, item }: OrderItemRowProps) => (
  <div className="mb-6">
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 lg:items-center">
      {item.featured_image && (
        <Image
          src={item.featured_image}
          alt={item.name}
          width={300}
          height={200}
          className="lg:col-span-1 w-full h-min-[160px] h-full object-cover rounded-lg mr-4"
        />
      )}
      <div className="lg:col-span-5">
        <div className="prose">
          <h3 className="mt-0 font-semibold">
            <Badge className="bg-gray-100 text-muted-foreground">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
            <div className="mt-2 text-lg">{item.name}</div>
          </h3>
          <p className="text-gray-500 mb-3">{item.short_description}</p>
          <Link
            href={item.url}
            className="text-secondary no-underline"
            target="_blank"
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
        "amount_total",
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
  url: z.string(),
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
  amount_total: z.string(),
  invoices: Invoices.nullable(),
  items: z.array(OrderItem).nullable().optional(),
});

const ApiResponseSchema = z.object({
  data: Order.nullable(),
});

import { toBase64 } from "@/utils/base64";
import Image from "next/image";
import Link from "next/link";
import queryString from "query-string";
import { z } from "zod";
import { shimmer } from "../Shimmer";

interface Props {
  slug?: string;
  data?: Itinerary;
}

type Itinerary = {
  id: number;
  status: number;
  name: string;
  slug: string;
  short_description: string;
  price: string;
  featured_image: string;
  sale_price?: string | null;
  duration?: string | null;
};

export const ItineraryCard = async ({ slug, data }: Props) => {
  if (slug) {
    const { data } = await fetchData(slug);

    if (!data) {
      return null;
    }

    return <CardLayout data={data} />;
  }

  return <CardLayout data={data} />;
};

const CardLayout = ({ data }: Props) =>
  data && (
    <Link href={"/itineraries/" + data.slug}>
      <Image
        className="rounded w-full h-[400px] object-cover"
        alt={"Featured image"}
        src={data.featured_image}
        priority={false}
        placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
        width={500}
        height={400}
      />
      <h1 className="font-semibold mt-2">{data.name}</h1>
      <p>{data.short_description}</p>
      <p>Price: {data.price}</p>
    </Link>
  );

const fetchData = async (
  slug: string
): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: [
        "id",
        "name",
        "status",
        "slug",
        "sale_price",
        "featured_image",
        "short_description",
        "duration",
        "price",
      ],
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/modules/itinerary/${slug}?${query}`
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

const ApiResponseSchema = z.object({
  data: z.object({
    id: z.number(),
    status: z.number(),
    name: z.string(),
    slug: z.string(),
    short_description: z.string(),
    price: z.string(),
    featured_image: z.string(),
    sale_price: z.string().nullable(),
    duration: z.string().nullable(),
  }),
});

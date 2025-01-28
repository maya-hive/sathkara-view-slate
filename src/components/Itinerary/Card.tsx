import Image from "next/image";
import queryString from "query-string";
import { z } from "zod";

interface Props {
  slug: string;
}

export const ItineraryCard = async ({ slug }: Props) => {
  const { data } = await fetchData(slug);

  if (!data) {
    return null;
  }

  return (
    <a href={"/itineraries/" + slug} className="p-8 border">
      <Image
        className="rounded w-full h-[200px] object-cover"
        src={data.featured_image}
        alt={data.name}
        width={500}
        height={100}
      />
      <h2 className="font-semibold mt-2">{data.name}</h2>
      <p>{data.short_description}</p>
      <p>Price: {data.price}</p>
    </a>
  );
};

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
    `${process.env.API_URL}/modules/itinerary/${slug}?${query}`,
    {
      cache: "no-store",
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

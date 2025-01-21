import Image from "next/image";
import queryString from "query-string";
import { z } from "zod";

export default async function ItinearyIndex({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const { data } = await fetchData(slug);

  if (!data) {
    return null;
  }

  return (
    <article className="container mx-auto">
      <Image
        className="rounded w-full h-[400px] object-cover"
        src={data.featured_image}
        alt={"Featured image"}
        width={1200}
        height={800}
      />
      <h1 className="font-semibold mt-2">{data.name}</h1>
      <p>{data.short_description}</p>
      <p>Price: {data.price}</p>
    </article>
  );
}

const fetchData = async (
  slug: string
): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    { fields: ["id", "name", "featured_image", "short_description", "price"] },
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

const Schema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.string(),
  short_description: z.string(),
  featured_image: z.string(),
});

const ApiResponseSchema = z.object({
  data: Schema,
});

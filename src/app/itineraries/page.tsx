import Image from "next/image";
import Link from "next/link";
import queryString from "query-string";
import { z } from "zod";

export default async function ItinearyIndex() {
  const { data } = await fetchData();

  if (!data) {
    return null;
  }

  return (
    <article className="container mx-auto">
      <div className="mt-12 grid grid-cols-4 gap-5">
        {data.map((item, index) => (
          <Link key={index} href={"/itineraries/" + item.slug}>
            <Image
              className="rounded w-full h-[400px] object-cover"
              src={item.featured_image}
              alt={"Featured image"}
              width={1200}
              height={800}
            />
            <h1 className="font-semibold mt-2">{item.name}</h1>
            <p>{item.short_description}</p>
            <p>Price: {item.price}</p>
          </Link>
        ))}
      </div>
    </article>
  );
}

const fetchData = async (): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: [
        "id",
        "name",
        "slug",
        "featured_image",
        "short_description",
        "price",
      ],
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/modules/itinerary/index?${query}`
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
  slug: z.string(),
  short_description: z.string(),
  featured_image: z.string(),
});

const ApiResponseSchema = z.object({
  data: z.array(Schema),
});

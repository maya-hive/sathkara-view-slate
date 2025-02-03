import Image from "next/image";
import Link from "next/link";
import queryString from "query-string";
import { Suspense } from "react";
import { z } from "zod";

export default async function ItinearyIndex() {
  const { data } = await fetchData();

  if (!data || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  const items = data.filter((item) => item);

  if (items.length === 0) {
    return null;
  }

  return (
    <article className="container mx-auto">
      <div className="my-8">
        <div className="bg-slate-100 py-12">
          <h1 className="text-center text-2xl">Itineraries</h1>
        </div>
      </div>
      <div className="mt-12 grid grid-cols-3 gap-5">
        <Suspense fallback={<span>Loading</span>}>
          {data.map((item, index) => (
            <Link key={index} href={"/itineraries/" + item.slug}>
              <Image
                className="rounded w-full h-[400px] object-cover"
                src={item.featured_image}
                alt={"Featured image"}
                width={500}
                height={400}
              />
              <h1 className="font-semibold mt-2">{item.name}</h1>
              <p>{item.short_description}</p>
              <p>Price: {item.price}</p>
            </Link>
          ))}
        </Suspense>
      </div>
      <div className="mt-8 w-full flex justify-center gap-4">
        <Link
          href="/itineraries/page/2"
          className="block bg-slate-900 text-white text-center min-w-[120px] p-4 text-sm"
        >
          Next
        </Link>
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
  data: z.array(Schema).nullable(),
});

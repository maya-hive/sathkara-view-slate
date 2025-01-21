"use server";

import { z } from "zod";
import Link from "next/link";
import queryString from "query-string";
import Image from "next/image";
import { ItineraryCard } from "./Card";

interface Props {
  category: string;
  itineraries: string[] | null;
  content?: string | null;
}

export const ItinerarySlide = async ({
  category,
  itineraries,
  content,
}: Props) => {
  if (!itineraries) return <></>;

  const { data } = await fetchData(category);

  return (
    <div className="mx-5 flex border gap-5">
      <div className="flex items-end relative">
        <div className="bg-gradient-to-b from-transparent to-black">
          <Image
            className="absolute -z-10 w-full h-full left-0 top-0 object-cover"
            src={data.featured_image}
            alt={data.name}
            width={200}
            height={400}
          />
          <div className="p-8">
            {content && (
              <span
                className="text-white [&>h4]:text-xl"
                dangerouslySetInnerHTML={{
                  __html: content,
                }}
              />
            )}
            <Link
              href="/itineraries"
              className="block w-fit mt-5 bg-slate-100 px-10 py-2 text-center"
            >
              Plan Your Trip
            </Link>
          </div>
        </div>
      </div>
      <div className="p-8">
        <div className="flex gap-5">
          {itineraries.map((itinerary, index: number) => {
            return itinerary && <ItineraryCard key={index} slug={itinerary} />;
          })}
        </div>
        <Link
          href="/itineraries"
          className="mt-5 py-2 block bg-slate-900 text-slate-50 text-center"
        >
          View All Itineraries
        </Link>
      </div>
    </div>
  );
};

const fetchData = async (
  slug: string
): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    { fields: ["id", "name", "featured_image"] },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/modules/itineraryCategory/${slug}?${query}`,
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
    name: z.string(),
    featured_image: z.string(),
  }),
});

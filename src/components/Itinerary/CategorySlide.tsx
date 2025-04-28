"use server";

import { z } from "zod";
import Link from "next/link";
import queryString from "query-string";
import Image from "next/image";
import { ItineraryCard } from "./Card";
import { cn } from "@/lib/utils";

interface Props {
  category: string;
  itineraries: string[] | null;
  content?: string | null;
}

export const ItineraryCategorySlide = async ({
  category,
  itineraries,
  content,
}: Props) => {
  if (!itineraries) return null;

  const { data } = await fetchData(category);

  if (!data) return null;

  return (
    <div className="flex flex-col lg:flex-row justify-between border rounded-2xl overflow-hidden gap-5 h-full lg:h-auto">
      <div className="flex items-end relative xl:w-[650px]">
        <div className="bg-gradient-to-b from-transparent to-black text-center md:text-left">
          <Image
            className="absolute -z-10 w-full h-full left-0 top-0 object-cover"
            src={data.featured_image}
            alt={data.name}
            width={1200}
            height={1400}
          />
          <div className="p-10">
            {content && (
              <span
                className="text-white [&>h3]:mt-1 [&>h3]:text-5xl [&>h3]:font-semibold [&>h4]:text-xl [&>h4]:font-semibold [&>p]:mt-2 [&>p]:font-medium"
                dangerouslySetInnerHTML={{
                  __html: content,
                }}
              />
            )}
            <Link
              href={cn(`/itinerary-categories/${category}`)}
              className="block mx-auto md:mx-0 rounded w-fit mt-5 bg-yellow-400 text-yellow-800 px-10 py-2 text-center text-md font-semibold uppercase"
            >
              Plan Your Trip
            </Link>
          </div>
        </div>
      </div>
      <div className="p-4 md:p-8 w-full">
        <div className="grid xl:grid-cols-2 gap-5">
          {itineraries.map((itinerary, idx) => {
            return itinerary && <ItineraryCard key={idx} slug={itinerary} />;
          })}
        </div>
        <Link
          href="/itineraries"
          className="mt-6 rounded-md p-4 block bg-slate-800 text-slate-50 text-center text-sm font-semibold uppercase"
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

const ApiResponseSchema = z.object({
  data: z
    .object({
      id: z.number(),
      name: z.string(),
      featured_image: z.string(),
    })
    .nullable(),
});

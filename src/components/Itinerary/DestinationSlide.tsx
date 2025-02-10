"use server";

import queryString from "query-string";
import { z } from "zod";

import { ItineraryCard } from "./Card";

interface Props {
  destination: string;
}

export const ItineraryDestinationSlide = async ({ destination }: Props) => {
  const { data } = await fetchData(destination);

  if (!data) return <></>;

  return (
    <>
      {data.featured_itineraries?.map(({ slug }, idx) => (
        <ItineraryCard key={idx} slug={slug} />
      ))}
    </>
  );
};

const fetchData = async (
  slug: string
): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    { fields: ["id", "name", "featured_itineraries"] },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/modules/destination/${slug}?${query}`,
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

const Itinerary = z.object({
  id: z.number(),
  status: z.number(),
  name: z.string(),
  slug: z.string(),
  short_description: z.string(),
  price: z.string(),
  featured_image: z.string(),
  listing_image: z.string().nullable().optional(),
  sale_price: z.string().nullable(),
  duration: z.string().nullable(),
  destination: z
    .object({
      name: z.string(),
    })
    .nullable(),
});

const ApiResponseSchema = z.object({
  data: z.object({
    id: z.number(),
    name: z.string(),
    featured_itineraries: z.array(Itinerary).nullable(),
  }),
});

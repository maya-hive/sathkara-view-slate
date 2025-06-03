import queryString from "query-string";
import type { Metadata } from "next";
import { z } from "zod";

import { generateStaticParams } from "../page/[id]/page";
import { ItineraryListing } from "@/components/Itinerary/Listing/Main";

type Args = {
  searchParams: Promise<{
    query?: string;
    country?: string;
    categories?: string;
    audiences?: string;
    duration?: string;
  }>;
};

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Page({ searchParams }: Args) {
  const { query, country, categories, audiences, duration } =
    await searchParams;

  const data = await fetchData(
    "1",
    country,
    query,
    categories,
    audiences,
    duration
  );

  return <ItineraryListing {...data} />;
}

export { generateStaticParams };

export const dynamic = "force-dynamic";

const fetchData = async (
  id: string,
  country?: string,
  search?: string,
  categories?: string,
  audiences?: string,
  duration?: string
): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: ["id", "status", "slug"],
      country: country,
      search: search,
      categories: categories?.split(","),
      audiences: audiences?.split(","),
      duration: duration,
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/modules/itinerary/index?page=${id}&${query}`,
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

const Schema = z.object({
  id: z.number(),
  status: z.number(),
  slug: z.string(),
});

const ApiResponseSchema = z.object({
  data: z.array(Schema).nullable(),
  current_page: z.number().nullable(),
  last_page: z.number().nullable(),
  links: z
    .array(
      z.object({
        url: z.string().nullable(),
        label: z.string(),
        active: z.boolean(),
      })
    )
    .nullable(),
});

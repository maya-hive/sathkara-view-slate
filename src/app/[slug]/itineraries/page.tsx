import queryString from "query-string";
import { z } from "zod";

import { generateStaticParams } from "./page/[id]/page";
import { ItineraryListing } from "@/components/Itinerary/Listing/Main";

type Args = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    query?: string;
  }>;
};

export default async function Page({ params, searchParams }: Args) {
  const { slug } = await params;
  const { query } = await searchParams;

  const data = await fetchData("1", slug, query);

  if (!data) {
    return null;
  }

  return <ItineraryListing destination={slug} {...data} />;
}

export { generateStaticParams };

const fetchData = async (
  id: string,
  destination: string,
  search?: string
): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: ["id", "status", "slug"],
      by_destination: destination,
      search: search,
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

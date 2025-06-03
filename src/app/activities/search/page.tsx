import queryString from "query-string";
import type { Metadata } from "next";
import { z } from "zod";

import { generateStaticParams } from "../page/[id]/page";
import { ActivityListing } from "@/components/Activity/Listing/Main";

type Args = {
  searchParams: Promise<{
    query?: string;
    country?: string;
    categories?: string;
  }>;
};

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Page({ searchParams }: Args) {
  const { query, country, categories } = await searchParams;

  const data = await fetchData("1", country, query, categories);

  return <ActivityListing {...data} />;
}

export { generateStaticParams };

export const dynamic = "force-dynamic";

const fetchData = async (
  id: string,
  country?: string,
  search?: string,
  categories?: string
): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: ["id", "status", "slug"],
      country: country,
      search: search,
      categories: categories?.split(","),
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/modules/activity/index?page=${id}&${query}`,
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

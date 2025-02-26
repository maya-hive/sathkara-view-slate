import queryString from "query-string";
import { z } from "zod";

import { ActivityCategoryListing } from "@/components/ActivityCategory/Listing/Main";

type Args = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({ params }: Args) {
  const { slug } = await params;

  const data = await fetchData("1");

  if (!data) {
    return null;
  }

  return <ActivityCategoryListing category={slug} {...data} />;
}

const fetchData = async (
  id: string
): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: [
        "id",
        "name",
        "status",
        "slug",
        "featured_image",
        "listing_image",
        "short_description",
        "duration",
        "best_time",
        "approximate_charge",
        "charge_description",
        "destination",
      ],
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
  name: z.string(),
  slug: z.string(),
  short_description: z.string(),
  featured_image: z.string(),
  listing_image: z.string().nullable().optional(),
  duration: z.string().nullable(),
  best_time: z.string().nullable(),
  approximate_charge: z.string().nullable(),
  charge_description: z.string().nullable().optional(),
  destination: z.object({
    name: z.string(),
    slug: z.string(),
    color: z.string(),
  }),
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

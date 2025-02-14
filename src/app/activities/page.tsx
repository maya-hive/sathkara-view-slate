import queryString from "query-string";
import { z } from "zod";

import { ActivityListing } from "@/components/Activity/Listing/Main";

export default async function Page() {
  const data = await fetchData("1");

  if (!data) {
    return <></>;
  }

  return <ActivityListing {...data} />;
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
        "short_description",
        "duration",
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
  duration: z.string().nullable(),
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

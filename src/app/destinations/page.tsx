import queryString from "query-string";
import { z } from "zod";

import { DestinationListing } from "@/components/Destination/Listing/Main";
import { NoData } from "../no-data";

export default async function Page() {
  const data = await fetchData("1");

  if (!data) {
    return <NoData />;
  }

  return <DestinationListing {...data} />;
}

const fetchData = async (
  id: string
): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: ["id", "status", "slug"],
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/modules/destination/index?page=${id}&${query}`,
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

const ApiSchema = z.object({
  id: z.number(),
  status: z.number(),
  slug: z.string(),
});

const ApiResponseSchema = z.object({
  data: z.array(ApiSchema).nullable(),
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

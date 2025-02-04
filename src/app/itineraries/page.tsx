import queryString from "query-string";
import { z } from "zod";

import { ItineraryPageLayout } from "./page/[id]/page";

export default async function ItinearyIndex() {
  const { data, links } = await fetchData();

  if (!data || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  const items = data.filter((item) => item);

  if (items.length === 0) {
    return null;
  }

  return <ItineraryPageLayout data={data} links={links} />;
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

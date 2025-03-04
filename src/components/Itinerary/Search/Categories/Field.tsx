import queryString from "query-string";
import { z } from "zod";
import { ItinerarySearchCategoriesClient } from "./Field.client";

interface Props {
  className?: string;
  label?: boolean;
}

export const ItienrarySearchCategories = async (props: Props) => {
  const { data } = await fetchData();

  if (!data) {
    return null;
  }

  const options = data.map((item) => ({
    value: item.slug,
    label: item.name,
  }));

  return <ItinerarySearchCategoriesClient options={options} {...props} />;
};

const fetchData = async (): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: ["id", "status", "slug", "name"],
      limit: "1000",
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/modules/itineraryCategory/index?${query}`,
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
  name: z.string(),
});

const ApiResponseSchema = z.object({
  data: z.array(ApiSchema).nullable(),
});

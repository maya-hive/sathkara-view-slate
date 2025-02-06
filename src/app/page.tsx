import queryString from "query-string";
import { z } from "zod";

import { ItienraryCategorySlider } from "@/components/Itinerary/CategorySlider";
import { Banner } from "@/components/Banner";

export default async function Home() {
  const { data } = await fetchData();

  if (!data) {
    return <p className="text-center text-red-500">No data available.</p>;
  }

  return (
    <article>
      <Banner image={data.hero_image} content={data.hero_content} />
      <ItienraryCategorySlider items={data.home_itineraries} />
    </article>
  );
}

const fetchData = async (): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: ["hero_content", "hero_image", "home_itineraries"],
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/settings/page_home?${query}`,
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
  data: z.object({
    hero_content: z.string().nullable(),
    hero_image: z.string().nullable(),
    home_itineraries: z
      .array(
        z
          .object({
            category: z.string(),
            itineraries: z.array(z.string()).nullable(),
            content: z.string().nullable(),
          })
          .nullable()
      )
      .nullable(),
  }),
});

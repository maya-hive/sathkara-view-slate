import queryString from "query-string";
import { z } from "zod";

import { ItineraryCategorySlider } from "@/components/Itinerary/CategorySlider";
import { Banner } from "@/components/Banner";
import { DestinationSection } from "@/components/Destination/Section";
import { ItinerarySection } from "@/components/Itinerary/Section";
import { ItineraryDestinationSlider } from "@/components/Itinerary/DestinationSlider";

export default async function Home() {
  const { data } = await fetchData();

  if (!data) {
    return <></>;
  }

  return (
    <article>
      <Banner image={data.hero_image} content={data.hero_content} />
      <DestinationSection
        items={data.destination_items}
        content={data.destination_title}
      />
      <ItinerarySection
        items={data.featured_itineraries}
        content={data.itinerary_content}
      />
      <ItineraryDestinationSlider
        destinations={data.itineraries_by_destination_items}
        content={data.itineraries_by_destination_title}
      />
      <ItineraryCategorySlider items={data.itineraries} />
    </article>
  );
}

const fetchData = async (): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: [
        "hero_content",
        "hero_image",
        "itineraries",
        "itinerary_content",
        "featured_itineraries",
        "destination_title",
        "destination_items",
        "itineraries_by_destination_title",
        "itineraries_by_destination_items",
      ],
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
    itineraries: z
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
    destination_title: z.string().nullable(),
    destination_items: z.array(z.string()).nullable(),
    featured_itineraries: z.array(z.string()).nullable(),
    itinerary_content: z.string().nullable(),
    itineraries_by_destination_title: z.string().nullable(),
    itineraries_by_destination_items: z.array(z.string()).nullable(),
  }),
});

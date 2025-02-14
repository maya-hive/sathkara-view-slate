import queryString from "query-string";
import { z } from "zod";

import { ItineraryCategorySlider } from "@/components/Itinerary/CategorySlider";
import { HomeHero } from "@/components/HomeHero";
import { DestinationSection } from "@/components/Destination/Section";
import { ItinerarySection } from "@/components/Itinerary/Section";
import { ItineraryDestinationSlider } from "@/components/Itinerary/DestinationSlider";
import { CallToAction } from "@/components/CallToAction";
import { ContentSection } from "@/components/ContentSection";
import { AudienceTestimonialSlider } from "@/components/Audience/SliderTestimonials";

export default async function Home() {
  const { data } = await fetchData();

  if (!data) {
    return null;
  }

  return (
    <article>
      <HomeHero
        image={data.hero_image}
        video={data.hero_video}
        content={data.hero_content}
        title={data.hero_filter_title}
      />
      <DestinationSection
        items={data.destination_items}
        content={data.destination_title}
      />
      <ItinerarySection
        items={data.featured_itineraries}
        title={data.featured_itineraries_title}
      />
      <ItineraryDestinationSlider
        destinations={data.itineraries_by_destination_items}
        title={data.itineraries_by_destination_title}
      />
      <ItineraryCategorySlider items={data.itineraries} />
      <CallToAction
        content={data.banner_content_1}
        link={data.banner_link_1}
        image={data.banner_image_1}
      />
      <AudienceTestimonialSlider
        items={data.audience_items}
        content={data.audience_title}
      />
      <ContentSection
        content={data.content_section_content_1}
        image={data.content_section_image_1}
        link={data.content_section_link_1}
      />
    </article>
  );
}

const fetchData = async (): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: [
        "hero_content",
        "hero_image",
        "hero_video",
        "hero_filter_title",
        "itineraries",
        "featured_itineraries",
        "featured_itineraries_title",
        "destination_title",
        "destination_items",
        "itineraries_by_destination_title",
        "itineraries_by_destination_items",
        "banner_image_1",
        "banner_link_1",
        "banner_content_1",
        "content_section_image_1",
        "content_section_content_1",
        "content_section_link_1",
        "audience_items",
        "audience_title",
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
  data: z
    .object({
      hero_content: z.string().nullable().optional(),
      hero_image: z.string().nullable().optional(),
      hero_video: z.string().nullable().optional(),
      hero_filter_title: z.string().nullable().optional(),
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
      destination_items: z.array(z.string()).nullable().optional(),
      featured_itineraries: z.array(z.string()).nullable().optional(),
      featured_itineraries_title: z.string().nullable().optional(),
      itineraries_by_destination_title: z.string().nullable(),
      itineraries_by_destination_items: z
        .array(z.string())
        .nullable()
        .optional(),
      banner_image_1: z.string().nullable(),
      banner_link_1: z.object({
        title: z.string().nullable(),
        url: z.string().nullable(),
      }),
      banner_content_1: z.string().nullable(),
      content_section_image_1: z.string().nullable(),
      content_section_content_1: z.string().nullable(),
      content_section_link_1: z.object({
        title: z.string().nullable(),
        url: z.string().nullable(),
      }),
      audience_title: z.string().nullable(),
      audience_items: z
        .array(
          z.object({
            image: z.string().nullable(),
            audience: z.string().nullable(),
            title: z.string().nullable(),
            description: z.string().nullable(),
            testimonial: z.string().nullable(),
          })
        )
        .nullable(),
    })
    .nullable(),
});

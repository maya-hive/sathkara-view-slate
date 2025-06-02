import queryString from "query-string";
import { Metadata } from "next";
import { z } from "zod";

import { ItineraryCategorySlider } from "@/components/Itinerary/CategorySlider";
import { HomeHero } from "@/components/HomeHero";
import { CountrySection } from "@/components/Country/Section";
import { ItinerarySection } from "@/components/Itinerary/Section";
import { ItineraryCountrySlider } from "@/components/Itinerary/CountrySlider";
import { CallToAction } from "@/components/CallToAction";
import { HomeContentSection } from "@/components/Home/ContentSection";
import { AudienceTestimonialSlider } from "@/components/Audience/SliderTestimonials";
import { NoData } from "@/app/no-data";
import { HomeContentSlider } from "@/components/Home/ContentSlider";

export default async function Home() {
  const { data } = await fetchData();

  if (!data) {
    return <NoData />;
  }

  return (
    <article>
      <HomeHero
        image={data.hero_image}
        video={data.hero_video}
        content={data.hero_content}
        title={data.hero_filter_title}
      />
      <CountrySection items={data.country_items} content={data.country_title} />
      <ItinerarySection
        items={data.featured_itineraries}
        title={data.featured_itineraries_title}
      />
      <ItineraryCountrySlider
        countries={data.itineraries_by_country_items}
        title={data.itineraries_by_country_title}
      />
      <ItineraryCategorySlider items={data.itineraries} />
      <CallToAction
        content={data.banner_content_1}
        link={data.banner_link_1}
        image={data.banner_image_1}
      />
      <HomeContentSlider
        title={data.content_slider_title}
        contents={data.content_slider}
      />
      <AudienceTestimonialSlider
        items={data.audience_items}
        content={data.audience_title}
      />
      <HomeContentSection
        content={data.content_section_content_1}
        image={data.content_section_image_1}
        link={data.content_section_link_1}
      />
    </article>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await fetchData();

  if (!data) {
    return {};
  }

  return {
    title: data.meta_title,
    description: data.meta_description,
  };
}

const fetchData = async (): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: [
        "meta_title",
        "meta_description",
        "hero_content",
        "hero_image",
        "hero_video",
        "hero_filter_title",
        "itineraries",
        "featured_itineraries",
        "featured_itineraries_title",
        "country_title",
        "country_items",
        "itineraries_by_country_title",
        "itineraries_by_country_items",
        "banner_image_1",
        "banner_link_1",
        "banner_content_1",
        "content_section_image_1",
        "content_section_content_1",
        "content_section_link_1",
        "audience_items",
        "audience_title",
        "content_slider_title",
        "content_slider",
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
      meta_title: z.string().nullable().optional(),
      meta_description: z.string().nullable().optional(),
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
      country_title: z.string().nullable(),
      country_items: z.array(z.string()).nullable().optional(),
      featured_itineraries: z.array(z.string()).nullable().optional(),
      featured_itineraries_title: z.string().nullable().optional(),
      itineraries_by_country_title: z.string().nullable(),
      itineraries_by_country_items: z.array(z.string()).nullable().optional(),
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
      content_slider_title: z.string().nullable(),
      content_slider: z.array(
        z.object({
          icon: z.string().nullable().optional(),
          image: z.string().nullable().optional(),
          title: z.string().nullable().optional(),
          content: z.string().nullable().optional(),
          link_title: z.string().nullable().optional(),
          link_url: z.string().nullable().optional(),
        })
      ),
    })
    .nullable(),
});

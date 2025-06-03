import queryString from "query-string";
import { z } from "zod";

import { ItineraryCountrySliderClient as SliderClient } from "@/components/Itinerary/CountrySlider.client";
import { ItineraryCountrySlide as Slide } from "@/components/Itinerary/CountrySlide";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  countries?: string[] | null;
  content?: TrustedHTML | null;
  title: string | null;
}

export const ItineraryCountrySlider = async ({
  countries,
  content,
  title,
}: Props) => {
  if (!countries) return null;

  const allData = await fetchData(countries);

  const data = allData.map((item) => item.data);

  if (!data) return null;

  if (
    !data.some(
      (item) =>
        item?.featured_itineraries && item.featured_itineraries.length > 0
    )
  ) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 md:px-0">
      <div className="py-12">
        <div className="text-center text-2xl font-semibold">
          {content && <span dangerouslySetInnerHTML={{ __html: content }} />}
        </div>
        <Tabs defaultValue={data[0]?.slug}>
          <div className="mb-8 flex flex-col md:flex-row items-center justify-center gap-4">
            <span className="font-bold">
              <span className="text-secondary">
                {title?.split(" ").slice(0, 2).join(" ")}
              </span>{" "}
              {title?.split(" ").slice(2).join(" ")}
            </span>
            <span className="flex gap-3">
              <TabsList>
                {data?.map(
                  (country, idx) =>
                    country && (
                      <TabsTrigger key={idx} value={country.slug}>
                        {country.name}
                      </TabsTrigger>
                    )
                )}
              </TabsList>
            </span>
          </div>
          {data?.map(
            (country, idx) =>
              country && (
                <TabsContent key={idx} value={country.slug}>
                  <SliderClient>
                    <Slide country={country.slug} />
                  </SliderClient>
                </TabsContent>
              )
          )}
        </Tabs>
      </div>
    </section>
  );
};

const fetchData = async (
  slugs: string[]
): Promise<z.infer<typeof ApiResponseSchema>[]> => {
  const query = queryString.stringify(
    { fields: ["id", "name", "slug", "featured_itineraries"] },
    { arrayFormat: "bracket" }
  );

  const responses = await Promise.all(
    slugs.map(async (slug) => {
      const response = await fetch(
        `${process.env.API_URL}/modules/country/${slug}?${query}`,
        {
          next: { tags: ["global"] },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch ${slug}: ${response.status} ${response.statusText}`
        );
      }

      return response.json();
    })
  );

  try {
    return responses.map((data) => ApiResponseSchema.parse(data));
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.errors);

      throw new Error("API Response validation failed: " + error.message);
    }
    throw error;
  }
};

const Itinerary = z.object({
  id: z.number(),
  status: z.number(),
  name: z.string(),
  slug: z.string(),
  short_description: z.string(),
  price: z.string(),
  featured_image: z.string(),
  listing_image: z.string().nullable().optional(),
  sale_price: z.string().nullable(),
  duration: z.string().nullable(),
  country: z
    .object({
      name: z.string(),
    })
    .nullable(),
});

const ApiResponseSchema = z.object({
  data: z
    .object({
      id: z.number(),
      slug: z.string(),
      name: z.string(),
      featured_itineraries: z.array(Itinerary).nullable(),
    })
    .nullable(),
});

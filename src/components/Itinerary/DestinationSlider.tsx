import queryString from "query-string";
import { z } from "zod";

import { ItineraryDestinationSliderClient as SliderClient } from "./DestinationSlider.client";
import { ItineraryDestinationSlide as Slide } from "./DestinationSlide";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  destinations?: string[] | null;
  content?: TrustedHTML | null;
}

export const ItineraryDestinationSlider = async ({
  destinations,
  content,
}: Props) => {
  if (!destinations) return <></>;

  const allData = await fetchData(destinations);

  const data = allData.map((item) => item.data);

  if (!data) return <></>;

  return (
    <section>
      <div className="container mx-auto py-12">
        <div className="text-center text-2xl font-semibold">
          {content && <span dangerouslySetInnerHTML={{ __html: content }} />}
        </div>
        <Tabs defaultValue={data[0].slug}>
          <div className="mb-8 flex items-center justify-center gap-4">
            <span className="font-semibold">Sort by Destination :</span>
            <span className="flex gap-3">
              <TabsList>
                {data?.map(({ name, slug }, idx) => (
                  <TabsTrigger key={idx} value={slug}>
                    {name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </span>
          </div>
          {data?.map(({ slug }, idx) => (
            <TabsContent key={idx} value={slug}>
              <SliderClient>
                <Slide destination={slug} />
              </SliderClient>
            </TabsContent>
          ))}
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
        `${process.env.API_URL}/modules/destination/${slug}?${query}`,
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
  destination: z
    .object({
      name: z.string(),
    })
    .nullable(),
});

const ApiResponseSchema = z.object({
  data: z.object({
    id: z.number(),
    slug: z.string(),
    name: z.string(),
    featured_itineraries: z.array(Itinerary).nullable(),
  }),
});

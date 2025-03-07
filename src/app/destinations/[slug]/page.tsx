import Image from "next/image";
import queryString from "query-string";
import { z } from "zod";

import { Breadcrumb } from "@/components/Breadcrumb";
import { Banner } from "@/components/Banner";
import { Gallery } from "@/components/Gallery";
import { shimmer } from "@/components/Shimmer";
import { toBase64 } from "@/utils/base64";
import { RichText } from "@/components/RichText";
import { ItineraryInquirySidebarCTA } from "@/components/Itinerary/Inquiry/SidebarCTA";
import { ItineraryInquiryForm } from "@/components/Itinerary/Inquiry/Form";
import { CityList } from "@/components/City/CityList";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const { data } = await fetchData(slug);

  if (!data) {
    return null;
  }

  return (
    <article>
      <Banner image={data.featured_image} />
      <TopBar data={data} />
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-12 md:pt-12">
          <div className="md:min-w-[calc(100%-400px)] xl:max-w-[calc(100%-400px)]">
            <div className="mt-8">
              <div className="mt-4">
                {data.description && (
                  <div className="mt-4">
                    <h2 className="text-xl font-bold mb-4">
                      About The Destination
                    </h2>
                    <RichText content={data.description} />
                  </div>
                )}
                <div className="mt-8">
                  <CityList cities={data.cities} destination={slug} />
                </div>
                {data?.gallery && data?.gallery?.length > 0 && (
                  <div className="mt-12">
                    <h3 className="text-lg font-semibold mb-4">Gallery</h3>
                    <Gallery>
                      {(Array.isArray(data.gallery)
                        ? data.gallery
                        : [data.gallery]
                      ).map((image, idx) => (
                        <Image
                          key={idx}
                          src={
                            image ??
                            `data:image/svg+xml;base64,${toBase64(
                              shimmer(700, 475)
                            )}`
                          }
                          placeholder={`data:image/svg+xml;base64,${toBase64(
                            shimmer(700, 475)
                          )}`}
                          alt={`Gallery image ${idx}`}
                          width={800}
                          height={500}
                          priority={false}
                        />
                      ))}
                    </Gallery>
                  </div>
                )}
              </div>
              <div className="mt-8">
                <ItineraryInquiryForm />
              </div>
            </div>
          </div>
          <div className="top-[150px] w-full">
            <ItineraryInquirySidebarCTA />
          </div>
        </div>
      </div>
    </article>
  );
}

const TopBar = ({ data }: z.infer<typeof ApiResponseSchema>) => (
  <div className="bg-primary">
    <div className="container mx-auto py-4 flex flex-col md:flex-row justify-between gap-8">
      <div className="flex items-center gap-8">
        <div className="font-semibold">
          <Breadcrumb />
          <h1 className="text-3xl text-white">{data?.name}</h1>
        </div>
      </div>
    </div>
  </div>
);

export async function generateStaticParams() {
  const query = queryString.stringify(
    { fields: ["slug"], limit: "1000" },
    { arrayFormat: "bracket" }
  );
  const response = await fetch(
    `${process.env.API_URL}/modules/destination/index?${query}`
  );

  if (!response.ok) {
    const errorMessage = `Failed to fetch: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  const { data } = await response.json();

  return data.map(({ slug }: { slug: string }) => ({
    slug,
  }));
}

const fetchData = async (
  slug: string
): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: [
        "status",
        "name",
        "slug",
        "featured_image",
        "gallery",
        "description",
        "short_description",
        "cities",
        "meta_title",
        "meta_description",
      ],
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/modules/destination/${slug}?${query}`,
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
  status: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  short_description: z.string().nullable(),
  meta_title: z.string().nullable(),
  meta_description: z.string().nullable(),
  featured_image: z.string(),
  listing_image: z.string().nullable().optional(),
  gallery: z
    .union([z.array(z.string()).nullable(), z.string().nullable()])
    .nullable()
    .optional(),
  cities: z.array(z.object({ name: z.string(), slug: z.string() })).nullable(),
});

const ApiResponseSchema = z.object({
  data: Schema.nullable(),
});

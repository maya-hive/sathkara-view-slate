import Image from "next/image";
import Link from "next/link";
import queryString from "query-string";
import { z } from "zod";

import { AccommodationCompactCard } from "@/components/Accommodation/CompactCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ItineraryInquiryForm } from "@/components/Itinerary/Inquiry/Form";
import { CityCompactCard } from "@/components/City/CompactCard";
import { Breadcrumb } from "@/components/Breadcrumb";
import { shimmer } from "@/components/Shimmer";
import { Gallery } from "@/components/Gallery";
import { Banner } from "@/components/Banner";
import { PriceTag } from "@/components/PriceTag";
import { toBase64 } from "@/utils/base64";
import { ActivityCompactCard } from "@/components/Activity/CompactCard";
import { ActivityCard } from "@/components/Activity/Card";
import { RichText } from "@/components/RichText";
import { NoData } from "@/app/no-data";

export default async function Page({
  params,
}: {
  params: Promise<{ itinerary: string }>;
}) {
  const slug = (await params).itinerary;
  const { data } = await fetchData(slug);

  if (!data) {
    return <NoData />;
  }

  return (
    <article>
      <Banner
        image={data.featured_image}
        thumbnail={data.featured_image_mobile}
      />
      <TopBar data={data} />
      <div className="container mx-auto px-4 sm:px-6">
        <Tabs defaultValue={tabs[0].name}>
          <div className="flex flex-col md:flex-row gap-12 md:pt-12">
            <div className="md:min-w-[calc(100%-400px)] xl:max-w-[calc(100%-400px)]">
              <div className="mt-8">
                <TabsList className="p-0 flex-wrap gap-2">
                  {tabs.map(({ name, title }, idx) => (
                    <TabsTrigger
                      key={idx}
                      value={name}
                      className="rounded-t-xl rounded-b-none flex-1 lg:flex-none bg-muted border-none data-[state=active]:bg-secondary py-3 px-12 text-slate-600 text-sm uppercase font-semibold"
                    >
                      {title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              <div className="mt-20 lg:mt-12">
                {tabs.map(({ name, Component }, idx) => (
                  <TabsContent key={idx} value={name}>
                    <Component data={data} />
                  </TabsContent>
                ))}
                <div className="mt-8">
                  <ItineraryInquiryForm />
                </div>
              </div>
            </div>
            <Aside data={data} />
          </div>
        </Tabs>
      </div>
    </article>
  );
}

const Overview = ({ data }: z.infer<typeof ApiResponseSchema>) => (
  <div>
    {data?.overview && (
      <div>
        <h2 className="text-xl font-bold mb-4">Tour Overview</h2>
        <RichText content={data.overview} />
      </div>
    )}
    <div className="mt-4 grid xl:grid-cols-6 gap-12">
      {data?.featured_cities && data?.featured_cities?.length > 0 && (
        <div className="mt-12 col-span-6 xl:col-span-4">
          <h3 className="text-lg font-semibold mb-4">Featured Cities</h3>
          <div className="grid xl:grid-cols-3 gap-3 xl:gap-2">
            {data.featured_cities.map((city, idx) => (
              <CityCompactCard key={idx} slug={city} />
            ))}
          </div>
        </div>
      )}
      {data?.tour_highlights && data?.tour_highlights?.length > 0 && (
        <div className="mt-12 col-span-6 xl:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Tour Highlights</h3>
          <ul className="flex flex-col gap-3">
            {data.tour_highlights.map(
              ({ content }, idx) =>
                content && (
                  <li key={idx} className="rounded-lg bg-muted p-6">
                    <p className="text-md font-medium text-secondary">
                      {content}
                    </p>
                  </li>
                )
            )}
          </ul>
        </div>
      )}
    </div>
    <div className="mt-12">
      {data?.featured_accommodations &&
        data?.featured_accommodations?.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-semibold mb-4">
              Featured Accommodations
            </h3>
            <div className="grid xl:grid-cols-3 gap-3">
              {data.featured_accommodations.map((accommodation, idx) => (
                <AccommodationCompactCard key={idx} slug={accommodation} />
              ))}
            </div>
          </div>
        )}
    </div>
    {data?.gallery && data?.gallery?.length > 0 && (
      <div className="mt-12">
        <h3 className="text-lg font-semibold mb-4">Gallery</h3>
        <Gallery>
          {(Array.isArray(data.gallery) ? data.gallery : [data.gallery]).map(
            (image, idx) => (
              <Image
                key={idx}
                src={
                  image ??
                  `data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`
                }
                placeholder={`data:image/svg+xml;base64,${toBase64(
                  shimmer(700, 475)
                )}`}
                alt={`Gallery image ${idx}`}
                width={800}
                height={500}
                priority={false}
              />
            )
          )}
        </Gallery>
      </div>
    )}
  </div>
);

const Itinerary = ({ data }: z.infer<typeof ApiResponseSchema>) => (
  <div>
    {data?.itinerary_milestones && data?.itinerary_milestones.length > 0 && (
      <div>
        <h2 className="text-xl font-bold mb-4">Itinerary Milestones</h2>
        <div className="flex flex-col gap-4">
          {data.itinerary_milestones.map(
            (
              { name, image, content, activities, accommodations, cities },
              idx
            ) => (
              <div
                key={idx}
                className="rounded-lg bg-slate-50 overflow-hidden border flex flex-col xl:flex-row"
              >
                <Image
                  src={
                    image ??
                    `data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`
                  }
                  placeholder={`data:image/svg+xml;base64,${toBase64(
                    shimmer(700, 475)
                  )}`}
                  className="object-cover h-auto w-auto xl:min-w-[400px] xl:w-[400px]"
                  alt={name}
                  width={400}
                  height={200}
                  priority={false}
                />
                <div className="py-4 px-6">
                  <h3 className="text-lg font-bold">{name}</h3>
                  {content && <RichText content={content} />}
                  {activities && activities.length > 0 && (
                    <div className="mt-3">
                      <div className="text-md font-medium">Activities</div>
                      <div className="mt-1 grid grid-cols-2 xl:grid-cols-3 gap-2">
                        {activities?.map(({ slug }, idx) => (
                          <ActivityCompactCard
                            key={idx}
                            slug={slug}
                            layout="horizontal"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {accommodations && accommodations.length > 0 && (
                    <div className="mt-3">
                      <div className="text-md font-medium">Accommodations</div>
                      <div className="mt-1 grid grid-cols-2 xl:grid-cols-3 gap-2">
                        {accommodations?.map(({ slug }, idx) => (
                          <AccommodationCompactCard
                            key={idx}
                            slug={slug}
                            layout="horizontal"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {cities && cities.length > 0 && (
                    <div className="mt-3">
                      <div className="text-md font-medium">Cities</div>
                      <div className="mt-1 flex gap-2">
                        {cities?.map(({ slug }, idx) => (
                          <CityCompactCard
                            key={idx}
                            slug={slug}
                            layout="horizontal"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    )}
  </div>
);
const Activities = ({ data }: z.infer<typeof ApiResponseSchema>) => {
  const activities = data?.itinerary_milestones
    ?.flatMap((milestone) => milestone.activities)
    .filter((activity) => activity != null)
    .filter(
      ({ slug }, index, self) =>
        index === self.findIndex((activity) => activity.slug === slug)
    );

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Activities</h2>
      {activities && activities.length > 0 && (
        <div className="mt-4 grid grid-cols-1 xl:grid-cols-3 gap-4">
          {activities?.map(({ slug }, idx) => (
            <ActivityCard key={idx} slug={slug} />
          ))}
        </div>
      )}
    </div>
  );
};
const PackageIncludes = ({ data }: z.infer<typeof ApiResponseSchema>) => (
  <div>
    {data?.package_includes && (
      <>
        <h2 className="text-xl font-bold mb-4">Package Includes</h2>
        <RichText content={data.package_includes} />
      </>
    )}
  </div>
);

const tabs = [
  { name: "overview", title: "Overview", Component: Overview },
  { name: "itinerary", title: "Itienrary", Component: Itinerary },
  { name: "activities", title: "Activities", Component: Activities },
  {
    name: "package-includes",
    title: "Package Includes",
    Component: PackageIncludes,
  },
];

const Aside = ({ data }: z.infer<typeof ApiResponseSchema>) => (
  <div className="top-[150px] w-full">
    <div className="rounded-lg bg-muted p-6">
      <div className="text-center border-b border-muted-foreground px-4 pb-4">
        <h3 className="text-3xl font-semibold">Ready to start your journey?</h3>
        <p className="mt-3 text-md font-semibold">
          Choose dates, passengers, and we will take care of your dream
          vacation.
        </p>
      </div>
      <div className="mt-3 rounded-lg bg-white py-6 px-8 flex items-center">
        <div className="border-r border-slate-600 text-secondary">
          <span className="text-sm font-semibold">Starting From</span>
          <p className="pr-3">
            {data?.is_sale_active ? (
              <>
                <PriceTag
                  amount={data.price}
                  className="block text-md font-semibold line-through leading-6"
                />
                <PriceTag
                  amount={data?.sale_price}
                  className="text-3xl font-semibold"
                />
              </>
            ) : (
              <PriceTag
                amount={data?.price}
                className="text-3xl font-semibold"
              />
            )}
          </p>
        </div>
        <div className="pl-3 text-lg">
          {data?.days_count_html && (
            <div
              dangerouslySetInnerHTML={{ __html: data?.days_count_html }}
              className="text-secondary text-xl font-semibold [&>span]:block [&>span]:text-sm [&>span]:font-semibold [&>span]:leading-[16px]"
            />
          )}
        </div>
      </div>
      <p className="mt-2 text-xs font-semibold text-center">
        {data?.price_description}
      </p>
      <Link
        href="#inquiry_form"
        className="mt-4 block rounded bg-secondary text-white p-3 uppercase text-md text-center font-medium"
      >
        Plan your trip
      </Link>
    </div>
    {data?.map && (
      <div className="mt-8">
        <div
          dangerouslySetInnerHTML={{ __html: data.map }}
          className="rounded-lg overflow-hidden [&>iframe]:w-full [&>iframe]:h-[460px]"
        />
      </div>
    )}
  </div>
);

const TopBar = ({ data }: z.infer<typeof ApiResponseSchema>) => (
  <div style={{ backgroundColor: data?.destination?.color }}>
    <div className="container mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row justify-between gap-8">
      <div className="flex items-center gap-8">
        <div className="font-semibold">
          <Breadcrumb />
          <h1 className="text-3xl text-white">{data?.name}</h1>
        </div>
        <div className="border-l border-l-slate-600 px-4">
          <div className="px-2 text-lg min-w-[100px]">
            {data?.days_count_html && (
              <div
                dangerouslySetInnerHTML={{ __html: data?.days_count_html }}
                className="text-2xl font-bold text-white [&>span]:block [&>span]:text-sm [&>span]:font-semibold [&>span]:leading-[16px]"
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {data?.tags?.map(({ name }, idx) => (
          <span
            key={idx}
            className="h-fit border rounded border-white text-white py-1 px-3 font-semibold text-xs uppercase"
          >
            {name}
          </span>
        ))}
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
    `${process.env.API_URL}/modules/itinerary/index?${query}`
  );

  if (!response.ok) {
    const errorMessage = `Failed to fetch: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  const { data } = await response.json();

  return data.map(({ slug }: { slug: string }) => ({
    slug: slug,
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
        "price",
        "sale_price",
        "rating",
        "duration",
        "featured_image",
        "featured_image_mobile",
        "gallery",
        "days_count_html",
        "map",
        "is_sale_active",
        "code",
        "short_description",
        "overview",
        "terms_and_conditions",
        "package_includes",
        "meta_title",
        "meta_description",
        "price_description",
        "featured_cities",
        "featured_accommodations",
        "tour_highlights",
        "destination",
        "itinerary_milestones",
        "tags",
      ],
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/modules/itinerary/${slug}?${query}`,
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
  price: z.string().nullable(),
  sale_price: z.string().nullable(),
  rating: z.number().nullable(),
  duration: z.string().nullable(),
  days_count_html: z.string().nullable(),
  map: z.string().nullable(),
  is_sale_active: z.number().nullable(),
  code: z.string().nullable(),
  short_description: z.string().nullable(),
  overview: z.string().nullable(),
  terms_and_conditions: z.string().nullable(),
  package_includes: z.string().nullable(),
  meta_title: z.string().nullable(),
  meta_description: z.string().nullable(),
  price_description: z.string().nullable(),
  featured_cities: z.array(z.string()).nullable(),
  featured_accommodations: z.array(z.string()).nullable(),
  tour_highlights: z
    .array(z.object({ content: z.string().nullable() }))
    .nullable(),
  featured_image: z.string(),
  featured_image_mobile: z.string().nullable(),
  listing_image: z.string().nullable().optional(),
  gallery: z
    .union([z.array(z.string()).nullable(), z.string().nullable()])
    .nullable()
    .optional(),
  tags: z.array(z.object({ name: z.string(), slug: z.string() })).nullable(),
  destination: z.object({
    name: z.string(),
    slug: z.string(),
    color: z.string(),
  }),
  itinerary_milestones: z
    .array(
      z.object({
        name: z.string(),
        content: z.string().nullable().optional(),
        image: z.string().nullable().optional(),
        cities: z
          .array(
            z.object({
              name: z.string(),
              slug: z.string(),
            })
          )
          .nullable()
          .optional(),
        accommodations: z
          .array(
            z.object({
              name: z.string(),
              slug: z.string(),
            })
          )
          .nullable()
          .optional(),
        activities: z
          .array(
            z.object({
              name: z.string(),
              slug: z.string(),
            })
          )
          .nullable()
          .optional(),
      })
    )
    .nullable()
    .optional(),
});

const ApiResponseSchema = z.object({
  data: Schema.nullable(),
});

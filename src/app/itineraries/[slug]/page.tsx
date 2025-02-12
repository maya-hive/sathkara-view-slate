import { toBase64 } from "@/utils/base64";
import Image from "next/image";
import Link from "next/link";
import queryString from "query-string";
import { z } from "zod";

import { AccommodationCompactCard } from "@/components/Accommodation/CompactCard";
import { CityCompactCard } from "@/components/City/CompactCard";
import { shimmer } from "@/components/Shimmer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const { data } = await fetchData(slug);

  if (!data) {
    return <></>;
  }

  return (
    <article>
      <Banner
        image={data.featured_image}
        thumbnail={data.featured_image_mobile}
        alt={data.name}
      />
      <TopBar data={data} />
      <div className="container mx-auto">
        <Tabs defaultValue={"overview"}>
          <div className="grid grid-cols-1 md:grid-cols-[auto_380px] gap-12 md:pt-12">
            <div>
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
              </div>
            </div>
            <Aside data={data} />
          </div>
        </Tabs>
      </div>
    </article>
  );
}

const Banner = ({
  image,
  thumbnail,
  alt,
}: {
  image: string;
  thumbnail: string | null;
  alt: string;
}) => (
  <div className="relative pt-[400px]">
    <Image
      className="xs:block absolute left-0 top-0 w-full h-full object-cover"
      src={image ?? `data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
      alt={alt}
      placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
      width={1200}
      height={800}
      priority={true}
    />
    <Image
      className="md:hidden absolute left-0 top-0 w-full h-full object-cover"
      src={
        thumbnail ?? `data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`
      }
      alt={alt}
      placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
      width={400}
      height={600}
      priority={true}
    />
  </div>
);

const Overview = ({ data }: z.infer<typeof ApiResponseSchema>) => (
  <div>
    {data?.overview && (
      <div>
        <h2 className="text-xl font-bold mb-4">Tour Overview</h2>
        <div
          dangerouslySetInnerHTML={{ __html: data.overview }}
          className="[&>p]:text-md [&>p]:font-medium"
        />
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
            {data.tour_highlights.map(({ content }, idx) => (
              <li key={idx} className="rounded-lg bg-sky-200 p-6">
                <p className="text-md font-medium text-sky-800">{content}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    <div className="mt-12">
      {data?.featured_accommodations &&
        data?.featured_accommodations?.length > 0 && (
          <div className="mt-12 col-span-4">
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
  </div>
);

const Itinerary = ({}: z.infer<typeof ApiResponseSchema>) => (
  <div>
    <h2 className="text-xl font-bold mb-4">Itinerary</h2>
  </div>
);
const Activities = ({}: z.infer<typeof ApiResponseSchema>) => (
  <div>
    <h2 className="text-xl font-bold mb-4">Activities</h2>
  </div>
);
const PackageIncludes = ({}: z.infer<typeof ApiResponseSchema>) => (
  <div>
    <h2 className="text-xl font-bold mb-4">Package Includes</h2>
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
  <div>
    <div className="rounded-lg bg-primary py-4 px-6">
      <div className="text-center border-b border-gray-400 px-8 pb-4">
        <h3 className="text-3xl font-medium">Ready to start your journey?</h3>
        <p className="mt-2 text-md">
          Choose dates, passengers, and we will take care of your dream vacation
        </p>
      </div>
      <div className="mt-2 rounded-lg bg-white py-6 px-8 flex">
        <div>
          <p className="pr-3 text-3xl">$ {data?.price?.replace(".00", "")}</p>
        </div>
        <div className="border-l border-slate-600 px-2 text-lg min-w-[100px]">
          {data?.days_count_html && (
            <div
              dangerouslySetInnerHTML={{ __html: data?.days_count_html }}
              className="font-extrabold [&>span]:block [&>span]:text-sm [&>span]:font-semibold [&>span]:leading-[16px]"
            />
          )}
        </div>
      </div>
      <p className="mt-2 text-xs font-semibold text-center">
        {data?.price_description}
      </p>
      <Link
        href="#"
        className="mt-4 block rounded bg-black text-white p-3 uppercase text-md text-center font-medium"
      >
        Plan your trip
      </Link>
    </div>
    <div className="mt-8">
      {data?.map && (
        <div
          dangerouslySetInnerHTML={{ __html: data.map }}
          className="rounded-lg overflow-hidden [&>iframe]:w-full [&>iframe]:h-[460px]"
        />
      )}
    </div>
  </div>
);

const TopBar = ({ data }: z.infer<typeof ApiResponseSchema>) => (
  <div style={{ backgroundColor: data?.destination?.color }}>
    <div className="container mx-auto py-4 flex flex-col md:flex-row justify-between gap-8">
      <div className="flex items-center gap-8">
        <div className="font-semibold">
          <p className="text-md">/Home/Itineraries/[slug]</p>
          <h1 className="text-3xl text-white">{data?.name}</h1>
        </div>
        <div className="border-l border-l-slate-600 px-4">
          <div className="px-2 text-lg min-w-[100px]">
            {data?.days_count_html && (
              <div
                dangerouslySetInnerHTML={{ __html: data?.days_count_html }}
                className="text-2xl font-extrabold [&>span]:block [&>span]:text-sm [&>span]:font-bold [&>span]:leading-[16px]"
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {data?.tags?.map(({ name, slug }, idx) => (
          <Link key={idx} href={`/itineraries?tags[]=${slug}`}>
            <span className="h-fit border rounded border-white text-white py-1 px-3 font-semibold text-xs uppercase">
              {name}
            </span>
          </Link>
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
        "destination_id",
        "price_description",
        "featured_cities",
        "featured_accommodations",
        "tour_highlights",
        "destination",
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
  destination_id: z.number().nullable(),
  price_description: z.string().nullable(),
  featured_cities: z.array(z.string()).nullable(),
  featured_accommodations: z.array(z.string()).nullable(),
  tour_highlights: z
    .array(z.object({ content: z.string().nullable() }))
    .nullable(),
  featured_image: z.string(),
  featured_image_mobile: z.string().nullable(),
  listing_image: z.string().nullable().optional(),
  tags: z.array(z.object({ name: z.string(), slug: z.string() })).nullable(),
  destination: z
    .object({
      name: z.string(),
      slug: z.string(),
      color: z.string(),
    })
    .nullable(),
});

const ApiResponseSchema = z.object({
  data: Schema.nullable(),
});

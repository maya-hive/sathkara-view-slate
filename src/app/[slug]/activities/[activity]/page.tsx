import Link from "next/link";
import Image from "next/image";
import queryString from "query-string";
import { z } from "zod";

import { Breadcrumb } from "@/components/Breadcrumb";
import { Banner } from "@/components/Banner";
import { CityCompactCard } from "@/components/City/CompactCard";
import { Gallery } from "@/components/Gallery";
import { shimmer } from "@/components/Shimmer";
import { toBase64 } from "@/utils/base64";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faMoneyBill,
  faStopwatch,
} from "@fortawesome/free-solid-svg-icons";
import { PriceTag } from "@/components/PriceTag";
import { ActivityInquiryForm } from "@/components/Activity/Inquiry/Form";
import { RichText } from "@/components/RichText";
import { NoData } from "@/app/no-data";

export default async function Page({
  params,
}: {
  params: Promise<{ activity: string }>;
}) {
  const slug = (await params).activity;
  const { data } = await fetchData(slug);

  if (!data) {
    return <NoData />;
  }

  return (
    <article>
      <Banner image={data.featured_image}>
        <div>
          <h1 className="text-5xl font-bold">{data.name}</h1>
          <div className="my-6 border-y border-secondary-foreground py-4">
            {(data.duration || data.best_time || data.approximate_charge) && (
              <div className="flex flex-col md:flex-row md:space-x-4 md:items-center">
                {data.duration && (
                  <div className="border-b md:border-b-0 md:border-r border-secondary-foreground pb-4 md:pb-0 md:pr-4">
                    <div className="flex items-center gap-2 text-md font-medium uppercase">
                      <FontAwesomeIcon icon={faStopwatch} />
                      Duration
                    </div>
                    <div className="mt-1 text-lgt-1">{data.duration}</div>
                  </div>
                )}
                {data.best_time && (
                  <div className="border-b md:border-b-0 md:border-r border-secondary-foreground py-4 md:py-0 md:pr-4">
                    <div className="flex items-center gap-2 text-md font-medium uppercase">
                      <FontAwesomeIcon icon={faCalendar} />
                      Best Time
                    </div>
                    <div className="mt-1 text-lgt-1">{data.best_time}</div>
                  </div>
                )}
                {data.approximate_charge && (
                  <div className="pr-4">
                    <div className="flex items-center gap-2 text-md font-medium uppercase">
                      <FontAwesomeIcon icon={faMoneyBill} />
                      Approx. Charge
                    </div>
                    <PriceTag
                      className="block mt-1 text-lg"
                      amount={data.approximate_charge}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          <p className="mt-4">{data.short_description}</p>
          <Link
            href="/itineraries"
            className="block rounded w-fit mt-5 bg-primary text-white px-10 py-2 text-center text-md font-semibold uppercase"
          >
            Plan Your Trip
          </Link>
        </div>
      </Banner>
      <TopBar data={data} />
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12 md:pt-12">
          <div className="md:min-w-[calc(100%-400px)] xl:max-w-[calc(100%-400px)]">
            <div className="mt-8">
              <div className="mt-4">
                {data.description && (
                  <div className="mt-4">
                    <h2 className="text-xl font-bold mb-4">
                      About The Activity
                    </h2>
                    <RichText content={data.description} />
                  </div>
                )}
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
              <ActivityInquiryForm />
            </div>
          </div>
          <div className="top-[150px] w-full">
            {data?.city && (
              <div>
                <h3 className="mb-4 text-lg font-semibold">
                  Activity Location
                </h3>
                <div className="w-100">
                  <CityCompactCard slug={data.city.slug} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

const TopBar = ({ data }: z.infer<typeof ApiResponseSchema>) => (
  <div className="bg-primary">
    <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between gap-8">
      <div className="flex items-center gap-8">
        <div className="font-semibold">
          <Breadcrumb />
          <h1 className="text-3xl text-white">{data?.name}</h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {data?.categories.map(({ name, slug }, idx) => (
          <Link key={idx} href={`/activity-categories/${slug}`}>
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
    `${process.env.API_URL}/modules/activity/index?${query}`
  );

  if (!response.ok) {
    const errorMessage = `Failed to fetch: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  const { data } = await response.json();

  return data.map(({ slug }: { slug: string }) => ({
    activity: slug,
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
        "duration",
        "best_time",
        "approximate_charge",
        "featured_image",
        "gallery",
        "description",
        "short_description",
        "categories",
        "country",
        "city",
        "meta_title",
        "meta_description",
      ],
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/modules/activity/${slug}?${query}`,
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
  duration: z.string().nullable(),
  best_time: z.string().nullable(),
  approximate_charge: z.string().nullable(),
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
  country: z.object({
    name: z.string(),
    slug: z.string(),
  }),
  categories: z.array(z.object({ name: z.string(), slug: z.string() })),
  city: z.object({ name: z.string(), slug: z.string() }).nullable(),
});

const ApiResponseSchema = z.object({
  data: Schema.nullable(),
});

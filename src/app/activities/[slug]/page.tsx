import Link from "next/link";
import queryString from "query-string";
import { z } from "zod";

import { Breadcrumb } from "@/components/Breadcrumb";
import { Banner } from "@/components/Banner";
import { CityCompactCard } from "@/components/City/CompactCard";
import { Gallery } from "@/components/Gallery";
import Image from "next/image";
import { shimmer } from "@/components/Shimmer";
import { toBase64 } from "@/utils/base64";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faMoneyBill,
  faStopwatch,
} from "@fortawesome/free-solid-svg-icons";
import { PriceTag } from "@/components/PriceTag";

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
      <Banner image={data.featured_image}>
        <div>
          <h1 className="text-5xl font-bold">{data.name}</h1>
          <div className="my-6 border-y border-cyan-600 py-4">
            {(data.duration || data.best_time || data.approximate_charge) && (
              <div className="flex flex-col md:flex-row md:space-x-4 md:items-center">
                {data.duration && (
                  <div className="border-b md:border-b-0 md:border-r border-cyan-600 pb-4 md:pb-0 md:pr-4">
                    <div className="flex items-center gap-2 text-md font-medium uppercase">
                      <FontAwesomeIcon icon={faStopwatch} />
                      Duration
                    </div>
                    <div className="mt-1 text-lgt-1">{data.duration}</div>
                  </div>
                )}
                {data.best_time && (
                  <div className="border-b md:border-b-0 md:border-r border-cyan-600 py-4 md:py-0 md:pr-4">
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
            className="block rounded w-fit mt-5 bg-yellow-400 text-yellow-800 px-10 py-2 text-center text-md font-semibold uppercase"
          >
            Plan Your Trip
          </Link>
        </div>
      </Banner>
      <TopBar data={data} />
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-12 md:pt-12">
          <div className="md:min-w-[calc(100%-400px)] md:w-[calc(100%-400px)]">
            <div className="mt-8">
              <div className="mt-4">
                {data.description && (
                  <div className="mt-4">
                    <h2 className="text-xl font-bold mb-4">
                      About The Activity
                    </h2>
                    <div
                      dangerouslySetInnerHTML={{ __html: data.description }}
                    />
                  </div>
                )}
                {data?.cities && data?.cities?.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">
                      Availbale Cities
                    </h3>
                    <div className="grid xl:grid-cols-4 gap-3 xl:gap-2">
                      {data.cities.map(({ slug }, idx) => (
                        <CityCompactCard key={idx} slug={slug} />
                      ))}
                    </div>
                  </div>
                )}
                {data?.gallery && data?.gallery?.length > 0 && (
                  <div className="mt-12">
                    <h3 className="text-lg font-semibold mb-4">Gallery</h3>
                    <Gallery>
                      {data.gallery.map((image, idx) => (
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
            </div>
          </div>
          <div className="md:w-[400px]">
            <Aside data={data} />
          </div>
        </div>
      </div>
    </article>
  );
}

const Aside = ({}: z.infer<typeof ApiResponseSchema>) => (
  <div className="sticky top-10">
    <div className="rounded-lg bg-blue-100 p-6">
      <div className="text-center border-b border-slate-400 px-4 pb-4">
        <h3 className="text-3xl text-slate-900 font-semibold">
          Ready to start your journey?
        </h3>
        <p className="mt-3 text-md font-semibold">
          Choose dates, passengers, and we will take care of your dream vacation
        </p>
      </div>
      <Link
        href="#"
        className="mt-4 block rounded bg-black text-white p-3 uppercase text-md text-center font-medium"
      >
        Plan your trip
      </Link>
    </div>
  </div>
);

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
    `${process.env.API_URL}/modules/activity/index?${query}`
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
        "duration",
        "best_time",
        "approximate_charge",
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
  gallery: z.array(z.string()).nullable().optional(),
  cities: z.array(z.object({ name: z.string(), slug: z.string() })).nullable(),
});

const ApiResponseSchema = z.object({
  data: Schema.nullable(),
});

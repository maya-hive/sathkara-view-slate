import queryString from "query-string";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";

import { faCalendar, faStopwatch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { shimmer } from "@/components/Shimmer";
import { currencySymbol } from "@/components/PriceTag";
import { toBase64 } from "@/utils/base64";
import { cn } from "@/lib/utils";

interface Props {
  slug: string;
}

export const ActivityCard = async ({ slug }: Props) => {
  const { data } = await fetchData(slug);

  if (!data) {
    return null;
  }

  return <CardLayout data={data} />;
};

const CardLayout = ({ data }: z.infer<typeof ApiResponseSchema>) => {
  if (!data) {
    return null;
  }

  const slug = `/${data.destination.slug}/activities/${data.slug}`;

  return (
    <Link
      href={slug}
      className="relative pt-[260px] rounded-lg overflow-hidden flex flex-col justify-between"
    >
      <div className="absolute top-0 right-4 z-10">
        <h4
          className="rounded-b text-white text-sm font-semibold w-fit py-2 px-5 uppercase"
          style={{ backgroundColor: data.destination.color }}
        >
          {data.destination.name}
        </h4>
      </div>
      <div className="text-white relative z-10 p-4 flex flex-col h-full">
        <div className="border-b">
          <h3 className="mt-2 pb-2 font-bold text-2xl">{data.name}</h3>
        </div>
        <div className="flex-col h-full my-2">
          {(data.duration || data.best_time || data.approximate_charge) && (
            <div className="flex px-1 space-x-4">
              {data.duration && (
                <div className="border-r border-r-gray-600 pr-4">
                  <div className="flex items-center gap-2 text-md font-medium uppercase">
                    <FontAwesomeIcon icon={faStopwatch} />
                    Duration
                  </div>
                  <div className="mt-1 text-md">{data.duration}</div>
                </div>
              )}
              {data.best_time && (
                <div className="pr-4">
                  <div className="flex items-center gap-2 text-md font-medium uppercase">
                    <FontAwesomeIcon icon={faCalendar} />
                    Best Time
                  </div>
                  <div className="mt-1 text-md">{data.best_time}</div>
                </div>
              )}
            </div>
          )}
        </div>
        {data.approximate_charge && (
          <div className="mt-2 rounded bg-white text-black p-4 flex justify-between font-bold">
            <div className="flex border-yellow-500 px-3">
              <div className="pr-4">
                <p className="text-xs">Approximate Charge</p>
                <span
                  className={cn(
                    "flex items-center gap-2",
                    String(data.approximate_charge).length > 10 &&
                      "flex-col items-start gap-0"
                  )}
                >
                  <span className="text-2xl">
                    {currencySymbol} {data.approximate_charge}
                  </span>
                  <p className="text-sm">{data.charge_description}</p>
                </span>
              </div>
            </div>
          </div>
        )}
        <div className="mt-2 w-100 pt-2 text-white text-md text-center font-semibold uppercase">
          <div className="rounded w-full bg-primary p-3 flex flex-col justify-center items-center">
            Learn More About The Activity
          </div>
        </div>
      </div>
      <Image
        className="w-full h-full object-cover absolute top-0 left-0"
        src={data.listing_image ?? data.featured_image}
        alt={data.name}
        placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
        priority={false}
        width={500}
        height={400}
      />
      <div className="absolute bottom-0 left-0 h-[60%] w-full bg-gradient-to-b from-transparent to-black to-[35%]"></div>
    </Link>
  );
};

const fetchData = async (
  slug: string
): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: [
        "id",
        "name",
        "status",
        "slug",
        "featured_image",
        "listing_image",
        "short_description",
        "duration",
        "best_time",
        "approximate_charge",
        "charge_description",
        "destination",
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

const ApiResponseSchema = z.object({
  data: z
    .object({
      id: z.number(),
      status: z.number(),
      name: z.string(),
      slug: z.string(),
      short_description: z.string(),
      featured_image: z.string(),
      listing_image: z.string().nullable().optional(),
      duration: z.string().nullable(),
      best_time: z.string().nullable(),
      approximate_charge: z.string().nullable(),
      charge_description: z.string().nullable().optional(),
      destination: z.object({
        name: z.string(),
        slug: z.string(),
        color: z.string(),
      }),
    })
    .nullable(),
});

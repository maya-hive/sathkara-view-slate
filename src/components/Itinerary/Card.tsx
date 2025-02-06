import { toBase64 } from "@/utils/base64";
import queryString from "query-string";
import Image from "next/image";
import Link from "next/link";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { z } from "zod";

import { shimmer } from "../Shimmer";

interface Props {
  slug?: string;
  data?: Itinerary;
}

type Itinerary = {
  id: number;
  status: number;
  name: string;
  slug: string;
  short_description: string;
  price: string;
  featured_image: string;
  listing_image?: string | null;
  sale_price?: string | null;
  duration?: string | null;
  destination?: {
    name: string;
  } | null;
};

export const ItineraryCard = async ({ slug, data }: Props) => {
  if (slug) {
    const { data } = await fetchData(slug);

    if (!data) {
      return null;
    }

    return <CardLayout data={data} />;
  }

  return <CardLayout data={data} />;
};

const CardLayout = ({ data }: Props) =>
  data && (
    <div className="border rounded">
      <div className="relative pt-[260px]">
        <Image
          className="rounded-t w-full h-full object-cover absolute top-0 left-0"
          src={data.listing_image ?? data.featured_image}
          alt={data.name}
          placeholder={`data:image/svg+xml;base64,${toBase64(
            shimmer(700, 475)
          )}`}
          priority={false}
          width={500}
          height={400}
        />
        <div className="p-4">
          {data.destination && (
            <div className="absolute bottom-0 right-5 z-10">
              <h4 className="rounded bg-orange-700 text-white w-fit py-2 px-5 uppercase">
                {data.destination.name}
              </h4>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 flex flex-col justify-between">
        <div className="">
          <h3 className="mt-2 pb-2 font-semibold text-2xl">{data.name}</h3>
          <div className="border-y py-3">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="max-w-5"
                size="xs"
              />
              <p className="text-sm">
                Wilpattu, Yala, Kandy, Polonnaruwa and More
              </p>
            </div>
          </div>
          <div className="border-y py-3">
            <p className="">{data.short_description}</p>
            <div className="mt-3 flex gap-3">
              <span className="border rounded border-blue-400 bg-blue-100 py-1 px-3 text-sm">
                Wildlife
              </span>
              <span className="border rounded border-blue-400 bg-blue-100 py-1 px-3 text-sm">
                Adventure
              </span>
            </div>
          </div>
          <div className="mt-4 rounded bg-yellow-400 p-4 flex justify-between font-bold text-slate-800">
            <p className="px-2 text-lg">10 Days 9 Nights</p>
            <div className="flex border-l border-black px-3">
              <div>
                <p className="text-3xl">$ {data.price}</p>
                <p className="text-xs">
                  Includes Return International Flights & Cruise
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 w-100 flex gap-3">
          <Link
            href={"/itineraries/" + data.slug}
            className="rounded w-full bg-slate-200 font-medium p-4 flex justify-center items-center text-center "
          >
            Learn More About The Journey
          </Link>
          <Link
            href="#"
            className="rounded w-full bg-blue-400 font-medium p-4 flex justify-center items-center text-center"
          >
            Start Your Journey
          </Link>
        </div>
      </div>
    </div>
  );

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
        "sale_price",
        "featured_image",
        "listing_image",
        "short_description",
        "duration",
        "price",
      ],
      relations: ["destination"],
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

const ApiResponseSchema = z.object({
  data: z
    .object({
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
    })
    .nullable(),
});

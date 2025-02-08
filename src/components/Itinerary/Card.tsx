import { toBase64 } from "@/utils/base64";
import queryString from "query-string";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";

import { shimmer } from "../Shimmer";
import { redirect } from "next/navigation";

interface Props {
  slug: string;
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

export const ItineraryCard = async ({ slug }: Props) => {
  const { data } = await fetchData(slug);

  if (!data) {
    return redirect("/");
  }

  return <CardLayout data={data} />;
};

const CardLayout = ({ data }: { data: Itinerary }) => (
  <div className="border rounded-lg overflow-hidden flex flex-col justify-between">
    <div className="relative pt-[260px]">
      <Link href={"/itineraries/" + data.slug}>
        <Image
          className="w-full h-full object-cover absolute top-0 left-0"
          src={data.listing_image ?? data.featured_image}
          alt={data.name}
          placeholder={`data:image/svg+xml;base64,${toBase64(
            shimmer(700, 475)
          )}`}
          priority={false}
          width={500}
          height={400}
        />
      </Link>
      <div className="p-4">
        {data.destination && (
          <div className="absolute bottom-0 right-5 z-10">
            <h4 className="rounded-t bg-orange-400 text-white text-sm font-semibold w-fit py-2 px-5 uppercase">
              {data.destination.name}
            </h4>
          </div>
        )}
      </div>
    </div>
    <div className="p-4 flex flex-col h-full">
      <div className="flex flex-col h-full">
        <Link href={"/itineraries/" + data.slug}>
          <h3 className="mt-2 pb-2 font-bold text-2xl">{data.name}</h3>
        </Link>
        <div className="border-y py-3">
          <div className="flex items-center gap-2">
            <MapIcon />
            <p className="text-sm font-semibold">
              Wilpattu, Yala, Kandy, Polonnaruwa and More
            </p>
          </div>
        </div>
        <div className="border-b py-3 flex flex-col flex-1">
          <p className="text-sm font-semibold text-neutral-700">
            {data.short_description}
          </p>
          <div className="mt-2 flex gap-3">
            <span className="border rounded border-sky-400 text-sky-400 py-1 px-3 font-semibold text-xs uppercase">
              Wildlife
            </span>
            <span className="border rounded border-sky-400 text-sky-400 py-1 px-3 font-semibold text-xs uppercase">
              Adventure
            </span>
          </div>
        </div>
        <div className="mt-2 rounded bg-yellow-300 p-4 flex justify-between font-bold">
          <div className="px-2 text-lg min-w-[100px]">
            <p className="font-extrabold">10 Days</p>
            <p className="text-sm leading-[16px]">9 Nights</p>
          </div>
          <div className="flex border-l border-yellow-500 px-3">
            <div>
              <p className="text-3xl">$ {data.price.replace(".00", "")}</p>
              <p className="text-xs">
                Includes Return International Flights & Cruise
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 border-t w-100 pt-2 flex gap-3 text-white text-md text-center font-semibold uppercase">
        <Link
          href={"/itineraries/" + data.slug}
          className="rounded bg-gradient-to-b from-neutral-500 via-neutral-400 to-neutral-300 p-3 flex flex-col justify-center items-center flex-1"
        >
          Learn More <br />
          About The Journey
        </Link>
        <Link
          href="#"
          className="rounded w-full bg-blue-400 p-3 flex flex-col justify-center items-center flex-1"
        >
          Start Your <br />
          Journey
        </Link>
      </div>
    </div>
  </div>
);

const MapIcon = () => (
  <svg
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13 7.81818C13 11.9545 7.5 15.5 7.5 15.5C7.5 15.5 2 11.9545 2 7.81818C2 6.40771 2.57946 5.05501 3.61091 4.05766C4.64236 3.06031 6.04131 2.5 7.5 2.5C8.95869 2.5 10.3576 3.06031 11.3891 4.05766C12.4205 5.05501 13 6.40771 13 7.81818Z"
      stroke="#FFC60D"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 9.5C8.32843 9.5 9 8.82843 9 8C9 7.17157 8.32843 6.5 7.5 6.5C6.67157 6.5 6 7.17157 6 8C6 8.82843 6.67157 9.5 7.5 9.5Z"
      stroke="#FFC60D"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
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

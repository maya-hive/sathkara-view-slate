import { toBase64 } from "@/utils/base64";
import queryString from "query-string";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";

import { shimmer } from "../Shimmer";

interface Props {
  slug: string;
}

type Activity = {
  id: number;
  status: number;
  name: string;
  slug: string;
  short_description: string;
  featured_image: string;
  listing_image?: string | null;
  duration?: string | null;
};

export const ActivityCard = async ({ slug }: Props) => {
  const { data } = await fetchData(slug);

  if (!data) {
    return <></>;
  }

  return <CardLayout data={data} />;
};

const CardLayout = ({ data }: { data: Activity }) => (
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
    </div>
    <div className="p-4 flex flex-col h-full">
      <div className="flex flex-col h-full">
        <Link href={"/itineraries/" + data.slug}>
          <h3 className="mt-2 pb-2 font-bold text-2xl">{data.name}</h3>
        </Link>
        <div className="border-b py-3 flex flex-col flex-1">
          <p className="text-sm font-semibold text-neutral-700">
            {data.short_description}
          </p>
        </div>
      </div>
      <div className="mt-2 w-100 pt-2 flex gap-3 text-white text-md text-center font-semibold uppercase">
        <Link
          href={"/activities/" + data.slug}
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
    })
    .nullable(),
});

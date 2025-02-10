import { toBase64 } from "@/utils/base64";
import queryString from "query-string";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";

import { shimmer } from "../Shimmer";

interface Props {
  slug: string;
}

type Destination = {
  id: number;
  status: number;
  name: string;
  slug: string;
  short_description: string;
  featured_image: string;
  listing_image?: string | null;
};

export const DestinationCard = async ({ slug }: Props) => {
  const { data } = await fetchData(slug);

  if (!data) {
    return <></>;
  }

  return <CardLayout data={data} />;
};

const CardLayout = ({ data }: { data: Destination }) => (
  <div className="rounded-md overflow-hidden">
    <div className="relative h-full pt-[300px] flex items-end text-white">
      <div className="relative z-20 p-8">
        <h3 className="text-4xl font-semibold">{data.name}</h3>
        <p className="mt-1">Tour Options</p>
        <Link
          href={"/itineraries/" + data.slug}
          className="mt-2 block w-fit border-2 border-sky-500 text-sky-500 rounded py-1 px-6 font-medium text-md uppercase"
        >
          Plan Your Trip
        </Link>
      </div>
      <Image
        className="w-full h-full object-cover absolute top-0 left-0 -z-10"
        src={data.listing_image ?? data.featured_image}
        alt={data.name}
        placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
        priority={false}
        width={500}
        height={400}
      />
      <span className="absolute bottom-0 left-0 h-[240px] w-full bg-gradient-to-b from-transparent to-black"></span>
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
    })
    .nullable(),
});

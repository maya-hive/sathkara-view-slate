import queryString from "query-string";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";

import { shimmer } from "@/components/Shimmer";
import { toBase64 } from "@/utils/base64";

interface Props {
  slug: string;
}

export const DestinationCard = async ({ slug }: Props) => {
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

  const slug = `/destinations/${data.slug}`;

  return (
    <Link href={slug} className="rounded-md overflow-hidden">
      <div className="relative h-full pt-[300px] flex items-end text-white">
        <div className="relative z-20 p-8 w-full text-center md:text-left">
          <h3 className="text-4xl font-semibold">{data.name}</h3>
          <p className="mt-1 font-medium">
            {data.itineraries?.length
              ? `${data.itineraries.length} Tour Options`
              : `Upcoming tours`}
          </p>
          <div className="mt-6 block mx-auto md:mx-0 w-fit border-2 border-primary text-primary rounded py-1 px-6 font-medium text-sm uppercase">
            Plan Your Trip
          </div>
        </div>
        <Image
          className="w-full h-full object-cover absolute top-0 left-0 -z-10"
          src={data.listing_image ?? data.featured_image}
          alt={data.name}
          placeholder={`data:image/svg+xml;base64,${toBase64(
            shimmer(700, 475)
          )}`}
          priority={false}
          width={500}
          height={400}
        />
        <span className="absolute bottom-0 left-0 h-[280px] w-full bg-gradient-to-b from-transparent to-black"></span>
      </div>
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
        "itineraries",
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
      itineraries: z
        .array(
          z.object({ id: z.number(), status: z.number(), slug: z.string() })
        )
        .nullable(),
    })
    .nullable(),
});

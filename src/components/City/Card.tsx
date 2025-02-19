import queryString from "query-string";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";

import { shimmer } from "@/components/Shimmer";
import { toBase64 } from "@/utils/base64";

interface Props {
  slug: string;
}

export const CityCard = async ({ slug }: Props) => {
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

  const slug = `/${data.destination.slug}/cities/${data.slug}`;

  return (
    <div className="relative pt-[260px] border rounded-lg overflow-hidden flex flex-col justify-between">
      <div className="text-white relative z-10 p-4 flex flex-col h-full">
        <div className="border-b">
          <Link href={slug}>
            <h3 className="mt-2 pb-2 font-bold text-2xl">{data.name}</h3>
          </Link>
        </div>
        <div className="mt-2 w-100 pt-2 text-white text-md text-center font-semibold uppercase">
          <Link
            href={slug}
            className="rounded w-full bg-blue-400 p-3 flex flex-col justify-center items-center"
          >
            Learn More About The City
          </Link>
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
      <div className="absolute bottom-0 left-0 h-full w-full bg-gradient-to-b from-transparent to-black to-[70%]"></div>
    </div>
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
        "destination",
      ],
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/modules/city/${slug}?${query}`,
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
      destination: z.object({
        name: z.string(),
        slug: z.string(),
        color: z.string(),
      }),
    })
    .nullable(),
});

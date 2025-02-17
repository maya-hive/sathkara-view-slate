import { toBase64 } from "@/utils/base64";
import queryString from "query-string";
import Image from "next/image";
import { z } from "zod";

import { shimmer } from "../Shimmer";
import Link from "next/link";

interface Props {
  slug: string;
  layout?: "default" | "horizontal";
}

type Activity = {
  id: number;
  status: number;
  name: string;
  slug: string;
  short_description: string;
  featured_image: string;
  listing_image?: string | null;
};

export const ActivityCompactCard = async ({
  slug,
  layout = "default",
}: Props) => {
  const { data } = await fetchData(slug);

  if (!data) {
    return <></>;
  }

  if (layout === "horizontal") {
    return <CardLayoutHorizontal data={data} />;
  }

  return <CardLayout data={data} />;
};

const CardLayout = ({ data }: { data: Activity }) => (
  <div className="rounded-md overflow-hidden">
    <div className="relative h-full pt-[180px] flex items-end text-white">
      <div className="relative z-20 p-8">
        <h3 className="text-2xl font-semibold">{data.name}</h3>
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
      <div className="absolute bottom-0 left-0 h-[150px] w-full bg-gradient-to-b from-transparent to-sky-600"></div>
    </div>
  </div>
);

const CardLayoutHorizontal = ({ data }: { data: Activity }) => (
  <Link href={"activities/" + data.slug} className="rounded-md overflow-hidden">
    <div className="flex text-white relative h-full pt-[80px] pb-[20px] px-4 z-10">
      <div className="relative z-20">
        <h3 className="text-md font-semibold">{data.name}</h3>
      </div>
      <Image
        className="w-full h-full object-cover absolute top-0 left-0 -z-10"
        src={data.listing_image ?? data.featured_image}
        alt={data.name}
        placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
        priority={false}
        width={200}
        height={100}
      />
      <div className="absolute bottom-0 left-0 h-full w-full bg-gradient-to-b from-transparent to-sky-600 to-[70%]"></div>
    </div>
  </Link>
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
    })
    .nullable(),
});

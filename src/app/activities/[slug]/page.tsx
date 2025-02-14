import Link from "next/link";
import queryString from "query-string";
import { z } from "zod";

import { Breadcrumb } from "@/components/Breadcrumb";
import { Banner } from "@/components/Banner";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const { data } = await fetchData(slug);

  if (!data) {
    return <></>;
  }

  return (
    <article>
      <Banner image={data.featured_image} />
      <TopBar data={data} />
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-12 md:pt-12">
          <div className="md:min-w-[calc(100%-400px)] md:w-[calc(100%-400px)]">
            <div className="mt-8"></div>
            <div className="mt-20 lg:mt-12"></div>
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
    <div className="rounded-lg bg-primary p-6">
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
        "featured_image",
        "gallery",
        "short_description",
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
  short_description: z.string().nullable(),
  meta_title: z.string().nullable(),
  meta_description: z.string().nullable(),
  featured_image: z.string(),
  listing_image: z.string().nullable().optional(),
  gallery: z.array(z.string()).nullable().optional(),
});

const ApiResponseSchema = z.object({
  data: Schema.nullable(),
});

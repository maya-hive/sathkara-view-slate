import { shimmer } from "@/components/Shimmer";
import { toBase64 } from "@/utils/base64";
import Image from "next/image";
import Link from "next/link";
import queryString from "query-string";
import { z } from "zod";

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
      <Banner image={data.featured_image} alt={data.name} />
      <TopBar data={data} />
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[auto_380px] gap-5 pt-12">
          <Main data={data} />
          <Aside data={data} />
        </div>
      </div>
    </article>
  );
}

const Banner = ({ image, alt }: { image: string | null; alt: string }) => (
  <div className="relative pt-[400px]">
    <Image
      className="absolute left-0 top-0 w-full h-full object-cover"
      src={image ?? `data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
      alt={alt}
      placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
      width={1200}
      height={800}
      priority={true}
    />
  </div>
);

const Main = ({ data }: z.infer<typeof ApiResponseSchema>) => (
  <div>
    {data?.package_includes && (
      <div>
        <h2 className="text-xl font-bold mb-4">Tour Overview</h2>
        <div dangerouslySetInnerHTML={{ __html: data.package_includes }} />
      </div>
    )}
  </div>
);

const Aside = ({ data }: z.infer<typeof ApiResponseSchema>) => (
  <div>
    <div className="rounded-lg bg-primary py-4 px-6">
      <div className="text-center border-b border-gray-400 px-8 pb-4">
        <h3 className="text-3xl font-medium">Ready to start your journey?</h3>
        <p className="mt-2 text-md">
          Choose dates, passengers, and we will take care of your dream vacation
        </p>
      </div>
      <div className="mt-2 rounded-lg bg-white py-6 px-8 flex">
        <div>
          <p className="pr-3 text-3xl">$ {data?.price?.replace(".00", "")}</p>
        </div>
        <div className="border-l border-slate-600 px-2 text-lg min-w-[100px]">
          <p className="font-extrabold">10 Days</p>
          <p className="text-sm font-semibold leading-[16px]">9 Nights</p>
        </div>
      </div>
      <p className="mt-2 text-xs font-semibold text-center">
        {data?.price_description}
      </p>
      <Link
        href="#"
        className="mt-4 block rounded bg-black text-white p-3 uppercase text-md text-center font-medium"
      >
        Plan your trip
      </Link>
    </div>
    <div className="mt-8">
      {data?.map && (
        <div
          dangerouslySetInnerHTML={{ __html: data.map }}
          className="rounded-lg overflow-hidden [&>iframe]:w-full [&>iframe]:h-[460px]"
        />
      )}
    </div>
  </div>
);

const TopBar = ({ data }: z.infer<typeof ApiResponseSchema>) => (
  <div className="bg-primary">
    <div className="container mx-auto py-4 flex justify-between gap-8">
      <div className="flex items-center gap-8">
        <div className="font-semibold">
          <p className="text-md">/Home/Itineraries/[slug]</p>
          <h1 className="text-3xl text-white">{data?.name}</h1>
        </div>
        <div className="border-l border-l-slate-600 px-4">
          <div className="px-2 text-lg min-w-[100px]">
            <p className="font-extrabold">10 Days</p>
            <p className="text-sm font-semibold leading-[16px]">9 Nights</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="h-fit border rounded border-white text-white py-1 px-3 font-semibold text-xs uppercase">
          Wildlife
        </span>
        <span className="h-fit border rounded border-white text-white py-1 px-3 font-semibold text-xs uppercase">
          Adventure
        </span>
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
    `${process.env.API_URL}/modules/itinerary/index?${query}`
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
        "price",
        "sale_price",
        "rating",
        "duration",
        "map",
        "is_sale_active",
        "code",
        "short_description",
        "overview",
        "terms_and_conditions",
        "package_includes",
        "meta_title",
        "meta_description",
        "destination_id",
        "price_description",
        "featured_cities",
        "featured_accommodations",
        "tour_highlights",
      ],
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

const Schema = z.object({
  status: z.number(),
  name: z.string(),
  slug: z.string(),
  price: z.string().nullable(),
  sale_price: z.string().nullable(),
  rating: z.number().nullable(),
  duration: z.string().nullable(),
  map: z.string().nullable(),
  is_sale_active: z.number().nullable(),
  code: z.string().nullable(),
  short_description: z.string().nullable(),
  overview: z.string().nullable(),
  terms_and_conditions: z.string().nullable(),
  package_includes: z.string().nullable(),
  meta_title: z.string().nullable(),
  meta_description: z.string().nullable(),
  destination_id: z.number().nullable(),
  price_description: z.string().nullable(),
  featured_cities: z.array(z.string()).nullable(),
  featured_accommodations: z.array(z.string()).nullable(),
  tour_highlights: z
    .array(z.object({ content: z.string().nullable() }))
    .nullable(),
  featured_image: z.string().nullable(),
  listing_image: z.string().nullable(),
});

const ApiResponseSchema = z.object({
  data: Schema.nullable(),
});

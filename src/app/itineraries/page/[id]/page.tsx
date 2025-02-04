import Image from "next/image";
import Link from "next/link";
import queryString from "query-string";
import { Suspense } from "react";
import { z } from "zod";

import { toBase64 } from "@/utils/base64";
import { shimmer } from "@/components/Shimmer";
import { redirect } from "next/navigation";
import { cn } from "@/app/lib/utils";

export default async function ItinearyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  if (id <= "1") {
    return redirect("/itineraries");
  }

  const { data, links } = await fetchData(id);

  if (!data) {
    return null;
  }

  return <ItineraryPageLayout data={data} links={links} />;
}

export const ItineraryPageLayout = ({
  data,
  links,
}: z.infer<typeof ApiResponseSchema>) => (
  <article className="container mx-auto">
    <div className="my-8">
      <div className="bg-slate-100 py-12">
        <h1 className="text-center text-2xl">Itineraries</h1>
      </div>
    </div>
    <div className="mt-12 grid grid-cols-3 gap-5">
      <Suspense fallback={<span>Loading</span>}>
        {data?.map((item, index) => (
          <Link key={index} href={"/itineraries/" + item.slug}>
            <Image
              className="rounded w-full h-[400px] object-cover"
              alt={"Featured image"}
              src={item.featured_image}
              priority={false}
              placeholder={`data:image/svg+xml;base64,${toBase64(
                shimmer(700, 475)
              )}`}
              width={500}
              height={400}
            />
            <h1 className="font-semibold mt-2">{item.name}</h1>
            <p>{item.short_description}</p>
            <p>Price: {item.price}</p>
          </Link>
        ))}
      </Suspense>
    </div>
    <div className="mt-8 w-full flex justify-center gap-4">
      {links?.map(
        ({ url, label, active }) =>
          url && (
            <Link
              key={label}
              href={url}
              className={cn(
                "block text-center min-w-[100px] py-2 text-sm",
                active ? "bg-blue-600 text-white" : "bg-slate-600 text-white"
              )}
            >
              <span dangerouslySetInnerHTML={{ __html: label }} />
            </Link>
          )
      )}
    </div>
  </article>
);

export async function generateStaticParams() {
  const query = queryString.stringify(
    { fields: ["id"] },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/modules/itinerary/index?${query}`
  );

  if (!response.ok) {
    const errorMessage = `Failed to fetch: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  const data = await response.json();

  const pages = new Array(data.last_page).fill(0).map((_, i) => ++i);

  return pages.map((id) => ({
    id: id.toString(),
  }));
}

const fetchData = async (
  id: string
): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: [
        "id",
        "name",
        "slug",
        "featured_image",
        "short_description",
        "price",
      ],
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/modules/itinerary/index?page=${id}&${query}`
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
  id: z.number(),
  name: z.string(),
  price: z.string(),
  slug: z.string(),
  short_description: z.string(),
  featured_image: z.string(),
});

const ApiResponseSchema = z.object({
  data: z.array(Schema).nullable(),
  links: z
    .array(
      z.object({
        url: z.string().nullable(),
        label: z.string(),
        active: z.boolean(),
      })
    )
    .nullable(),
});

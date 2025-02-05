import Link from "next/link";
import queryString from "query-string";
import { cache, Suspense } from "react";
import { z } from "zod";

import { redirect } from "next/navigation";
import { cn } from "@/app/lib/utils";
import { ItineraryCard } from "@/components/Itinerary/Card";

type Args = {
  params: Promise<{
    id?: string;
  }>;
};

export default async function ItinearyPage({ params }: Args) {
  const { id = "1" } = await params;

  if (id === "1") {
    return redirect("/itineraries");
  }

  const data = await fetchData(id);

  if (!data) {
    return null;
  }

  return <ItineraryPageLayout {...data} />;
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
    <div className="mt-12 grid grid-cols-1 md:grid-cols-[280px_auto] gap-5">
      <div>
        <div className="rounded bg-slate-100 h-full"></div>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Suspense fallback={<span>Loading</span>}>
            {data?.map((item) => (
              <ItineraryCard key={item.id} data={item} />
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
                    active
                      ? "bg-blue-600 text-white"
                      : "bg-slate-600 text-white"
                  )}
                >
                  <span dangerouslySetInnerHTML={{ __html: label }} />
                </Link>
              )
          )}
        </div>
      </div>
    </div>
  </article>
);

export async function generateStaticParams() {
  const { last_page } = await fetchData("1");

  const pages = new Array(last_page).fill(0).map((_, i) => ++i);

  return pages.map((id) => ({
    id: id.toString(),
  }));
}

export const fetchData = cache(
  async (id: string): Promise<z.infer<typeof ApiResponseSchema>> => {
    const query = queryString.stringify(
      {
        fields: [
          "id",
          "name",
          "status",
          "slug",
          "sale_price",
          "featured_image",
          "short_description",
          "duration",
          "price",
        ],
        relations: ["destination"],
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
  }
);

const Schema = z.object({
  id: z.number(),
  status: z.number(),
  name: z.string(),
  slug: z.string(),
  short_description: z.string(),
  price: z.string(),
  featured_image: z.string(),
  sale_price: z.string().nullable(),
  duration: z.string().nullable(),
  destination: z
    .object({
      name: z.string(),
    })
    .nullable(),
});

const ApiResponseSchema = z.object({
  data: z.array(Schema).nullable(),
  current_page: z.number().nullable(),
  last_page: z.number().nullable(),
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

import { Suspense } from "react";
import queryString from "query-string";
import { z } from "zod";

import { type PaginationLink, Pagination } from "@/components/Pagination";
import { Banner } from "@/components/Banner";
import { CityCard } from "@/components/City/Card";
import { CityListingAside as Aside } from "./Aside";

interface Props {
  data: City[] | null;
  current_page: number | null;
  last_page: number | null;
  links: PaginationLink[] | null;
  destination: string;
}

type City = {
  id: number;
  status: number;
  name: string;
  slug: string;
  short_description: string;
  featured_image: string;
};

export const CityListing = async ({ data, destination, links }: Props) => {
  if (!data?.length) {
    return null;
  }

  const { data: pageData } = await fetchData();

  return (
    <article>
      <Banner content={pageData?.page_content} image={pageData?.banner_image} />
      <div className="container mx-auto">
        <div className="mt-12 grid grid-cols-1 md:grid-cols-[280px_auto] gap-5">
          <Aside />
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              <Suspense fallback={<span>Loading</span>}>
                {data?.map((item) => (
                  <CityCard key={item.id} slug={item.slug} />
                ))}
              </Suspense>
            </div>
            <Pagination prefix={destination} links={links} />
          </div>
        </div>
      </div>
    </article>
  );
};

const fetchData = async (): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: ["page_content", "banner_image"],
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/settings/page_city_listing?${query}`,
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
      page_content: z.string().nullable().optional(),
      banner_image: z.string().nullable().optional(),
    })
    .nullable(),
});

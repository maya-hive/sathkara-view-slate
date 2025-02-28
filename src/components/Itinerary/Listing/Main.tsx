import queryString from "query-string";
import { z } from "zod";

import { type PaginationLink } from "@/components/Pagination";
import { ItineraryCard } from "@/components/Itinerary/Card";
import { SearchItineraries } from "@/components/Search/Itineraries";
import { ListView } from "@/components/ListView";

import { ItineraryListingAside as Aside } from "./Aside";
import { type BaseResource } from "@/types/ApiResponse.types";

interface Props {
  data: BaseResource[] | null;
  current_page: number | null;
  last_page: number | null;
  links: PaginationLink[] | null;
  destination?: string;
}

export const ItineraryListing = async ({ data, destination, links }: Props) => {
  if (!data?.length) return null;

  const { data: pageData } = await fetchData();

  return (
    <ListView
      links={links}
      banner={{
        image: pageData?.banner_image,
        title: pageData?.page_title,
      }}
      content={pageData?.page_content}
      destination={destination}
      resource="itineraries"
      aside={<Aside />}
      search={<SearchItineraries className="bg-white h-100" />}
      cards={data.map((item) => (
        <ItineraryCard key={item.id} slug={item.slug} />
      ))}
    />
  );
};

const fetchData = async (): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: ["page_title", "page_content", "banner_image"],
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/settings/page_itinerary_listing?${query}`,
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
      page_title: z.string().nullable().optional(),
      page_content: z.string().nullable().optional(),
      banner_image: z.string().nullable().optional(),
    })
    .nullable(),
});

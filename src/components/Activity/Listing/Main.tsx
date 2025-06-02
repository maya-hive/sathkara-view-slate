import queryString from "query-string";
import { z } from "zod";

import { ActivitySearchQuery as Search } from "@/components/Activity/Search/Query/Field";
import { type PaginationLink } from "@/components/Pagination";
import { ActivityCard } from "@/components/Activity/Card";
import { ListView } from "@/components/ListView";

import { ActivityListingAside as Aside } from "./Aside";
import { BaseResource } from "@/types/ApiResponse.types";
import { NoData } from "@/app/no-data";

interface Props {
  data: BaseResource[] | null;
  current_page: number | null;
  last_page: number | null;
  links: PaginationLink[] | null;
  country?: string;
}

export const ActivityListing = async ({ data, country, links }: Props) => {
  const { data: pageData } = await fetchData();

  if (!pageData) {
    return <NoData />;
  }

  return (
    <ListView
      links={links}
      banner={{
        image: pageData?.banner_image,
        title: pageData?.page_title,
      }}
      content={pageData?.page_content}
      country={country}
      aside={<Aside />}
      search={<Search />}
      cards={data?.map((item) => (
        <ActivityCard key={item.id} slug={item.slug} />
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
    `${process.env.API_URL}/settings/page_activity_listing?${query}`,
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

import queryString from "query-string";
import { z } from "zod";

import { type PaginationLink } from "@/components/Pagination";
import { DestinationCard } from "@/components/Destination/Card";
import { ListView } from "@/components/ListView";
import { type BaseResource } from "@/types/ApiResponse.types";

interface Props {
  data: BaseResource[] | null;
  current_page: number | null;
  last_page: number | null;
  links: PaginationLink[] | null;
}

export const DestinationListing = async ({ data, links }: Props) => {
  if (!data?.length) return null;

  const { data: pageData } = await fetchData();

  return (
    <ListView
      links={links}
      banner={{
        image: pageData?.banner_image,
        content: pageData?.page_content,
      }}
      cards={data.map((item) => (
        <DestinationCard key={item.id} slug={item.slug} />
      ))}
    />
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
    `${process.env.API_URL}/settings/page_destination_listing?${query}`,
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

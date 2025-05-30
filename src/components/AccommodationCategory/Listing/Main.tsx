import queryString from "query-string";
import { z } from "zod";

import { AccommodationSearchQuery as Search } from "@/components/Accommodation/Search/Query/Field";
import { type PaginationLink } from "@/components/Pagination";
import { AccommodationCard } from "@/components/Accommodation/Card";
import { ListView } from "@/components/ListView";
import { type BaseResource } from "@/types/ApiResponse.types";
import { AccommodationListingAside as Aside } from "@/components/Accommodation/Listing/Aside";
import { NoData } from "@/app/no-data";

interface Props {
  data: BaseResource[] | null;
  current_page: number | null;
  last_page: number | null;
  links: PaginationLink[] | null;
  category: string;
}

export const AccommodationCategoryListing = async ({
  data,
  links,
  category,
}: Props) => {
  const { data: pageData } = await fetchData(category);

  if (!pageData) {
    return <NoData />;
  }

  return (
    <ListView
      links={links}
      banner={{
        image: pageData?.featured_image,
        title: pageData?.name,
      }}
      content={pageData?.description}
      aside={<Aside />}
      search={<Search />}
      cards={data?.map((item) => (
        <AccommodationCard key={item.id} slug={item.slug} />
      ))}
    />
  );
};

const fetchData = async (
  slug: string
): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: ["id", "status", "name", "slug", "featured_image", "description"],
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/modules/accommodationCategory/${slug}?${query}`,
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
  id: z.number(),
  status: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  featured_image: z.string(),
});

const ApiResponseSchema = z.object({
  data: Schema.nullable(),
});

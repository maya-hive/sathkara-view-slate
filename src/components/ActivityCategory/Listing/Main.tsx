import queryString from "query-string";
import { z } from "zod";

import { type PaginationLink } from "@/components/Pagination";
import { ListView } from "@/components/ListView";
import { type BaseResource } from "@/types/ApiResponse.types";
import { ActivityCard } from "@/components/Activity/Card";
import { ActivityListingAside as Aside } from "@/components/Activity/Listing/Aside";

interface Props {
  data: BaseResource[] | null;
  current_page: number | null;
  last_page: number | null;
  links: PaginationLink[] | null;
  category: string;
}

export const ActivityCategoryListing = async ({
  data,
  links,
  category,
}: Props) => {
  if (!data?.length) return null;

  const { data: pageData } = await fetchData(category);

  return (
    <ListView
      links={links}
      banner={{
        image: pageData?.featured_image,
        title: pageData?.name,
      }}
      content={pageData?.description}
      aside={<Aside />}
      cards={data.map((item) => (
        <ActivityCard key={item.id} slug={item.slug} />
      ))}
    />
  );
};

const fetchData = async (
  slug: string
): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: [
        "status",
        "name",
        "slug",
        "featured_image",
        "description",
        "meta_title",
        "meta_description",
      ],
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/modules/activityCategory/${slug}?${query}`,
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
  description: z.string().nullable(),
  meta_title: z.string().nullable(),
  meta_description: z.string().nullable(),
  featured_image: z.string(),
  listing_image: z.string().nullable().optional(),
});

const ApiResponseSchema = z.object({
  data: Schema.nullable(),
});

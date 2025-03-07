import queryString from "query-string";
import { Suspense } from "react";
import { z } from "zod";

import { Pagination, type PaginationLink } from "@/components/Pagination";
import { SearchButton as Button } from "@/components/Search/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { Banner } from "@/components/Banner";
import { cn } from "@/lib/utils";
import { SearchForm } from "./Search/Form";

interface Props {
  banner: SkeletonProps["banner"];
  cards?: React.ReactNode[] | null;
  links: PaginationLink[] | null;
  aside?: React.ReactNode | null;
  search?: React.ReactNode | null;
  content?: string | null;
  destination?: string;
  resource?: string;
}

export const ListView = ({
  banner,
  links,
  cards,
  destination,
  aside,
  search,
  content,
}: Props) => {
  return (
    <ListViewSkeleton banner={banner} destination={destination}>
      {content && (
        <div className="mt-12 prose">
          <div
            dangerouslySetInnerHTML={{ __html: content }}
            className="prose"
          />
        </div>
      )}
      <div
        className={cn(
          { "grid grid-cols-1 gap-5 md:grid-cols-[280px_auto]": aside },
          "mt-12"
        )}
      >
        {aside}
        <div>
          {search && (
            <div className="mb-6">
              <SearchForm>
                <div className="rounded-lg flex flex-row gap-4 bg-slate-100 p-4">
                  <div className="flex-1 h-100">{search}</div>
                  <div className="flex-1 h-full w-full xl:max-w-[200px]">
                    <Button />
                  </div>
                </div>
              </SearchForm>
            </div>
          )}
          {cards?.length ? (
            <div
              className={cn(
                { "xl:grid-cols-3 gap-5": aside, "xl:grid-cols-4": !aside },
                "grid grid-cols-1 lg:grid-cols-2 gap-5"
              )}
            >
              {cards.map((card, idx) => (
                <Suspense
                  key={idx}
                  fallback={<Skeleton className="h-[550px] rounded-md" />}
                >
                  {card}
                </Suspense>
              ))}
            </div>
          ) : (
            <div className="w-full text-center rounded-lg bg-yellow-50 border border-yellow-400 text-yellow-500 py-4 text-md">
              No Resources Found
            </div>
          )}
          <Pagination prefix={destination} links={links} />
        </div>
      </div>
    </ListViewSkeleton>
  );
};

type SkeletonProps = {
  children: React.ReactNode;
  banner: BannerData | null;
  destination?: string;
};

type BannerData = {
  title?: string | null;
  image?: string | null;
};

const ListViewSkeleton = async ({
  children,
  banner,
  destination,
}: SkeletonProps) => {
  const response = await fetchData(destination);

  const title = response?.data
    ? `${banner?.title} in ${response.data.name}`
    : banner?.title;

  return (
    <article>
      <Banner title={title} image={banner?.image} />
      <div className="container mx-auto">{children}</div>
    </article>
  );
};

const fetchData = async (
  slug?: string
): Promise<z.infer<typeof ApiResponseSchema> | null> => {
  if (!slug) return null;

  const query = queryString.stringify(
    {
      fields: ["id", "status", "name", "slug"],
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/modules/destination/${slug}?${query}`,
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
});

const ApiResponseSchema = z.object({
  data: Schema.nullable(),
});

import { Suspense } from "react";

import { Banner } from "@/components/Banner";
import { Pagination, type PaginationLink } from "@/components/Pagination";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

import { Button } from "./ui/button";
import Link from "next/link";

interface Props {
  banner: SkeletonProps["banner"];
  cards: React.ReactNode[] | null;
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
  resource,
  content,
}: Props) => {
  if (!cards?.length) return null;

  return (
    <ListViewSkeleton banner={banner}>
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
            <div className="mb-6 rounded-lg flex flex-row gap-4 bg-slate-100 p-4">
              {search}
              <Link href={`/${resource ?? ""}`}>
                <Button variant="secondary" size="lg">
                  Search
                </Button>
              </Link>
            </div>
          )}
          <div
            className={cn(
              { "xl:grid-cols-3 gap-5": aside, "xl:grid-cols-4": !aside },
              "grid grid-cols-1 lg:grid-cols-2 gap-5"
            )}
          >
            {cards.map((card, idx) => (
              <Suspense
                key={idx}
                fallback={<Skeleton className="h-[400px] rounded-md" />}
              >
                {card}
              </Suspense>
            ))}
          </div>
          <Pagination prefix={destination} links={links} />
        </div>
      </div>
    </ListViewSkeleton>
  );
};

type SkeletonProps = {
  children: React.ReactNode;
  banner: BannerData | null;
};

type BannerData = {
  title?: string | null;
  image?: string | null;
};

const ListViewSkeleton = ({ children, banner }: SkeletonProps) => {
  return (
    <article>
      <Banner title={banner?.title} image={banner?.image} />
      <div className="container mx-auto">{children}</div>
    </article>
  );
};

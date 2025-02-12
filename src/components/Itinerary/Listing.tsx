import { Suspense } from "react";
import { ItineraryCard } from "./Card";
import { type PaginationLink, Pagination } from "../Pagination";

interface Props {
  data: Itinerary[] | null;
  current_page: number | null;
  last_page: number | null;
  links: PaginationLink[] | null;
}

type Destination = {
  name: string;
};

type Itinerary = {
  id: number;
  status: number;
  name: string;
  slug: string;
  short_description: string;
  price: string;
  featured_image: string;
  sale_price: string | null;
  duration: string | null;
  destination: Destination | null;
};

export const ItineraryListing = ({ data, links }: Props) => {
  if (!data?.length) return <></>;

  return (
    <article className="container mx-auto">
      <div className="mt-12 grid grid-cols-1 md:grid-cols-[280px_auto] gap-5">
        <div>
          <div className="rounded bg-slate-100 h-full"></div>
        </div>
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            <Suspense fallback={<span>Loading</span>}>
              {data?.map((item) => (
                <ItineraryCard key={item.id} slug={item.slug} />
              ))}
            </Suspense>
          </div>
          <Pagination links={links} />
        </div>
      </div>
    </article>
  );
};

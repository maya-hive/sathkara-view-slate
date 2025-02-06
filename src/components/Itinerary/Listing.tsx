import { Suspense } from "react";
import { ItineraryCard } from "./Card";
import Link from "next/link";
import { cn } from "@/app/lib/utils";

interface Props {
  data: Itinerary[] | null;
  current_page: number | null;
  last_page: number | null;
  links: Link[] | null;
}

type Link = {
  url: string | null;
  label: string;
  active: boolean;
};

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

export const ItineraryListing = ({ data, links }: Props) => (
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

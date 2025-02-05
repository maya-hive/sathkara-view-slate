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
    <div className="my-8">
      <div className="bg-slate-100 py-12">
        <h1 className="text-center text-2xl">Itineraries</h1>
      </div>
    </div>
    <div className="mt-12 grid grid-cols-1 md:grid-cols-[280px_auto] gap-5">
      <div>
        <div className="rounded bg-slate-100 h-full"></div>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Suspense fallback={<span>Loading</span>}>
            {data?.map((item) => (
              <ItineraryCard key={item.id} data={item} />
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

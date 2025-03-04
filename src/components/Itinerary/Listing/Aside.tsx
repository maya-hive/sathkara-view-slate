import { Button } from "@/components/ui/button";

import { ItienrarySearchAudiences as Audiences } from "@/components/Itinerary/Search/Audiences/Field";
import { ItienrarySearchCategories as Categories } from "@/components/Itinerary/Search/Categories/Field";
import { ItienrarySearchDestination as Destination } from "@/components/Itinerary/Search/Destination/Field";
import { ItienrarySearchDuration as Duration } from "@/components/Itinerary/Search/Duration/Field";

export const ItineraryListingAside = () => (
  <aside>
    <div className="rounded-lg bg-slate-100 sticky top-[150px]">
      <div className="w-full p-4 flex flex-col gap-3">
        <div>
          <Categories className="bg-white border" />
        </div>
        <div>
          <Duration className="bg-white border" />
        </div>
        <div>
          <Destination className="bg-white border" />
        </div>
        <div>
          <Audiences className="bg-white border" />
        </div>
        <div className="mt-2">
          <Button variant="secondary" className="w-full">
            Filter
          </Button>
        </div>
      </div>
    </div>
  </aside>
);

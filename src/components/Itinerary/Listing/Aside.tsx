import { SearchItineraryAudiences } from "@/components/Search/ItineraryAudiences";
import { SearchItineraryCategories } from "@/components/Search/ItineraryCategories";
import { SearchItineraryDestination } from "@/components/Search/ItineraryDestination";
import { SearchItineraryDuration } from "@/components/Search/ItineraryDuration";
import { Button } from "@/components/ui/button";

export const ItineraryListingAside = () => (
  <aside>
    <div className="rounded-lg bg-slate-100 sticky top-[150px]">
      <div className="w-full p-4 flex flex-col gap-3">
        <div>
          <SearchItineraryCategories className="bg-white border" />
        </div>
        <div>
          <SearchItineraryDuration className="bg-white border" />
        </div>
        <div>
          <SearchItineraryDestination className="bg-white border" />
        </div>
        <div>
          <SearchItineraryAudiences className="bg-white border" />
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

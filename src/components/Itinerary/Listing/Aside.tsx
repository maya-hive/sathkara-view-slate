import { SearchItineraryCategories } from "@/components/Search/ItineraryCategories";
import { SearchItineraryDurations } from "@/components/Search/ItineraryDurations";
import { Button } from "@/components/ui/button";

export const ItineraryListingAside = () => (
  <aside>
    <div className="rounded-lg bg-slate-100 sticky top-10">
      <div className="w-full p-4 flex flex-col gap-3">
        <div>
          <SearchItineraryCategories className="bg-white border" />
        </div>
        <div>
          <SearchItineraryDurations className="bg-white border" />
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

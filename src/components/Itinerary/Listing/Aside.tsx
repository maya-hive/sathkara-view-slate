import { SearchItineraryCategories } from "@/components/Search/ItineraryCategories";

export const ItineraryListingAside = () => (
  <aside>
    <div className="rounded-lg bg-slate-50 sticky top-10">
      <div className="w-full p-4 flex flex-col gap-3">
        <div>
          <h2 className="font-semibold">Filter Itineraries</h2>
        </div>
        <div>
          <label className="text-md">Itinerary Categories</label>
          <SearchItineraryCategories />
        </div>
      </div>
    </div>
  </aside>
);

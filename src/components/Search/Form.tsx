import { SearchItienraries } from "./Itineraries";
import { SearchItineraryCategories } from "./ItineraryCategories";
import { SearchItineraryDurations } from "./ItineraryDurations";

interface Props {
  title?: string | null;
}

export const SearchForm = ({ title }: Props) => (
  <div className="rounded-xl shadow-lg bg-white py-6 px-12 flex flex-col md:flex-row gap-4 items-center">
    <div className="text-lg font-semibold md:max-w-[120px]">
      {title ?? "Search"}
    </div>
    <div className="w-full flex flex-col md:flex-row gap-3">
      <div className="flex-1 w-full">
        <SearchItienraries />
      </div>
      <div className="flex-1 w-full">
        <SearchItineraryCategories />
      </div>
      <div className="flex-1 w-full">
        <SearchItineraryDurations />
      </div>
      <div className="flex-1 w-full md:max-w-[200px]">
        <button className="rounded-md w-full bg-secondary py-4 px-8 text-md font-semibold uppercase text-white">
          Search
        </button>
      </div>
    </div>
  </div>
);

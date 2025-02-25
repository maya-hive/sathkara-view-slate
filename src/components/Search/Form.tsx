import { SearchItienraries } from "./Itineraries";
import { SearchItineraryCategories } from "./ItineraryCategories";
import { SearchItineraryDurations } from "./ItineraryDurations";
import Link from "next/link";

interface Props {
  title?: string | null;
}

export const SearchForm = ({ title }: Props) => (
  <div className="rounded-xl shadow-lg bg-white py-6 px-12 flex flex-col xl:flex-row gap-4 items-center">
    <h2 className="text-lg font-bold xl:max-w-[120px] leading-tight">
      {title ?? "Search"}
    </h2>
    <div className="w-full flex flex-col xl:flex-row gap-3">
      <div className="flex-1 w-full xl:min-w-[500px]">
        <SearchItienraries />
      </div>
      <div className="flex-1 w-full xl:min-w-[350px]">
        <SearchItineraryCategories
          label={false}
          className="h-full bg-gray-100 border-none"
        />
      </div>
      <div className="flex-1 w-full">
        <SearchItineraryDurations
          label={false}
          className="h-full bg-gray-100 border-none"
        />
      </div>
      <div className="flex-1 w-full xl:max-w-[200px]">
        <Link href="/itineraries">
          <button className="rounded-md w-full bg-secondary py-4 px-8 text-md font-semibold uppercase text-white">
            Search
          </button>
        </Link>
      </div>
    </div>
  </div>
);

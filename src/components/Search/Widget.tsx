import { cn } from "@/lib/utils";

import { ItinerarySearchQuery as Search } from "@/components/Itinerary/Search/Query/Field";
import { ItienrarySearchCategories as Categories } from "@/components/Itinerary/Search/Categories/Field";
import { ItienrarySearchDuration as Duration } from "@/components/Itinerary/Search/Duration/Field";

import { SearchButton } from "./Button";
import { SearchForm } from "./Form";

interface Props {
  title?: string | null;
}

export const SearchWidget = ({ title }: Props) => (
  <SearchForm>
    <div className="rounded-xl shadow-lg bg-white py-6 px-12 flex flex-col xl:flex-row gap-4 items-center">
      <h2 className="text-lg font-bold xl:max-w-[120px] leading-tight">
        {title ?? "Search"}
      </h2>
      <div className="w-full flex flex-col xl:flex-row gap-3">
        <div className="flex-1 w-full xl:min-w-[500px]">
          <Search
            className={cn("h-full font-medium bg-gray-100 border-none")}
          />
        </div>
        <div className="flex-1 w-full xl:min-w-[350px]">
          <Categories
            label={false}
            className="h-full bg-gray-100 border-none"
          />
        </div>
        <div className="flex-1 w-full">
          <Duration label={false} className="h-full bg-gray-100 border-none" />
        </div>
        <div className="flex-1 w-full xl:max-w-[200px]">
          <SearchButton />
        </div>
      </div>
    </div>
  </SearchForm>
);

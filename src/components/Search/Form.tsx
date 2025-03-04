import Link from "next/link";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

import { ItienrarySearchCategories as Categories } from "@/components/Itinerary/Search/Categories/Field";
import { ItienrarySearchDuration as Duration } from "@/components/Itinerary/Search/Duration/Field";

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
        <Input
          placeholder="Find Your Perfect Itinerary..."
          className={cn("h-full font-medium bg-gray-100 border-none")}
        />
      </div>
      <div className="flex-1 w-full xl:min-w-[350px]">
        <Categories label={false} className="h-full bg-gray-100 border-none" />
      </div>
      <div className="flex-1 w-full">
        <Duration label={false} className="h-full bg-gray-100 border-none" />
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

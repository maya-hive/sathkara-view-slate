"use client";

import { ClassNameValue } from "tailwind-merge";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  className?: ClassNameValue;
}

export const SearchItineraries = (props: Props) => {
  return (
    <form
      className="rounded-lg flex flex-row gap-4 bg-slate-100 p-4"
      onSubmit={(e) => e.preventDefault()}
    >
      <Suspense fallback={<Skeleton className="h-[65px]" />}>
        <Search {...props} />
      </Suspense>
    </form>
  );
};

const Search = ({ className }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || ""
  );

  const handleInput = () => {
    const params = new URLSearchParams(searchParams);

    if (searchQuery) {
      params.set("query", searchQuery);

      if (pathname.includes("/search")) {
        replace(`${pathname}?${params.toString()}`, {
          scroll: false,
        });
      } else {
        replace(`${pathname}/search?${params.toString()}`, {
          scroll: false,
        });
      }
    } else {
      params.delete("query");

      replace(pathname.replace("/search", ""), {
        scroll: false,
      });
    }
  };

  return (
    <>
      <Input
        placeholder="Find Your Perfect Itinerary..."
        className={cn("h-full font-medium bg-gray-100", className)}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button variant="secondary" size="lg" onClick={handleInput}>
        Search
      </Button>
    </>
  );
};

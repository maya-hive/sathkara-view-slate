"use client";

import { ClassNameValue } from "tailwind-merge";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, Suspense, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

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
    new URLSearchParams(window.location.search).get("query") || ""
  );
  const [debouncedQuery] = useDebounce(searchQuery, 300);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (debouncedQuery) {
      params.set("query", debouncedQuery);
    } else {
      params.delete("query");
    }

    const queryString = params.toString().replace(/%2C/g, ",");
    window.history.pushState(null, "", `?${queryString}`);
  }, [debouncedQuery]);

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = () => {
    const params = new URLSearchParams(searchParams);

    if (searchQuery) {
      if (pathname.includes("/search")) {
        replace(`${pathname}?${params.toString()}`, {
          scroll: false,
        });
      } else if (pathname.includes("/page")) {
        replace(
          `${pathname.replace(
            /\/page\/\d+\/?$/,
            ""
          )}/search?${params.toString()}`,
          {
            scroll: false,
          }
        );
      } else {
        replace(`${pathname}/search?${params.toString()}`, {
          scroll: false,
        });
      }
    } else {
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
        onChange={handleInput}
      />
      <Button variant="secondary" size="lg" onClick={handleSubmit}>
        Search
      </Button>
    </>
  );
};

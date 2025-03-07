"use client";

import { ClassNameValue } from "tailwind-merge";
import { ChangeEvent, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Props {
  className?: ClassNameValue;
}

export const AccommodationSearchQuery = ({ className }: Props) => {
  const search = typeof window !== "undefined" ? window.location.search : "";

  const [searchQuery, setSearchQuery] = useState(
    new URLSearchParams(search).get("query") || ""
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

  return (
    <Input
      placeholder="Find Your Perfect Accommodation..."
      className={cn("h-full font-medium bg-white", className)}
      value={searchQuery}
      onChange={handleInput}
    />
  );
};

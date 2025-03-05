"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { MultiSelect } from "@/components/MultiSelect";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  label?: boolean;
  options: Option[];
}

type Option = {
  value: string;
  label: string;
};

export const ItinerarySearchCategoriesClient = ({
  label = true,
  className,
  options,
}: Props) => {
  return (
    <>
      {label && <label className="text-sm font-semibold">Categories</label>}
      <Select className={className} options={options} />
    </>
  );
};

const Select = ({ className, options }: Props) => {
  const searchParams = useSearchParams();

  const defaultValue = searchParams.get("categories")?.split(",") ?? null;

  const [searchQuery, setSearchQuery] = useState<string[] | null>(defaultValue);

  const handleValueChange = (selected: string[]) => {
    setSearchQuery(selected);

    const searchParams = new URLSearchParams(window.location.search);

    if (selected.length) {
      searchParams.set("categories", selected.join(","));
    } else {
      searchParams.delete("categories");
    }

    const queryString = searchParams.toString().replace(/%2C/g, ",");

    window.history.pushState(null, "", `?${queryString}`);
  };

  return (
    <Suspense>
      <MultiSelect
        options={options}
        defaultValue={searchQuery ?? undefined}
        onValueChange={handleValueChange}
        placeholder="Select Categories"
        className={cn("h-100 border", className)}
        maxCount={6}
      />
    </Suspense>
  );
};

"use client";

import { useState } from "react";

import { MultiSelect } from "@/components/MultiSelect";
import { cn } from "@/lib/utils";

const itineraryCategories = [
  {
    value: "adventure",
    label: "Adventure",
  },
  {
    value: "sport",
    label: "Sport",
  },
  {
    value: "surfing",
    label: "Surfing",
  },
  {
    value: "camping",
    label: "Camping",
  },
];

interface Props {
  className?: string;
  label?: boolean;
}

export const SearchItineraryCategories = ({
  label = true,
  className,
}: Props) => {
  const [value, setValue] = useState<string[]>([]);

  return (
    <div>
      {label && <label className="text-sm font-semibold">Categories</label>}
      <MultiSelect
        options={itineraryCategories}
        onValueChange={setValue}
        defaultValue={value}
        placeholder="Select Itinerary Categories"
        className={cn("bg-white border", className)}
        maxCount={6}
      />
    </div>
  );
};

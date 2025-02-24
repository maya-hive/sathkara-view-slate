"use client";

import { useState } from "react";

import { MultiSelect } from "@/components/MultiSelect";

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
}

export const SearchItineraryCategories = ({ className }: Props) => {
  const [value, setValue] = useState<string[]>(["adventure"]);

  return (
    <MultiSelect
      options={itineraryCategories}
      onValueChange={setValue}
      defaultValue={value}
      placeholder="Select Itinerary Categories"
      maxCount={5}
      className={className}
    />
  );
};

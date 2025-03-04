"use client";

import { useState } from "react";

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
  const [value, setValue] = useState<string[]>([]);

  return (
    <>
      {label && <label className="text-sm font-semibold">Categories</label>}
      <MultiSelect
        options={options}
        onValueChange={setValue}
        defaultValue={value}
        placeholder="Select Categories"
        className={cn("h-100 border", className)}
        maxCount={6}
      />
    </>
  );
};

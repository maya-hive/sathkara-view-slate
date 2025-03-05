"use client";

import { Suspense, useState } from "react";

import { MultiSelect } from "@/components/MultiSelect";
import { cn } from "@/lib/utils";
import { useParams, useSearchParams } from "next/navigation";

interface Props {
  className?: string;
  label?: boolean;
  options: Option[];
}

type Option = {
  value: string;
  label: string;
};

export const ItinerarySearchAudiencesClient = ({
  label = true,
  className,
  options,
}: Props) => {
  return (
    <>
      {label && <label className="text-sm font-semibold">Audiences</label>}
      <Suspense>
        <Select className={className} options={options} />
      </Suspense>
    </>
  );
};

const Select = ({ className, options }: Props) => {
  const searchParams = useSearchParams();
  const params = useParams();

  const defaultValue =
    searchParams.get("audiences")?.split(",") ??
    (options.find((item) => item.value === params?.slug?.toString())?.value
      ? [options.find((item) => item.value === params?.slug?.toString())!.value]
      : null);

  const [searchQuery, setSearchQuery] = useState<string[] | null>(defaultValue);

  const handleValueChange = (selected: string[]) => {
    setSearchQuery(selected);

    const searchParams = new URLSearchParams(window.location.search);

    if (selected.length) {
      searchParams.set("audiences", selected.join(","));
    } else {
      searchParams.delete("audiences");
    }

    const queryString = searchParams.toString().replace(/%2C/g, ",");

    window.history.pushState(null, "", `?${queryString}`);
  };

  return (
    <MultiSelect
      options={options}
      defaultValue={searchQuery ?? undefined}
      onValueChange={handleValueChange}
      placeholder="Select Audiences"
      className={cn("h-100 border", className)}
      maxCount={6}
    />
  );
};

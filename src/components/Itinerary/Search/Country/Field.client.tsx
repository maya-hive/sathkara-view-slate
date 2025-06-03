"use client";

import { Check, ChevronDown } from "lucide-react";
import { ClassNameValue } from "tailwind-merge";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  className?: ClassNameValue;
  label?: boolean;
  options: Option[];
}

type Option = {
  value: string;
  label: string;
};

export const ItinerarySearchCountryClient = ({
  label = true,
  className,
  options: items,
}: Props) => {
  const options = [{ value: "*", label: "All" }, ...items];

  return (
    <>
      {label && <label className="text-sm font-semibold">Country</label>}
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
    searchParams.get("country") ??
    options.find((item) => item.value === params?.slug?.toString())?.value ??
    "*";

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>(defaultValue);

  const [, setSearchQuery] = useState<string>(defaultValue);

  const handleValueChange = (selected: string) => {
    setSearchQuery(selected);
    setValue(selected);
    setOpen(false);

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("country", selected);

    const queryString = searchParams.toString().replace(/%2C/g, ",");

    window.history.pushState(null, "", `?${queryString}`);
  };

  const selectedValue = value === "*" ? defaultValue : value;

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="input"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full h-full justify-between ", className)}
          >
            {selectedValue
              ? options.find((item) => item.value === selectedValue)?.label
              : "Country"}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No items found.</CommandEmpty>
              <CommandGroup>
                {options.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={handleValueChange}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};

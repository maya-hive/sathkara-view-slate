"use client";

import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

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
import { ClassNameValue } from "tailwind-merge";

type ItineraryDuration = (typeof options)[number]["value"];

interface Props {
  className?: ClassNameValue;
  label?: boolean;
}

export const SearchItineraryDuration = ({ label = true, className }: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<ItineraryDuration>("*");

  return (
    <>
      {label && <label className="text-sm font-semibold">Duration</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="input"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full h-full justify-between ", className)}
          >
            {value
              ? options.find((item) => item.value === value)?.label
              : "Duration"}
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
                    onSelect={(currentValue) => {
                      const newValue = currentValue as ItineraryDuration;
                      setValue(newValue === value ? "*" : newValue);
                      setOpen(false);
                    }}
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

const options = [
  {
    value: "*",
    label: "All Durations",
  },
  {
    value: "0-3",
    label: "3 Days or Less",
  },
  {
    value: "4-6",
    label: "4 to 6 Days",
  },
  {
    value: "6-9",
    label: "6 to 9 Days",
  },
  {
    value: "9-12",
    label: "9 to 12 Days",
  },
  {
    value: "12-15",
    label: "12 to 15 Days",
  },
  {
    value: "15-18",
    label: "15 to 18 Days",
  },
  {
    value: "18-21",
    label: "18 to 21 Days",
  },
  {
    value: "21-24",
    label: "21 to 24 Days",
  },
  {
    value: "24+",
    label: "More than 24 Days",
  },
] as const;

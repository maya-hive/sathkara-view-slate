"use client";

import { Check, ChevronsUpDown } from "lucide-react";
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

const itineraryDestinations = [
  {
    value: "*",
    label: "ALL",
  },
  {
    value: "sri-lanka",
    label: "Sri Lanka",
  },
  {
    value: "maldives",
    label: "Maldives",
  },
  {
    value: "seychelles",
    label: "Seychelles",
  },
] as const;

type ItineraryDestination = (typeof itineraryDestinations)[number]["value"];

interface Props {
  className?: ClassNameValue;
  label?: boolean;
}

export const SearchItineraryDestination = ({
  label = true,
  className,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<ItineraryDestination>("*");

  return (
    <>
      {label && <label className="text-sm font-semibold">Destination</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="input"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full h-full justify-between ", className)}
          >
            {value
              ? itineraryDestinations.find((item) => item.value === value)
                  ?.label
              : "Destination"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No items found.</CommandEmpty>
              <CommandGroup>
                {itineraryDestinations.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(currentValue) => {
                      const newValue = currentValue as ItineraryDestination;
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

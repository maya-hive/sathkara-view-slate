"use client";

import { ClassNameValue } from "tailwind-merge";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Props {
  className?: ClassNameValue;
}

export const SearchItienraries = ({ className }: Props) => {
  return (
    <Input
      placeholder="Find Your Perfect Itinerary..."
      className={cn("h-full font-medium bg-gray-100", className)}
    />
  );
};

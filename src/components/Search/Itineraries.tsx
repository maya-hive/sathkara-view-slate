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
      placeholder="Search for what you want"
      className={cn("h-full font-semibold bg-gray-100", className)}
    />
  );
};

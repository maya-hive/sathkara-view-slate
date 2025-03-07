"use client";

import { ReactNode, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  children: ReactNode;
}

export const SearchForm = ({ children }: Props) => (
  <form onSubmit={(e) => e.preventDefault()}>
    <Suspense fallback={<Skeleton className="h-[65px]" />}>{children}</Suspense>
  </form>
);

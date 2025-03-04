"use client";

import { ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

export const ItineraryListingAsideClient = ({
  children,
}: {
  children: ReactNode;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSubmit = () => {
    const selectedCategories = searchParams.getAll("categories[]");

    const queryString = selectedCategories
      .map((value) => `categories[]=${encodeURIComponent(value)}`)
      .join("&");

    if (pathname.includes("/search")) {
      router.replace(`${pathname}?${queryString}`, {
        scroll: false,
      });
    } else {
      router.replace(`${pathname}/search?${queryString}`, {
        scroll: false,
      });
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="rounded-lg bg-slate-100 sticky top-[150px]">
        <div className="w-full p-4 flex flex-col gap-3">
          {children}
          <div className="mt-2">
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleSubmit}
            >
              Filter
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

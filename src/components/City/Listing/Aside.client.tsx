"use client";

import { ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

export const CityListingAsideClient = ({
  children,
}: {
  children: ReactNode;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSubmit = () => {
    const queryObject: Record<string, string[]> = {};

    searchParams.forEach((value, key) => {
      if (!queryObject[key]) {
        queryObject[key] = [];
      }
      queryObject[key].push(value);
    });

    const queryString = Object.entries(queryObject)
      .map(([key, values]) =>
        values.map((value) => `${key}=${value}`).join("&")
      )
      .join("&");

    const newPath = pathname.includes("/search")
      ? `${pathname}?${queryString}`
      : `${pathname}/search?${queryString}`;

    router.replace(newPath, { scroll: false });
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

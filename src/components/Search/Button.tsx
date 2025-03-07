"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

export const SearchButton = () => (
  <Suspense>
    <ButtonElement />
  </Suspense>
);

const ButtonElement = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

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

    if (queryString) {
      if (pathname.includes("/search")) {
        replace(`${pathname}?${queryString}`, {
          scroll: false,
        });
      } else if (pathname.includes("/page")) {
        replace(
          `${pathname.replace(/\/page\/\d+\/?$/, "")}/search?${queryString}`,
          {
            scroll: false,
          }
        );
      } else if (pathname === "/") {
        replace(`/itineraries/search?${queryString}`, {
          scroll: false,
        });
      } else {
        replace(`${pathname}/search?${queryString}`, {
          scroll: false,
        });
      }
    } else {
      replace(pathname.replace("/search", ""), {
        scroll: false,
      });
    }
  };

  return (
    <Button
      className="block w-full"
      variant="secondary"
      size="lg"
      onClick={handleSubmit}
    >
      Search
    </Button>
  );
};

"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export const SearchButton = () => {
  const search = typeof window !== "undefined" ? window.location.search : "";
  const searchQuery = new URLSearchParams(search).get("query") || "";

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSubmit = () => {
    const params = new URLSearchParams(searchParams);

    if (searchQuery) {
      if (pathname.includes("/search")) {
        replace(`${pathname}?${params.toString()}`, {
          scroll: false,
        });
      } else if (pathname.includes("/page")) {
        replace(
          `${pathname.replace(
            /\/page\/\d+\/?$/,
            ""
          )}/search?${params.toString()}`,
          {
            scroll: false,
          }
        );
      } else if (pathname === "/") {
        replace(`/itineraries/search?${params.toString()}`, {
          scroll: false,
        });
      } else {
        replace(`${pathname}/search?${params.toString()}`, {
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

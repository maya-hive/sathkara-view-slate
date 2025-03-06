"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface Props {
  links: PaginationLink[] | null;
  prefix?: string;
}

export type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

export const Pagination = ({ links, prefix }: Props) => {
  if (links?.[0]?.url === null && links?.[links.length - 1]?.url === null) {
    return null;
  }

  return (
    <Suspense>
      <Links links={links} prefix={prefix} />
    </Suspense>
  );
};

const Links = ({ links, prefix }: Props) => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.toString()
    ? "/search?" + searchParams.toString()
    : "";

  return (
    <PaginationRoot className="mt-8 w-full flex justify-center">
      <PaginationContent>
        {links?.map(({ url, label, active }) =>
          url ? (
            <PaginationItem key={label}>
              <Button
                asChild
                variant={active ? "default" : "ghost"}
                className={cn({ "min-w-[120px]": isNaN(parseFloat(label)) })}
              >
                <Link
                  href={
                    prefix
                      ? "/" + prefix + url + searchQuery
                      : url + searchQuery
                  }
                  dangerouslySetInnerHTML={{ __html: label }}
                />
              </Button>
            </PaginationItem>
          ) : null
        )}
      </PaginationContent>
    </PaginationRoot>
  );
};

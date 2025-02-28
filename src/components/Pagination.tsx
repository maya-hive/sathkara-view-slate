import Link from "next/link";
import { Button } from "@/components/ui/button";
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
                  href={prefix ? "/" + prefix + url : url}
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

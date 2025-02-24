import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

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
  const hasPages = links?.pop()?.url !== null && links?.shift()?.url !== null;

  if (!hasPages) {
    return null;
  }

  return (
    <PaginationRoot className="mt-8 w-full flex justify-center">
      <PaginationContent>
        {links?.map(({ url, label, active }) =>
          url ? (
            <PaginationItem key={label}>
              <Button asChild variant={active ? "default" : "outline"}>
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

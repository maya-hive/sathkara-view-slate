import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

interface Props {
  links: PaginationLink[] | null;
}

export type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

export const Pagination = ({ links }: Props) => (
  <PaginationRoot className="mt-8 w-full flex justify-center">
    <PaginationContent>
      {links?.map(({ url, label, active }) =>
        url ? (
          <PaginationItem key={label}>
            <Button asChild variant={active ? "default" : "outline"}>
              <Link href={url} dangerouslySetInnerHTML={{ __html: label }} />
            </Button>
          </PaginationItem>
        ) : null
      )}
    </PaginationContent>
  </PaginationRoot>
);

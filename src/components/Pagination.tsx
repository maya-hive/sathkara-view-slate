import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
  links: Link[] | null;
}

export type Link = {
  url: string | null;
  label: string;
  active: boolean;
};

export const Pagination = ({ links }: Props) => (
  <nav className="mt-8 w-full">
    <ul className="flex justify-center gap-4 list-none ">
      {links?.map(
        ({ url, label, active }) =>
          url && (
            <li key={label}>
              <Link
                href={url}
                className={cn(
                  "block text-center min-w-[100px] py-2 text-sm",
                  active ? "bg-blue-600 text-white" : "bg-slate-600 text-white"
                )}
              >
                <span dangerouslySetInnerHTML={{ __html: label }} />
              </Link>
            </li>
          )
      )}
    </ul>
  </nav>
);

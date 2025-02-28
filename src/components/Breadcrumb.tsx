"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const Breadcrumb = () => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return <nav className="text-md">/Home</nav>;
  }

  return (
    <nav className="text-md">
      <span className="text-md capitalize">
        <Link href="/">Home</Link>
      </span>
      {segments.map((segment, index) => {
        const isPageNumber =
          segment.toLowerCase() === "page" &&
          index + 1 < segments.length &&
          /^\d+$/.test(segments[index + 1]);

        const href = `/${segments
          .slice(0, index + (isPageNumber ? 2 : 1))
          .join("/")}`;

        const label = isPageNumber
          ? `Page ${segments[index + 1]}`
          : decodeURIComponent(segment).replace(/-/g, " ");

        if (
          index > 0 &&
          /^\d+$/.test(segment) &&
          segments[index - 1].toLowerCase() === "page"
        ) {
          return null;
        }

        return (
          <span key={href} className="text-md capitalize">
            {" / "}
            <Link href={href}>{label}</Link>
          </span>
        );
      })}
    </nav>
  );
};

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const Breadcrumb = () => {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  return (
    <nav className="text-md">
      {parts.length === 0 ? (
        <span>/Home</span>
      ) : (
        <span>
          <Link href="/">Home</Link>
          {parts.map((part, index) => {
            const href = `/${parts.slice(0, index + 1).join("/")}`;
            const label = decodeURIComponent(part).replace(/-/g, " ");

            return (
              <span key={href} className="text-md capitalize">
                {" / "}
                <Link href={href}>{label}</Link>
              </span>
            );
          })}
        </span>
      )}
    </nav>
  );
};

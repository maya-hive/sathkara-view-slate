"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePathname } from "next/navigation";
import { NavFrameType } from "./Navigation";

interface Props {
  links: LinkFrame[] | null;
}

type LinkFrame = {
  value: {
    title: string;
    value?: string | null;
    link?: string | null;
    target?: string | null;
    slug?: string | null;
  };
  children?: NavFrameType[];
};

export const Menu = ({ links }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="flex lg:hidden">
      <span onClick={() => setIsOpen(!isOpen)}>
        <FontAwesomeIcon
          icon={faBars}
          className="rounded p-3 bg-primary text-white cursor-pointer"
        />
      </span>
      {isOpen && (
        <ul className="absolute z-50 w-full top-full left-0 bg-muted flex flex-col gap-2 py-4 px-6 text-md">
          {links?.map(({ value }, idx) => (
            <li key={idx} className="block [&:not(:last-child)]:border-b py-1">
              <Link href={value.value ?? value.link ?? "#"}>{value.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

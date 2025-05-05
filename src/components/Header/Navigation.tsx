import { ReactNode } from "react";
import Link from "next/link";
import queryString from "query-string";
import { z } from "zod";

import { SocialMediaIcons, SocialMediaLinks } from "../SocialMediaIcons";
import { Menu } from "./Menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

interface Props {
  children: ReactNode[] | ReactNode;
  socials?: SocialMediaLinks | null;
  phone: Phone | null;
}

export const Navigation = async ({ children, phone, socials }: Props) => {
  const { data } = await fetchData();

  if (!data) {
    return null;
  }

  return (
    <nav className="w-full">
      {socials && (
        <TopBar
          links={data.header_quick_links}
          phone={phone}
          socials={socials}
        />
      )}
      <div className="bg-white relative">
        <div className="container mx-auto text-black flex md:flex-none items-center px-4 md:px-0">
          <div className="flex py-2 w-full items-center lg:justify-center gap-5 text-sm xl:text-md">
            <div className="hidden lg:flex gap-6 xl:gap-10 w-full justify-start items-center">
              {data.header_primary_left?.map(({ value, children }, idx) => (
                <NavLink key={idx} value={value}>
                  {children}
                </NavLink>
              ))}
              {data.header_primary_left_call_to_action_url && (
                <Link
                  className="rounded bg-yellow-400 py-2 px-6 text-yellow-800 font-semibold"
                  href={data.header_primary_left_call_to_action_url}
                >
                  {data.header_primary_right_call_to_action_title}
                </Link>
              )}
            </div>
            <div className="min-w-[150px]">{children}</div>
            <div className="hidden lg:flex gap-6 xl:gap-10 w-full justify-end items-center">
              {data.header_primary_right?.map(({ value, children }, idx) => (
                <NavLink key={idx} value={value}>
                  {children}
                </NavLink>
              ))}
              {data.header_primary_right_call_to_action_url && (
                <Link
                  className="rounded bg-yellow-400 py-2 px-6 text-yellow-800 font-semibold"
                  href={data.header_primary_right_call_to_action_url}
                >
                  {data.header_primary_right_call_to_action_title}
                </Link>
              )}
            </div>
          </div>
          {data.header_mobile && <Menu links={data.header_mobile} />}
        </div>
      </div>
    </nav>
  );
};

type Phone = {
  title: string | null;
  number: string | null;
};

type TopBarProps = {
  phone: Phone | null;
  socials?: SocialMediaLinks;
  links: z.infer<typeof navFrames>;
};

const TopBar = ({ phone, links, socials }: TopBarProps) => (
  <small className="border-b bg-blue-950 text-white py-2 w-full flex items-center justify-between gap-5">
    <div className="container mx-auto px-4 md:px-0 flex flex-col md:flex-row items-center justify-between gap-2 text-blue-400 text-sm font-medium">
      <div className="flex gap-5">
        {phone?.number && (
          <a href={"tel:" + phone.number.replace(/\s/g, "")}>
            {phone.title}{" "}
            <span className="text-yellow-400">{phone.number}</span>
          </a>
        )}
      </div>
      <div className="hidden md:flex gap-7">
        {links?.map(({ value, children }, idx) => (
          <NavLink key={idx} value={value}>
            {children}
          </NavLink>
        ))}
        {socials && <SocialMediaIcons links={socials} size="lg" />}
      </div>
    </div>
  </small>
);

type NavLinkProps = {
  value: {
    title: string;
    value?: string | null;
    link?: string | null;
    target?: string | null;
    slug?: string | null;
  };
  children?: NavFrameType[];
};

const NavLink = ({ value, children }: NavLinkProps) => (
  <>
    <div className="relative">
      <div className="peer flex gap-3 items-center">
        <Link href={value.value ?? value.link ?? "#"} className="font-medium">
          {value.title}
        </Link>
        {children && <FontAwesomeIcon icon={faChevronDown} />}
      </div>

      {children && children.length > 0 && (
        <div className="absolute top-full left-0 min-w-[250px] rounded bg-slate-100 z-50 flex flex-col gap-2 p-2 opacity-0 invisible peer-hover:opacity-100 peer-hover:visible hover:opacity-100 hover:visible transition-opacity duration-200 shadow-xl">
          {children.map(
            ({ value }, idx) =>
              value && (
                <Link
                  key={idx}
                  href={value.slug ?? ""}
                  className="block py-1 px-2 rounded text-md"
                >
                  {value.title}
                </Link>
              )
          )}
        </div>
      )}
    </div>
  </>
);

const fetchData = async (): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: [
        "header_primary_left",
        "header_primary_right",
        "header_quick_links",
        "header_primary_left_call_to_action_title",
        "header_primary_left_call_to_action_url",
        "header_primary_right_call_to_action_title",
        "header_primary_right_call_to_action_url",
        "header_mobile",
      ],
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/settings/navigation?${query}`,
    {
      next: {
        tags: ["global"],
      },
    }
  );

  if (!response.ok) {
    const errorMessage = `Failed to fetch: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  const data = await response.json();

  try {
    return ApiResponseSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.errors);

      throw new Error("API Response validation failed: " + error.message);
    }
    throw error;
  }
};

const linkFrame = z.object({
  type: z.string(),
  title: z.string(),
  value: z.string().nullable().optional(),
  link: z.string().nullable().optional(),
  target: z.string().nullable().optional(),
  slug: z.string().nullable().optional(),
});

const navFrameBase = z.object({
  id: z.string(),
  order: z.string(),
  value: linkFrame,
});

export type NavFrameType = z.infer<typeof navFrameBase> & {
  children?: NavFrameType[];
};

const navFrame: z.ZodType<NavFrameType> = navFrameBase.extend({
  children: z.lazy(() => navFrame.array().optional()).optional(),
});

const navFrames = z.array(navFrame).optional();

const ApiResponseSchema = z.object({
  data: z
    .object({
      header_primary_left: navFrames,
      header_primary_right: navFrames,
      header_quick_links: navFrames,
      header_mobile: navFrames,
      header_primary_left_call_to_action_title: z
        .string()
        .nullable()
        .optional(),
      header_primary_left_call_to_action_url: z.string().nullable().optional(),
      header_primary_right_call_to_action_title: z
        .string()
        .nullable()
        .optional(),
      header_primary_right_call_to_action_url: z.string().nullable().optional(),
    })
    .nullable(),
});

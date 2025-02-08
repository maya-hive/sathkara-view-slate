import { ReactNode } from "react";
import Link from "next/link";
import queryString from "query-string";
import { z } from "zod";

import { SocialMediaIcons, SocialMediaLinks } from "../SocialMediaIcons";
import { redirect } from "next/navigation";

interface Props {
  children: ReactNode[] | ReactNode;
  phone: { value: string | null; title: string | null };
  socials?: SocialMediaLinks;
}

export const Navigation = async ({ children, phone, socials }: Props) => {
  const { data } = await fetchData();

  if (!data) {
    return redirect("/");
  }

  return (
    <nav className="w-full">
      <div className="border-b bg-blue-950 text-white py-2 w-full flex items-center justify-between gap-5">
        <div className="container mx-auto flex justify-between text-blue-400 text-sm font-medium">
          <div className="flex gap-5">
            {phone.value && (
              <a href={"tel:" + phone.value.replace(/\s/g, "")}>
                {phone.title}{" "}
                <span className="text-yellow-400">{phone.value}</span>
              </a>
            )}
          </div>
          <div className="flex gap-7">
            {data.header_quick_links?.map(({ value }, index) => (
              <Link
                key={index}
                href={value.slug ?? value.value}
                className="font-medium"
              >
                {value.title}
              </Link>
            ))}
            {socials && <SocialMediaIcons links={socials} size="lg" />}
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div className="container mx-auto text-black">
          <div className="py-2 w-full flex items-center justify-center gap-5 text-md">
            <div className="flex gap-10 w-full justify-start items-center">
              {data.header_primary_left?.map(({ value }, index) => (
                <Link
                  key={index}
                  href={value.slug ?? value.value}
                  className="font-medium"
                >
                  {value.title}
                </Link>
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
            <div className="flex gap-10 w-full justify-end items-center">
              {data.header_primary_right?.map(({ value }, index) => (
                <Link
                  key={index}
                  href={value.slug ?? value.value}
                  className="font-medium"
                >
                  {value.title}
                </Link>
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
        </div>
      </div>
    </nav>
  );
};

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

const LinkFrame = z.object({
  type: z.string(),
  title: z.string(),
  value: z.string(),
  link: z.string().nullable().optional(),
  target: z.string().nullable().optional(),
  slug: z.string().nullable().optional(),
});

const NavFrame = z.array(
  z.object({
    id: z.string(),
    order: z.string(),
    children: LinkFrame.nullable().optional(),
    value: LinkFrame,
  })
);

const ApiResponseSchema = z.object({
  data: z.object({
    header_primary_left: NavFrame,
    header_primary_right: NavFrame,
    header_quick_links: NavFrame,
    header_mobile: NavFrame,
    header_primary_left_call_to_action_title: z.string().nullable().optional(),
    header_primary_left_call_to_action_url: z.string().nullable().optional(),
    header_primary_right_call_to_action_title: z.string().nullable().optional(),
    header_primary_right_call_to_action_url: z.string().nullable().optional(),
  }),
});

import queryString from "query-string";
import Link from "next/link";
import { z } from "zod";
import { ReactNode } from "react";

interface Props {
  children: ReactNode[] | ReactNode;
  phone: { value: string | null; title: string | null };
}

export const Navigation = async ({ children, phone }: Props) => {
  const { data } = await fetchData();

  if (!data) {
    return null;
  }

  return (
    <nav className="w-full">
      <div className="border-b py-2 w-full flex items-center justify-between gap-5">
        <div className="container mx-auto flex justify-between">
          <div className="flex gap-5">
            {phone.value && (
              <a href={"tel:" + phone.value.replace(/\s/g, "")}>
                {phone.title}
              </a>
            )}
          </div>
          <div className="flex gap-10">
            {data.header_quick_links?.map(({ value }, index) => (
              <Link
                key={index}
                href={value.slug ?? value.value}
                className="font-medium"
              >
                {value.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="container mx-auto">
        <div className="py-4 w-full flex items-center justify-center gap-5">
          <div className="flex gap-10 w-full justify-start">
            {data.header_primary_left?.map(({ value }, index) => (
              <Link
                key={index}
                href={value.slug ?? value.value}
                className="font-medium"
              >
                {value.title}
              </Link>
            ))}
          </div>
          <div className="min-w-[150px]">{children}</div>
          <div className="flex gap-10 w-full justify-end">
            {data.header_primary_right?.map(({ value }, index) => (
              <Link
                key={index}
                href={value.slug ?? value.value}
                className="font-medium"
              >
                {value.title}
              </Link>
            ))}
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
        "header_mobile",
      ],
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/settings/navigation?${query}`,
    {
      cache: "no-store",
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
  }),
});

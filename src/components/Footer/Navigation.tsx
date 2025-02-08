import Link from "next/link";
import queryString from "query-string";
import { z } from "zod";

import { redirect } from "next/navigation";

export const Navigation = async () => {
  const { data } = await fetchData();

  if (!data) {
    return redirect("/");
  }

  return (
    <nav className="w-full">
      <div className="flex gap-10 lg:gap-40 flex-col lg:flex-row">
        {data.footer_one && (
          <NavList
            title={data.footer_one_title}
            items={data.footer_one}
            columns={2}
          />
        )}
        {data.footer_two && (
          <div>
            <NavList title={data.footer_two_title} items={data.footer_two} />
          </div>
        )}
      </div>
    </nav>
  );
};

type NavListProps = {
  title?: string | null;
  items: z.infer<typeof NavFrame>;
  columns?: number;
};

const NavList = ({ title, items, columns = 1 }: NavListProps) => (
  <div className="flex flex-col gap-5">
    <h4 className="text-[16px] font-semibold uppercase">{title}</h4>
    <ul className={`grid gap-y-2 gap-x-10 grid-cols-1 md:grid-cols-${columns}`}>
      {items?.map(({ value }, index) => (
        <li key={index}>
          <Link href={value.slug ?? value.value} className="font-medium">
            {value.title}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const fetchData = async (): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: [
        "footer_one_title",
        "footer_one",
        "footer_two_title",
        "footer_two",
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
    footer_one: NavFrame,
    footer_two: NavFrame,
    footer_one_title: z.string().nullable().optional(),
    footer_two_title: z.string().nullable().optional(),
  }),
});

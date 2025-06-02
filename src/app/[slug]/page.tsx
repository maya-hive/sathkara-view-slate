import queryString from "query-string";
import { z } from "zod";

import { ContentPage } from "@/components/ContentPage";
import { redirect } from "next/navigation";
import NotFound from "@/app/not-found";

type Args = {
  params: Promise<{
    slug?: string;
  }>;
};

export default async function Page({ params }: Args) {
  const { slug } = await params;

  const countries = await fetchData("1");

  const pages = await fetchPages();

  const contentPage = pages.data?.find((page) => page.slug === slug);

  const country = countries.data?.find((page) => page.slug === slug);

  if (contentPage) {
    return <ContentPage {...contentPage} />;
  }

  if (country) {
    return redirect(`/countries/${slug}`);
  }

  return <NotFound />;
}

export async function generateStaticParams() {
  const query = queryString.stringify(
    { fields: ["slug"], limit: "1000" },
    { arrayFormat: "bracket" }
  );

  const [pagesResponse, countriesResponse] = await Promise.all([
    fetch(`${process.env.API_URL}/modules/page/index?${query}`),
    fetch(`${process.env.API_URL}/modules/country/index?${query}`),
  ]);

  if (!pagesResponse.ok || !countriesResponse.ok) {
    throw new Error(
      `Failed to fetch: ${pagesResponse.status} ${pagesResponse.statusText}, ` +
        `${countriesResponse.status} ${countriesResponse.statusText}`
    );
  }

  const [pagesData, countriesData] = await Promise.all([
    pagesResponse.json(),
    countriesResponse.json(),
  ]);

  return [...pagesData.data, ...countriesData.data].map(
    ({ slug }: { slug: string }) => ({
      slug,
    })
  );
}

const fetchPages = async () => {
  const query = queryString.stringify(
    {
      fields: ["id", "title", "status", "slug"],
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/modules/page/index?${query}`,
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
    return PageResponseSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.errors);

      throw new Error("API Response validation failed: " + error.message);
    }
    throw error;
  }
};

const fetchData = async (
  id: string
): Promise<z.infer<typeof ModuleResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: [
        "id",
        "name",
        "status",
        "slug",
        "featured_image",
        "short_description",
      ],
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/modules/country/index?page=${id}&${query}`,
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
    return ModuleResponseSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.errors);

      throw new Error("API Response validation failed: " + error.message);
    }
    throw error;
  }
};

const ModuleSchema = z.object({
  id: z.number(),
  status: z.number(),
  name: z.string(),
  slug: z.string(),
  short_description: z.string(),
  featured_image: z.string(),
});

const PageSchema = z.object({
  id: z.number(),
  status: z.number(),
  title: z.string(),
  slug: z.string(),
});

const ModuleResponseSchema = z.object({
  data: z.array(ModuleSchema).nullable(),
  current_page: z.number().nullable(),
  last_page: z.number().nullable(),
  links: z
    .array(
      z.object({
        url: z.string().nullable(),
        label: z.string(),
        active: z.boolean(),
      })
    )
    .nullable(),
});

const PageResponseSchema = z.object({
  data: z.array(PageSchema).nullable(),
  current_page: z.number().nullable(),
  last_page: z.number().nullable(),
  links: z
    .array(
      z.object({
        url: z.string().nullable(),
        label: z.string(),
        active: z.boolean(),
      })
    )
    .nullable(),
});

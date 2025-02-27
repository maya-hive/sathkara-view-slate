import queryString from "query-string";
import { z } from "zod";

import { Banner } from "@/components/Banner";
import { DefaultContent } from "./DefaultContent";

interface Args {
  id: number;
  slug: string;
  status: number;
  title: string;
}

export const ContentPage = async ({ id, title }: Args) => {
  const { data } = await fetchData(id.toString());

  if (!data) {
    return null;
  }

  return (
    <article>
      <Banner image={data.featured_image} title={title} />
      <DefaultContent sections={data.default_content} />
    </article>
  );
};

const fetchData = async (
  id: string
): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: ["featured_image", "default_content"],
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/settings/page_${id}?${query}`,
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

const Schema = z
  .object({
    content: z.string().nullable().optional(),
    image: z.string().nullable().optional(),
    image_position: z.string().nullable().optional(),
    link_title: z.string().nullable().optional(),
    link_url: z.string().nullable().optional(),
  })
  .nullable()
  .optional();

const ApiResponseSchema = z.object({
  data: z
    .object({
      default_content: z.array(Schema).nullable().optional(),
      featured_image: z.string().nullable().optional(),
    })
    .nullable(),
});

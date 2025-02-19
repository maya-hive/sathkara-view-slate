import queryString from "query-string";
import { z } from "zod";

import { Banner } from "@/components/Banner";
import { RichText } from "@/components/RichText";

interface Args {
  id: string;
}

export const ContentPage = async ({ id }: Args) => {
  const { data } = await fetchData(id);

  if (!data) {
    return null;
  }

  return (
    <article>
      <Banner image={data.banner_image} content={data.page_content} />
      {data.page_content && (
        <div className="container mx-auto mt-20">
          <RichText content={data.page_content} />
        </div>
      )}
    </article>
  );
};

const fetchData = async (
  id: string
): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: ["page_content", "banner_image"],
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

const ApiResponseSchema = z.object({
  data: z
    .object({
      page_content: z.string().nullable().optional(),
      banner_image: z.string().nullable().optional(),
    })
    .nullable(),
});

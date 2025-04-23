import queryString from "query-string";
import { z } from "zod";

import { Banner } from "@/components/Banner";
import { AccordionItems } from "@/components/Accordion/Items";
import { RichText } from "@/components/RichText";

export default async function Page() {
  const { data } = await fetchData();
  return (
    <article>
      <Banner image={data?.banner_image} title={data?.page_title} />
      <section className="container mx-auto px-4 sm:px-6 mt-8">
        <RichText content={data?.page_content} />
      </section>
      <AccordionItems items={data?.items} />
    </article>
  );
}

const fetchData = async (): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: ["page_title", "page_content", "banner_image", "items"],
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/settings/page_faq?${query}`,
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
      page_title: z.string().nullable().optional(),
      page_content: z.string().nullable().optional(),
      banner_image: z.string().nullable().optional(),
      items: z
        .array(
          z
            .object({
              title: z.string().nullable().optional(),
              content: z.string().nullable().optional(),
            })
            .nullable()
        )
        .nullable()
        .optional(),
    })
    .nullable(),
});

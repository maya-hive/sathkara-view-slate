import queryString from "query-string";
import { z } from "zod";

import { Banner } from "@/components/Banner";
import { InquiryContentSection } from "@/components/Inquiry/ContentSection";
import { NoData } from "@/app/no-data";

export default async function Page() {
  const { data } = await fetchData();

  if (!data) {
    return <NoData />;
  }

  return (
    <article>
      <Banner image={data?.banner_image} title={data?.page_title} />
      <InquiryContentSection
        image={data?.side_image}
        content={data?.side_content}
      />
    </article>
  );
}

const fetchData = async (): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: ["page_title", "banner_image", "side_content", "side_image"],
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/settings/page_inquiry?${query}`,
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
      banner_image: z.string().nullable().optional(),
      side_content: z.string().nullable().optional(),
      side_image: z.string().nullable().optional(),
    })
    .nullable(),
});

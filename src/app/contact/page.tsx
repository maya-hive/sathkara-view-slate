import queryString from "query-string";
import { z } from "zod";

import { ContactContentSection } from "@/components/Contact/ContentSection";
import { RichText } from "@/components/RichText";
import { Banner } from "@/components/Banner";
import { NoData } from "@/app/no-data";

export default async function Page() {
  const { data } = await fetchData();

  if (!data) {
    return <NoData />;
  }

  return (
    <article>
      <Banner image={data?.banner_image} title={data?.page_title} />
      {data?.page_content && (
        <section className="mt-12 container mx-auto px-4 sm:px-6">
          <RichText content={data.page_content} />
        </section>
      )}
      <ContactContentSection
        content={data?.form_contacts_content}
        formContent={data?.form_content}
      />
      {data?.map && (
        <section className="mt-12 container mx-auto px-4 sm:px-6">
          <div
            className="w-full rounded-lg overflow-hidden [&>iframe]:w-full [&>iframe]:h-[460px]"
            dangerouslySetInnerHTML={{ __html: data.map }}
          />
        </section>
      )}
    </article>
  );
}

const fetchData = async (): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: [
        "page_title",
        "banner_image",
        "page_content",
        "form_contacts_content",
        "form_content",
        "map",
      ],
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/settings/page_contact?${query}`,
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
      page_content: z.string().nullable().optional(),
      form_contacts_content: z.string().nullable().optional(),
      form_content: z.string().nullable().optional(),
      map: z.string().nullable().optional(),
    })
    .nullable(),
});

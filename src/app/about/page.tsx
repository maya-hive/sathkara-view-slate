import queryString from "query-string";
import { z } from "zod";

import { Banner } from "@/components/Banner";
import { RichText } from "@/components/RichText";
import { DefaultContent } from "@/components/DefaultContent";
import { NoData } from "@/app/no-data";

export default async function Page() {
  const { data } = await fetchData();

  if (!data) {
    return <NoData />;
  }

  return (
    <article>
      <Banner image={data?.banner_image} title={data?.page_title} />
      <section className="container mx-auto mt-8">
        <RichText content={data?.page_content} />
      </section>
      <DefaultContent
        sections={[
          {
            content: data?.content_1,
            image: data?.image_1,
            link_title: data?.link_1_title,
            link_url: data?.link_1_url,
            image_position: data?.image_position_1,
          },
        ]}
      />
      <section className="container mx-auto my-20">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-6 rounded-xl bg-muted p-8 flex items-center text-center">
            <RichText content={data?.vision_content} />
          </div>
          <div className="col-span-12 md:col-span-6 rounded-xl bg-muted p-8 flex items-center text-center">
            <RichText content={data?.mission_content} />
          </div>
        </div>
      </section>
      <DefaultContent
        sections={[
          {
            content: data?.content_2,
            image: data?.image_2,
            link_title: data?.link_2_title,
            link_url: data?.link_2_url,
            image_position: data?.image_position_2,
          },
        ]}
      />
    </article>
  );
}

const fetchData = async (): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: [
        "page_title",
        "page_content",
        "banner_image",
        "content_1",
        "image_1",
        "link_1_title",
        "link_1_url",
        "image_position_1",
        "content_2",
        "image_2",
        "link_2_title",
        "link_2_url",
        "image_position_2",
        "vision_content",
        "mission_content",
      ],
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/settings/page_about?${query}`,
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
      content_1: z.string().nullable().optional(),
      image_1: z.string().nullable().optional(),
      link_1_title: z.string().nullable().optional(),
      link_1_url: z.string().nullable().optional(),
      image_position_1: z.string().nullable().optional(),
      content_2: z.string().nullable().optional(),
      image_2: z.string().nullable().optional(),
      link_2_title: z.string().nullable().optional(),
      link_2_url: z.string().nullable().optional(),
      image_position_2: z.string().nullable().optional(),
      vision_content: z.string().nullable().optional(),
      mission_content: z.string().nullable().optional(),
    })
    .nullable(),
});

import queryString from "query-string";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";

import { Banner } from "@/components/Banner";
import { RichText } from "@/components/RichText";
import { toBase64 } from "@/utils/base64";
import { shimmer } from "@/components/Shimmer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      {data.default_content && (
        <>
          {data.default_content.map((section, idx) => {
            const isImageRight = section?.image_position === "right";

            return (
              <section key={idx} className="container mx-auto my-20">
                <div className="grid grid-cols-12 gap-6">
                  {section?.image && (
                    <div
                      className={cn(
                        "md:col-span-6",
                        isImageRight ? "order-2" : "order-1",
                        "col-span-12"
                      )}
                    >
                      <div className="relative pt-[100%] md:pt-0 h-[100%]">
                        <Image
                          className="w-full h-full object-cover absolute top-0 left-0 md:rounded-lg"
                          src={section.image}
                          alt={"section " + idx}
                          placeholder={`data:image/svg+xml;base64,${toBase64(
                            shimmer(700, 475)
                          )}`}
                          priority={false}
                          width={800}
                          height={600}
                        />
                      </div>
                    </div>
                  )}
                  <div
                    className={cn(
                      section?.image
                        ? "md:col-span-6 md:py-20"
                        : "md:col-span-12",
                      isImageRight ? "order-1" : "order-2",
                      "col-span-12"
                    )}
                  >
                    {section?.content && (
                      <RichText content={section?.content} />
                    )}
                    {section?.link_url && (
                      <Link href={section.link_url} className="block mt-2">
                        <Button variant="link" className="px-0">
                          {section.link_title}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </section>
            );
          })}
        </>
      )}
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

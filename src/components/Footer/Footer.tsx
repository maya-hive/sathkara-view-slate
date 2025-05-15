import Image from "next/image";
import Link from "next/link";
import queryString from "query-string";
import { z } from "zod";

import { SocialMediaIcons } from "../SocialMediaIcons";
import { Navigation } from "./Navigation";
import { CompnayLogos } from "@/components/CompanyLogos";

export const Footer = async () => {
  const { data } = await fetchData();

  if (!data) {
    return null;
  }

  return (
    <>
      <CompnayLogos
        logos={data.itinerary_collaborations}
        content={data.collaborations_title}
      />
      <div className="relative border-t mt-8 pt-8 bg-sky-950 text-black">
        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-white">
          <div className="py-6 lg:py-12 flex gap-5 flex-col lg:flex-row justify-between items-center lg:items-start text-center lg:text-start">
            {data.footer_top_content && (
              <span
                dangerouslySetInnerHTML={{ __html: data.footer_top_content }}
                className="[&>h2]:text-4xl [&>h2]:font-semibold [&>p]:mt-2 [&>p]:font-medium"
              />
            )}
            {data.footer_top_link?.url && (
              <Link
                href={data.footer_top_link.url}
                className="h-fit rounded w-fit bg-yellow-300 text-cyan-950 px-16 py-4 text-center text-md font-semibold uppercase"
              >
                {data.footer_top_link?.title}
              </Link>
            )}
          </div>
          <div className="border-y border-sky-800 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10 py-8 lg:pt-12 lg:pb-20 text-center lg:text-start text-md">
            <div className="text-3xl font-extralight">
              <p className="max-w-[300px] mb-4">{data.footer_contact_title}</p>
              {data.footer_contact_number && (
                <a
                  href={"tel:" + data.footer_contact_number.replace(/\s/g, "")}
                  className="mt-3"
                >
                  <span>{data.footer_contact_number}</span>
                </a>
              )}
              <div className="mt-6">
                <SocialMediaIcons
                  color="text-sky-400"
                  links={data.social_media}
                  size="sm"
                />
              </div>
            </div>
            <div className="mt-8 lg:mt-0 text-[15px]">
              <Navigation />
            </div>
            <div className="mt-8 lg:mt-0 font-medium">
              <div>
                <span className="text-[16px] font-semibold uppercase">
                  Contact Us
                </span>
                <p className="mt-4 whitespace-pre-line">{data.address}</p>
              </div>
              {data.phone_numbers?.length && (
                <div className="mt-4 flex gap-2 text-[15px] ">
                  {data.phone_numbers?.map(({ number }, idx, arr) => (
                    <a key={idx} href={`tel:${number}`} className="block">
                      {number}
                      {idx < arr.length - 1 ? ", " : ""}
                    </a>
                  ))}
                </div>
              )}
              <div className="mt-4 flex flex-col gap-2 text-[15px] ">
                {data.email_address?.map(({ email }, idx) => (
                  <a key={idx} href={`mailto:${email}`} className="block">
                    {email}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <small className="py-6 flex gap-4 flex-col lg:flex-row justify-between items-center text-sm font-medium">
            <p>
              {data.footer_copyrights?.replace(
                "[year]",
                new Date().getFullYear().toString()
              )}
            </p>
            {process.env.NEXT_PUBLIC_AUTHOR_URL && (
              <Link
                className="flex items-center gap-1.5"
                href={process.env.NEXT_PUBLIC_AUTHOR_URL}
                target="_blank"
              >
                <span>Website By</span>
                <Image
                  className="object-contain h-auto w-auto"
                  src="/maya-logo.webp"
                  alt="Maya Hive"
                  height={20}
                  width={55}
                  priority={false}
                />
              </Link>
            )}
          </small>
        </div>
        {data.footer_bg_image && (
          <Image
            className="w-full h-full object-cover absolute top-0 left-0 opacity-10"
            src={data.footer_bg_image}
            alt="Footer background"
            priority={false}
            width={1200}
            height={400}
          />
        )}
      </div>
    </>
  );
};

const fetchData = async (): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: [
        "footer_bg_image",
        "footer_top_content",
        "footer_top_link",
        "footer_contact_title",
        "footer_contact_number",
        "footer_copyrights",
        "phone_numbers",
        "email_address",
        "address",
        "social_media",
        "collaborations_title",
        "itinerary_collaborations",
      ],
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/settings/general?${query}`,
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
      footer_bg_image: z.string().nullable().optional(),
      footer_top_content: z.string().nullable().optional(),
      footer_top_link: z
        .object({
          title: z.string().nullable().optional(),
          url: z.string().nullable().optional(),
        })
        .nullable()
        .optional(),
      footer_contact_title: z.string().nullable().optional(),
      footer_contact_number: z.string().nullable().optional(),
      footer_copyrights: z.string().nullable().optional(),
      social_media: z
        .object({
          facebook: z.string().nullable(),
          instagram: z.string().nullable(),
          twitter_x: z.string().nullable(),
          tiktok: z.string().nullable(),
          youtube: z.string().nullable(),
          linkedin: z.string().nullable(),
        })
        .nullable()
        .optional(),
      phone_numbers: z
        .array(z.object({ number: z.string().nullable() }))
        .nullable()
        .optional(),
      email_address: z
        .array(z.object({ email: z.string().nullable() }))
        .nullable()
        .optional(),
      address: z.string().nullable().optional(),
      collaborations_title: z.string().nullable().optional(),
      itinerary_collaborations: z
        .array(
          z.object({ icon: z.string().nullable(), link: z.string().nullable() })
        )
        .nullable(),
    })
    .nullable(),
});

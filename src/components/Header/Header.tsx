import queryString from "query-string";
import Link from "next/link";
import Image from "next/image";

import { Navigation } from "./Navigation";
import { z } from "zod";

export const Header = async () => {
  const { data } = await fetchData();

  if (!data) {
    return null;
  }

  return (
    <header className="border-b shadow-xl lg:sticky top-0 z-50">
      <Navigation
        socials={data.social_media}
        phone={data.contact_details?.itinerary_inquiry_phone ?? null}
      >
        <Link href="/">
          {data.site_logo && (
            <Image
              className="rounded w-full h-[60px] object-contain"
              src={data.site_logo}
              alt={data.site_name ?? "logo"}
              width={140}
              height={70}
              priority={true}
            />
          )}
        </Link>
      </Navigation>
    </header>
  );
};

const fetchData = async (): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: ["site_name", "site_logo", "contact_details", "social_media"],
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
      site_name: z.string().nullable(),
      site_logo: z.string().nullable(),
      contact_details: z
        .object({
          itinerary_inquiry_phone: z
            .object({
              title: z.string().nullable(),
              number: z.string().nullable(),
            })
            .nullable()
            .optional(),
        })
        .nullable()
        .optional(),
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
    })
    .nullable(),
});

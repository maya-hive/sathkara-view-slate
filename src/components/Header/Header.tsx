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
    <header className="border-b">
      <Navigation
        phone={{
          title: data.header_contact_title,
          value: data.header_contact_number,
        }}
      >
        <Link href="/">
          {data.site_logo && (
            <Image
              className="rounded w-full h-[60px] object-cover"
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
      fields: [
        "site_name",
        "site_logo",
        "header_contact_title",
        "header_contact_number",
      ],
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/settings/general?${query}`
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
  data: z.object({
    site_name: z.string().nullable(),
    site_logo: z.string().nullable(),
    header_contact_title: z.string().nullable(),
    header_contact_number: z.string().nullable(),
  }),
});

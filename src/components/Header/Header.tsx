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
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          {data.site_logo && (
            <Image
              className="rounded w-full h-[70px] my-2 object-cover"
              src={data.site_logo}
              alt={data.site_name ?? "logo"}
              width={140}
              height={70}
            />
          )}
        </Link>
        <Navigation />
      </div>
    </header>
  );
};

type ApiResponse = z.infer<typeof ApiResponseSchema>;

const fetchData = async (): Promise<ApiResponse> => {
  const query = queryString.stringify(
    { fields: ["site_name", "site_logo"] },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/settings/general?${query}`,
    {
      cache: "no-store",
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

const Schema = z.object({
  site_name: z.string().nullable(),
  site_logo: z.string().nullable(),
});

const ApiResponseSchema = z.object({
  data: Schema,
});

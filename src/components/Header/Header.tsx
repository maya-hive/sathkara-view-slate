import queryString from "query-string";
import type { ApiResponse } from "@/types/ApiResponse.types";
import { Navigation } from "./Navigation";
import Link from "next/link";

export const Header = async () => {
  const { data } = await fetchSettings();

  if (!data) {
    return null;
  }

  return (
    <header className="border-b">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <div>{data.site_name}</div>
        </Link>
        <Navigation />
      </div>
    </header>
  );
};

const fetchSettings = async (): Promise<ApiResponse<Settings>> => {
  const query = queryString.stringify(
    { fields: ["site_name"] },
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

  return response.json();
};

interface Settings {
  site_name?: string;
}

import queryString from "query-string";
import Link from "next/link";
import type { ApiResponse, LinkFrame } from "@/types/ApiResponse.types";

export const Navigation = async () => {
  const { data } = await fetchSettings();

  if (!data) {
    return null;
  }

  return (
    <nav className="py-4 flex justify-end gap-5">
      {data.header_primary?.map(({ value }, index) => (
        <Link key={index} href={value.value}>
          {value.title}
        </Link>
      ))}
    </nav>
  );
};

const fetchSettings = async (): Promise<ApiResponse<NavigationSettings>> => {
  const query = queryString.stringify(
    { fields: ["header_primary"] },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/settings/navigation?${query}`,
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

interface NavigationSettings {
  header_primary?: LinkFrame[] | null;
}

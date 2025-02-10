import queryString from "query-string";

import type { ApiResponse } from "@/types/ApiResponse.types";
import { Banner } from "@/components/Banner";

export default async function Contact() {
  const { data } = await fetchSettings();

  if (!data) {
    return <></>;
  }

  return (
    <article>
      <Banner image={data.banner_image} content={data.banner_content} />
    </article>
  );
}

const fetchSettings = async (): Promise<ApiResponse<Settings>> => {
  const query = queryString.stringify(
    {
      fields: ["banner_content", "banner_image"],
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

  return response.json();
};

type Settings = {
  banner_content?: string;
  banner_image?: string;
};

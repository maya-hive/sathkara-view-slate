import { redirect } from "next/navigation";
import queryString from "query-string";
import { z } from "zod";

import { ItineraryListing } from "@/components/Itinerary/Listing/Main";
import { NoData } from "@/app/no-data";

type Args = {
  params: Promise<{
    id?: string;
  }>;
};

export default async function Page({ params }: Args) {
  const { id = "1" } = await params;

  if (id === "1") {
    return redirect(`/itineraries`);
  }

  const data = await fetchData(id);

  if (!data) {
    return <NoData />;
  }

  return <ItineraryListing {...data} />;
}

export async function generateStaticParams() {
  const { last_page } = await fetchData("1");

  const pages = new Array(last_page).fill(0).map((_, i) => ++i);

  return pages.map((id) => ({
    id: id.toString(),
  }));
}

const fetchData = async (
  id: string,
  country?: string
): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: ["id", "status", "slug"],
      country: country,
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/modules/itinerary/index?page=${id}&${query}`,
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

const Schema = z.object({
  id: z.number(),
  status: z.number(),
  slug: z.string(),
});

const ApiResponseSchema = z.object({
  data: z.array(Schema).nullable(),
  current_page: z.number().nullable(),
  last_page: z.number().nullable(),
  links: z
    .array(
      z.object({
        url: z.string().nullable(),
        label: z.string(),
        active: z.boolean(),
      })
    )
    .nullable(),
});

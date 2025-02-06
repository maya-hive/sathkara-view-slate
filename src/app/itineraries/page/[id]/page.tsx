import queryString from "query-string";
import { cache } from "react";
import { z } from "zod";

import { redirect } from "next/navigation";
import { ItineraryListing } from "@/components/Itinerary/Listing";

type Args = {
  params: Promise<{
    id?: string;
  }>;
};

export default async function Page({ params }: Args) {
  const { id = "1" } = await params;

  if (id === "1") {
    return redirect("/itineraries");
  }

  const data = await fetchData(id);

  if (!data) {
    return null;
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

const fetchData = cache(
  async (id: string): Promise<z.infer<typeof ApiResponseSchema>> => {
    const query = queryString.stringify(
      {
        fields: [
          "id",
          "name",
          "status",
          "slug",
          "sale_price",
          "featured_image",
          "short_description",
          "duration",
          "price",
        ],
        relations: ["destination"],
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
  }
);

const Schema = z.object({
  id: z.number(),
  status: z.number(),
  name: z.string(),
  slug: z.string(),
  short_description: z.string(),
  price: z.string(),
  featured_image: z.string(),
  sale_price: z.string().nullable(),
  duration: z.string().nullable(),
  destination: z
    .object({
      name: z.string(),
    })
    .nullable(),
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

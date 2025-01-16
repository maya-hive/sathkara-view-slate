import Image from "next/image";
import queryString from "query-string";
import type { ApiResponse } from "@/types/ApiResponse.types";

interface Props {
  slug: string;
}

export const ItineraryCard = async ({ slug }: Props) => {
  const { data } = await fetchData(slug);

  if (!data) {
    return <p className="text-center text-red-500">No data available.</p>;
  }

  return (
    <a href={"/itineraries/" + slug} className="mt-8 p-8 border">
      <Image
        className="rounded w-full h-[200px] object-cover"
        src={data.featured_image}
        alt={"Featured image"}
        width={500}
        height={100}
      />
      <h2 className="font-semibold mt-2">{data.name}</h2>
      <p>{data.short_description}</p>
      <p>Price: {data.price}</p>
    </a>
  );
};

const fetchData = async (slug: string): Promise<ApiResponse<Itinerary>> => {
  const query = queryString.stringify(
    { fields: ["id", "name", "featured_image", "short_description", "price"] },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/modules/itinerary/${slug}?${query}`,
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

type Itinerary = {
  id: number;
  status: number;
  name: string;
  slug: string;
  price: string;
  sale_price: string;
  rating: number;
  duration: string | null;
  map: string;
  is_sale_active: number;
  code: string;
  short_description: string;
  overview: string | null;
  terms_and_conditions: string | null;
  package_includes: string | null;
  featured_image: string;
  listing_image?: string | null;
  gallery?: string | null;
  meta_title: string;
  meta_description: string;
  created_by: number;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
};

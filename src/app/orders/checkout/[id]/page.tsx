import queryString from "query-string";
import { z } from "zod";

import { NoData } from "@/app/no-data";
import { Banner } from "@/components/Banner";
import { CheckoutForm } from "@/components/Checkout/CheckoutForm";

type Args = {
  params: Promise<{
    id?: string;
  }>;
};

export default async function Page({ params }: Args) {
  const { data } = await fetchData();
  const { id: encodedId } = await params;

  if (!data || !encodedId) {
    return <NoData />;
  }

  return (
    <article>
      <Banner image={data?.banner_image} title={"Checkout"} />
      <CheckoutForm encodedId={encodedId} />
    </article>
  );
}

const fetchData = async (): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: ["page_title", "banner_image"],
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/settings/page_order?${query}`,
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
      page_title: z.string().nullable().optional(),
      banner_image: z.string().nullable().optional(),
    })
    .nullable(),
});

import Link from "next/link";
import queryString from "query-string";
import { z } from "zod";

interface Props {
  children?: React.ReactNode;
}

export const ItineraryInquirySidebarCTA = async ({ children }: Props) => {
  const { data } = await fetchData();

  if (!data) {
    return null;
  }
  return (
    <div className="rounded-lg bg-blue-100 p-6">
      {data.inquiry_title && (
        <div
          className="text-center border-b border-slate-400 px-4 pb-4 [&>h3]:text-2xl [&>h3]:text-slate-900 [&>h3]:font-semibold [&>p]:mt-3 [&>p]:text-md [&>p]:font-semibold"
          dangerouslySetInnerHTML={{ __html: data.inquiry_title }}
        />
      )}
      {children}
      <Link
        href="#inquiry_form"
        className="mt-4 block rounded bg-black text-white p-3 uppercase text-md text-center font-medium"
      >
        Plan your trip
      </Link>
    </div>
  );
};

const fetchData = async (): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: ["inquiry_title"],
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
      inquiry_title: z.string().nullable().optional(),
    })
    .nullable(),
});

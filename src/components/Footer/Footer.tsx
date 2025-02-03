import queryString from "query-string";
import { z } from "zod";

export const Footer = async () => {
  const { data } = await fetchData();

  if (!data) {
    return null;
  }

  return (
    <div className="border-t mt-8 py-4">
      <div className="container mx-auto">
        <div className="flex justify-between">
          <p>
            {data.footer_copyrights?.replace(
              "[year]",
              new Date().getFullYear().toString()
            )}
          </p>
          <p>Maya Hive</p>
        </div>
      </div>
    </div>
  );
};

const fetchData = async (): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: ["footer_copyrights"],
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
    footer_copyrights: z.string().nullable(),
  }),
});

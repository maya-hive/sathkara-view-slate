import { RichText } from "@/components/RichText";

import { ContactForm } from "./Form";
import queryString from "query-string";
import { z } from "zod";

interface Props {
  formContent?: string | null;
  content?: string | null;
}

export const ContactContentSection = async ({
  content,
  formContent,
}: Props) => {
  const { data } = await fetchData();

  if (!data) {
    return null;
  }

  return (
    <section className="container mx-auto px-4">
      <div className="mt-12 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 rounded-xl bg-muted p-8">
          <div className="flex justify-between flex-col xl:flex-row gap-4 pt-2 pb-5 mb-5">
            <RichText content={content} />
          </div>
          <div>
            <div className="mt-4 pb-4 border-b">
              <div className="font-semibold">Phone</div>
              {data.phone_numbers?.length && (
                <div className="flex gap-2">
                  {data.phone_numbers?.map(({ number }, idx, arr) => (
                    <a key={idx} href={`tel:${number}`} className="block">
                      {number}
                      {idx < arr.length - 1 ? ", " : ""}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-4 pb-4 border-b">
              <div className="font-semibold">Email</div>
              <div className="flex flex-col gap-2">
                {data.email_address?.map(({ email }, idx) => (
                  <a key={idx} href={`mailto:${email}`} className="block">
                    {email}
                  </a>
                ))}
              </div>
            </div>
            <div className="mt-4 pb-4">
              <div className="font-semibold">Address</div>
              <p className="whitespace-pre-line">{data.address}</p>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <ContactForm content={formContent} />
        </div>
      </div>
    </section>
  );
};

const fetchData = async (): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: ["phone_numbers", "email_address", "address"],
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
      phone_numbers: z
        .array(z.object({ number: z.string().nullable() }))
        .nullable()
        .optional(),
      email_address: z
        .array(z.object({ email: z.string().nullable() }))
        .nullable()
        .optional(),
      address: z.string().nullable().optional(),
    })
    .nullable(),
});

import queryString from "query-string";
import { z } from "zod";

import { ItineraryInquiryFormClient as FormClient } from "./Form.client";

export const ItineraryInquiryForm = async () => {
  const { data } = await fetchData();
  const { data: itineraryCategories } = await itienraryCategories();

  if (!data) {
    return null;
  }

  return (
    <div className="rounded-xl bg-muted p-6" id="inquiry_form">
      <div className="flex justify-between flex-col xl:flex-row gap-4 border-b border-slate-300 pt-2 pb-5 mb-5">
        {data.itinerary_plan_title && (
          <div
            className="[&>h3]:text-3xl [&>h3]:font-semibold [&>p]:mt-2 [&>p]:text-md [&>p]:font-medium"
            dangerouslySetInnerHTML={{ __html: data.itinerary_plan_title }}
          />
        )}
        {data.contact_details?.itinerary_inquiry_phone?.number && (
          <div className="pr-2">
            <p className="text-md font-medium text-primary">
              {data.contact_details.itinerary_inquiry_phone?.title}
            </p>
            <a
              href={`tel:${data.contact_details.itinerary_inquiry_phone.number.replace(
                /\s/g,
                ""
              )}`}
              className="mt-1 block text-2xl font-semibold"
            >
              {data.contact_details.itinerary_inquiry_phone.number}
            </a>
          </div>
        )}
      </div>
      <FormClient itineraryCategories={itineraryCategories} />
    </div>
  );
};

const itienraryCategories = async (): Promise<
  z.infer<typeof ItineraryCategoryResponseSchema>
> => {
  const query = queryString.stringify(
    {
      fields: ["id", "name", "status", "slug"],
      limit: "1000",
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/modules/itineraryCategory/index?${query}`,
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
    return ItineraryCategoryResponseSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.errors);

      throw new Error("API Response validation failed: " + error.message);
    }
    throw error;
  }
};

const ItineraryCategoryResponseSchema = z.object({
  data: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        status: z.number(),
        slug: z.string(),
      })
    )
    .nullable(),
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

const fetchData = async (): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: ["itinerary_plan_title", "contact_details"],
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
      itinerary_plan_title: z.string().nullable().optional(),
      contact_details: z
        .object({
          itinerary_inquiry_phone: z
            .object({
              title: z.string().nullable(),
              number: z.string().nullable(),
            })
            .nullable()
            .optional(),
        })
        .nullable()
        .optional(),
    })
    .nullable(),
});

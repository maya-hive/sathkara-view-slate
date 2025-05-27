import queryString from "query-string";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";

import { shimmer } from "@/components/Shimmer";
import { CityName } from "@/components/City/Name";
import { PriceTag } from "@/components/PriceTag";
import { toBase64 } from "@/utils/base64";

interface Props {
  slug: string;
}

export const ItineraryCard = async ({ slug }: Props) => {
  const { data } = await fetchData(slug);

  if (!data) {
    return null;
  }

  return <CardLayout data={data} />;
};

const CardLayout = ({ data }: z.infer<typeof ApiResponseSchema>) => {
  if (!data) {
    return null;
  }

  const slug = `/${data.destination.slug}/itineraries/${data.slug}`;

  return (
    <div className="h-full border rounded-lg overflow-hidden flex flex-col justify-between">
      <div className="relative pt-[60%]">
        <Link href={slug}>
          <Image
            className="w-full h-full object-cover absolute top-0 left-0"
            src={data.listing_image ?? data.featured_image}
            alt={data.name}
            placeholder={`data:image/svg+xml;base64,${toBase64(
              shimmer(700, 475)
            )}`}
            priority={false}
            width={500}
            height={400}
          />
        </Link>
        <div className="p-4">
          <div className="absolute bottom-0 right-5 z-10">
            <h4 className="rounded-t bg-secondary text-white text-sm font-semibold w-fit py-2 px-5 uppercase">
              {data.destination.name}
            </h4>
          </div>
        </div>
      </div>
      <div className="p-4 flex flex-col h-full">
        <div className="flex flex-col h-full">
          <Link href={slug}>
            <h3 className="mt-2 pb-2 font-bold text-2xl">{data.name}</h3>
          </Link>
          {data.featured_cities && data.featured_cities.length > 0 && (
            <div className="border-y py-3">
              <div className="flex items-center gap-2">
                <svg
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 7.81818C13 11.9545 7.5 15.5 7.5 15.5C7.5 15.5 2 11.9545 2 7.81818C2 6.40771 2.57946 5.05501 3.61091 4.05766C4.64236 3.06031 6.04131 2.5 7.5 2.5C8.95869 2.5 10.3576 3.06031 11.3891 4.05766C12.4205 5.05501 13 6.40771 13 7.81818Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="stroke-secondary"
                  />
                  <path
                    d="M7.5 9.5C8.32843 9.5 9 8.82843 9 8C9 7.17157 8.32843 6.5 7.5 6.5C6.67157 6.5 6 7.17157 6 8C6 8.82843 6.67157 9.5 7.5 9.5Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="stroke-secondary"
                  />
                </svg>
                <p className="text-sm font-semibold inline-flex gap-1">
                  {data.featured_cities.map((city, idx) => (
                    <span key={idx}>
                      <CityName slug={city} />,
                    </span>
                  ))}
                  and More
                </p>
              </div>
            </div>
          )}
          <div className="border-b py-3 flex flex-col flex-1">
            <p className="text-sm font-semibold text-neutral-700">
              {data.short_description}
            </p>
            <div className="mt-2 flex gap-3">
              {data?.tags?.map(({ name }, idx) => (
                <span
                  key={idx}
                  className="border rounded border-primary text-primary py-1 px-3 font-semibold text-xs uppercase"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-2 rounded bg-secondary text-white p-4 flex items-center font-bold">
            <div className="text-lg min-w-[80px]">
              {data?.days_count_html && (
                <div
                  dangerouslySetInnerHTML={{ __html: data?.days_count_html }}
                  className="font-bold [&>span]:block [&>span]:text-sm [&>span]:font-medium [&>span]:leading-[16px]"
                />
              )}
            </div>
            <div className="border-l border-muted-foreground pl-3">
              <div className="flex items-center">
                <span className="text-sm font-medium max-w-[70px]">
                  Starting From
                </span>
                <div>
                  <p className="font-semibold">
                    {data?.is_sale_active ? (
                      <>
                        <PriceTag
                          amount={data.price}
                          className="block text-md line-through leading-6"
                        />
                        <PriceTag
                          amount={data.sale_price}
                          className="text-2xl md:text-3xl"
                        />
                      </>
                    ) : (
                      <PriceTag
                        amount={data?.price}
                        className="text-2xl md:text-3xl"
                      />
                    )}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-sm font-medium">
                {data.price_description}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-2 border-t w-100 pt-2 flex gap-3 text-white text-sm text-center font-semibold uppercase">
          <Link
            href={slug}
            className="rounded bg-muted-foreground p-3 flex flex-col justify-center items-center flex-1"
          >
            Learn About the Journey
          </Link>
          <Link
            href={slug + "#inquiry_form"}
            className="rounded w-full bg-primary px-3 py-6 flex flex-col justify-center items-center flex-1"
          >
            Start Your Journey
          </Link>
        </div>
      </div>
    </div>
  );
};

const fetchData = async (
  slug: string
): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: [
        "id",
        "name",
        "status",
        "slug",
        "sale_price",
        "is_sale_active",
        "featured_image",
        "listing_image",
        "short_description",
        "duration",
        "days_count_html",
        "price",
        "price_description",
        "destination",
        "tags",
        "featured_cities",
      ],
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/modules/itinerary/${slug}?${query}`,
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
      id: z.number(),
      status: z.number(),
      name: z.string(),
      slug: z.string(),
      short_description: z.string(),
      price: z.string(),
      price_description: z.string().nullable(),
      featured_image: z.string(),
      listing_image: z.string().nullable().optional(),
      sale_price: z.string().nullable(),
      is_sale_active: z.number().nullable(),
      duration: z.string().nullable(),
      days_count_html: z.string().nullable(),
      destination: z.object({
        name: z.string(),
        slug: z.string(),
      }),
      tags: z
        .array(z.object({ name: z.string(), slug: z.string() }))
        .nullable(),
      featured_cities: z.array(z.string()).nullable().optional(),
    })
    .nullable(),
});

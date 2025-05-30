import { toBase64 } from "@/utils/base64";
import queryString from "query-string";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";

import { shimmer } from "../Shimmer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";

interface Props {
  image: string | null;
  audience: string | null;
  title: string | null;
  description: string | null;
  testimonial: string | null;
}

export const AudienceTestimonialCard = async ({
  data: props,
}: {
  data: Props;
}) => {
  if (!props.audience) return null;

  const { data } = await fetchData(props.audience);

  if (!data || !props.testimonial) {
    return null;
  }

  return <CardLayout data={data} props={props} />;
};

const CardLayout = ({
  data,
  props,
}: {
  data: z.infer<typeof ApiResponseSchema>["data"];
  props: Props;
}) => {
  if (!data) {
    return null;
  }

  const slug = `/itineraries?audiences=${data.slug}`;

  return (
    <div className="rounded-2xl overflow-hidden h-full">
      <div className="relative h-full py-[5px] md:py-[50px] flex items-end text-white text-center md:text-left">
        <div className="relative w-full z-20 p-8 flex flex-col md:flex-row gap-8 items-center md:items-end">
          <div className="flex-1">
            <h3 className="text-3xl lg:text-5xl font-semibold leading-tight">
              {props.title}
            </h3>
            <p className="mt-3 text-primary text-xl font-semibold">
              {props.description?.replace(
                "[count]",
                data.itineraries?.length.toString() ?? ""
              )}
            </p>
          </div>
          <div className="max-w-[320px]">
            {props.testimonial && (
              <>
                <FontAwesomeIcon icon={faQuoteLeft} className="text-6xl" />
                <div
                  dangerouslySetInnerHTML={{ __html: props.testimonial }}
                  className="[&>h4]:text-3xl [&>h4]:font-semibold [&>h5]:mt-6 [&>p]:mt-4 [&>p]:text-lg font-medium"
                />
              </>
            )}
            <Link
              href={slug}
              className="block rounded w-fit mt-8 mx-auto md:mx-0 bg-primary text-white px-10 py-2 text-center text-md font-medium uppercase"
            >
              Plan Your Trip
            </Link>
          </div>
        </div>
        <Image
          className="w-full h-full object-cover absolute top-0 left-0 -z-10 "
          src={props.image ?? data.featured_image}
          alt={data.name}
          placeholder={`data:image/svg+xml;base64,${toBase64(
            shimmer(700, 475)
          )}`}
          priority={false}
          width={800}
          height={500}
        />
        <div className="absolute bottom-0 left-0 h-full w-full bg-gradient-to-l md:bg-gradient-to-r from-transparent via-transparent/50 to-slate-800/100 to-[70%]"></div>
        <div className="absolute bottom-0 left-0 h-full w-full bg-gradient-to-r md:bg-gradient-to-b from-transparent via-transparent/10 to-slate-800/100 to-[85%] opacity-70"></div>
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
        "featured_image",
        "short_description",
        "itineraries",
      ],
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/modules/audience/${slug}?${query}`,
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
      featured_image: z.string(),
      itineraries: z
        .array(
          z.object({ id: z.number(), status: z.number(), slug: z.string() })
        )
        .nullable(),
    })
    .nullable(),
});

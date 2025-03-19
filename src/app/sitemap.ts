import queryString from "query-string";
import { z } from "zod";

export const baseUrl = process.env.BASE_URL;

export default async function sitemap() {
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/faq",
    "/inquiry",
    "/activities",
    "/accommodations",
    "/accommodation-categories",
    "/cities",
    "/itineraries",
    "/activity-categories",
    "/itinerary-categories",
    "/destinations",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const modules = [
    { name: "itinerary", route: "itineraries" },
    { name: "activity", route: "activities" },
    { name: "accommodation", route: "accommodations" },
    { name: "destination", route: "destinations" },
    { name: "city", route: "cities" },
  ] as const;

  const moduleRoutePromises = modules.map(async (module) => {
    const items = await fetchModuleRoutes(module.name);
    return items.map((item) => ({
      url: `${baseUrl}/${
        item.destination
          ? `${item.destination.slug}/${module.route}/${item.slug}`
          : `${module.route}/${item.slug}`
      }`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    }));
  });

  const moduleRoutesArrays = await Promise.all(moduleRoutePromises);
  const moduleRoutes = moduleRoutesArrays.flat();

  return [...staticRoutes, ...moduleRoutes];
}

async function fetchModuleRoutes(
  endpoint: string
): Promise<z.infer<typeof Schema>[]> {
  const query = queryString.stringify(
    {
      fields: ["id", "status", "slug", "destination"],
    },
    { arrayFormat: "bracket" }
  );

  try {
    const response = await fetch(
      `${process.env.API_URL}/modules/${endpoint}/index?${query}`,
      {
        next: { tags: ["global"] },
      }
    );

    if (!response.ok) {
      const errorMessage = `Failed to fetch: ${response.status} ${response.statusText}`;

      throw new Error(errorMessage);
    }

    const data = await response.json();

    try {
      const validatedData = ApiResponseSchema.parse(data);

      return validatedData.data || [];
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error.errors);

        throw new Error("API Response validation failed: " + error.message);
      }

      throw error;
    }
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);

    return [];
  }
}

const Schema = z.object({
  id: z.number(),
  status: z.number(),
  slug: z.string(),
  destination: z
    .object({
      name: z.string(),
      slug: z.string(),
    })
    .nullable()
    .optional(),
});

const ApiResponseSchema = z.object({
  data: z.array(Schema).nullable(),
});

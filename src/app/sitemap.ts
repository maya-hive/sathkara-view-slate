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
    "itinerary",
    "activity",
    "accommodation",
    "destination",
    "city",
  ];

  const moduleRoutePromises = modules.map(async (module) => {
    const items = await fetchModuleRoutes(module);
    return items.map((item: { slug: string }) => ({
      url: `${baseUrl}/${module}s/${item.slug}`,
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
      fields: ["id", "status", "slug"],
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
});

const ApiResponseSchema = z.object({
  data: z.array(Schema).nullable(),
});

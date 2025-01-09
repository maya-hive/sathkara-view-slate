import Image from "next/image";

export default async function Home() {
  const homeRes = await fetch(`${process.env.API_URL}/settings/page_home`, {
    cache: "no-store",
  });

  if (!homeRes.ok) {
    throw new Error("Failed to fetch");
  }

  const { data: homeData }: { data: PageHomeSettings } = await homeRes.json();

  let itineraryDetails: Itinerary[] = [];

  if (homeData.itinerary_items && homeData.itinerary_items.length > 0) {
    const itineraryRes = await fetch(
      `${process.env.API_URL}/modules/itinerary`
    );

    if (!itineraryRes.ok) {
      throw new Error("Failed to fetch");
    }

    const { data: itineraryData }: { data: Itinerary[] } =
      await itineraryRes.json();

    itineraryDetails = itineraryData.filter((item) =>
      homeData.itinerary_items?.includes(item.id.toString())
    );
  }

  return (
    <article>
      <section className="relative h-[400px]">
        <div className="aboslute top-0 left-0 flex flex-col justify-center h-full">
          {homeData.banner_image && (
            <Image
              className="absolute w-full h-full object-cover -z-10"
              src={homeData.banner_image}
              alt={"Banner image"}
              width={500}
              height={100}
            />
          )}
          <div className="text-center text-white">
            {homeData.banner_content && (
              <span
                dangerouslySetInnerHTML={{ __html: homeData.banner_content }}
              />
            )}
          </div>
        </div>
      </section>
      <section className="mt-8 p-8">
        <div className="container mx-auto">
          {homeData.itinerary_content && (
            <span
              dangerouslySetInnerHTML={{ __html: homeData.itinerary_content }}
            />
          )}
          <div className="mt-4 grid grid-cols-4 gap-5">
            {itineraryDetails?.map((itinerary) => (
              <li key={itinerary.id} className="border rounded p-4 list-none">
                <Image
                  className="rounded w-full h-[200px] object-cover"
                  src={itinerary.featured_image}
                  alt={"Featured image"}
                  width={500}
                  height={100}
                />
                <h2 className="font-semibold mt-2">{itinerary.name}</h2>
                <p>{itinerary.short_description}</p>
                <p>Price: {itinerary.price}</p>
              </li>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}

interface PageHomeSettings {
  banner_content?: string;
  banner_image?: string;
  itinerary_content?: string;
  itinerary_items?: Array<string>;
}

interface Itinerary {
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
}

import { ItineraryCard } from "./Card";

interface Props {
  items?: string[] | null;
  title?: string | null;
  content?: TrustedHTML | null;
}

export const ItinerarySection = async ({ items, title, content }: Props) => {
  if (!items) {
    return null;
  }

  return (
    <section>
      <div className="container mx-auto py-12">
        <h2 className="text-center text-2xl font-semibold">{title}</h2>
        {content && <span dangerouslySetInnerHTML={{ __html: content }} />}
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items?.map((itinerary, idx: number) => (
            <ItineraryCard key={idx} slug={itinerary} />
          ))}
        </div>
      </div>
    </section>
  );
};

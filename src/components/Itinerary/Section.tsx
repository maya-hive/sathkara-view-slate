import { ItineraryCard } from "./Card";

interface Props {
  content?: TrustedHTML | null;
  items?: string[] | null;
}

export const ItinerarySection = async ({ items, content }: Props) => {
  if (!items) {
    return null;
  }

  return (
    <section>
      <div className="container mx-auto py-12">
        <div className="text-center text-2xl font-semibold">
          {content && <span dangerouslySetInnerHTML={{ __html: content }} />}
        </div>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items?.map((itinerary, idx: number) => (
            <ItineraryCard key={idx} slug={itinerary} />
          ))}
        </div>
      </div>
    </section>
  );
};

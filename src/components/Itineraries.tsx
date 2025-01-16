import ItineraryGrid from "./Itinerary/ItineraryGrid";

interface Props {
  content?: string;
  items?: Array<string>;
}

export default async function Itineraries({ content, items }: Props) {
  return (
    <section className="mt-8 p-8">
      <div className="container mx-auto">
        {content && <span dangerouslySetInnerHTML={{ __html: content }} />}
        {items && <ItineraryGrid items={items} />}
      </div>
    </section>
  );
}

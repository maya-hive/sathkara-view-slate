import { ItineraryCard } from "./ItineraryCard";

interface Props {
  items: Array<string>;
}

export default async function ItineraryGrid({ items }: Props) {
  return (
    <div className="mt-4 grid grid-cols-4 gap-5">
      {items?.map((itinerary) => (
        <ItineraryCard key={itinerary} slug={itinerary} />
      ))}
    </div>
  );
}

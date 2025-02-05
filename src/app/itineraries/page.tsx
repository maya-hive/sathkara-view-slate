import { fetchData, ItineraryPageLayout } from "./page/[id]/page";

export default async function ItinearyIndex() {
  const data = await fetchData("1");

  if (!data) {
    return null;
  }

  return <ItineraryPageLayout {...data} />;
}

import { Suspense } from "react";

import { ItienrarySearchAudiences as Audiences } from "@/components/Itinerary/Search/Audiences/Field";
import { ItienrarySearchCategories as Categories } from "@/components/Itinerary/Search/Categories/Field";
import { ItienrarySearchDestination as Destination } from "@/components/Itinerary/Search/Destination/Field";
import { ItienrarySearchDuration as Duration } from "@/components/Itinerary/Search/Duration/Field";
import { ItineraryListingAsideClient as FormClient } from "./Aside.client";
import { Skeleton } from "@/components/ui/skeleton";

export const ItineraryListingAside = () => (
  <aside>
    <Suspense
      fallback={<Skeleton className="h-[300px] rounded-md bg-slate-100" />}
    >
      <FormClient>
        <>
          <div>
            <Categories className="bg-white border" />
          </div>
          <div>
            <Duration className="bg-white border" />
          </div>
          <div>
            <Destination className="bg-white border" />
          </div>
          <div>
            <Audiences className="bg-white border" />
          </div>
        </>
      </FormClient>
    </Suspense>
  </aside>
);

import { Suspense } from "react";

import { ItienrarySearchAudiences as Audiences } from "@/components/Itinerary/Search/Audiences/Field";
import { ItienrarySearchCategories as Categories } from "@/components/Itinerary/Search/Categories/Field";
import { ItienrarySearchCountry as Country } from "@/components/Itinerary/Search/Country/Field";
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
            <Country className="bg-white border" />
          </div>
          <div>
            <Audiences className="bg-white border" />
          </div>
        </>
      </FormClient>
    </Suspense>
  </aside>
);

import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { DestinationListingAsideClient as FormClient } from "@/components/Destination/Listing/Aside.client";
import { DestinationSearchCountry as Country } from "@/components/Destination/Search/Country/Field";

export const DestinationListingAside = () => (
  <aside>
    <Suspense
      fallback={<Skeleton className="h-[300px] rounded-md bg-slate-100" />}
    >
      <FormClient>
        <>
          <div>
            <Country className="bg-white border" />
          </div>
        </>
      </FormClient>
    </Suspense>
  </aside>
);

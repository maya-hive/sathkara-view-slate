import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { CityListingAsideClient as FormClient } from "@/components/City/Listing/Aside.client";
import { CitySearchDestination as Destination } from "@/components/City/Search/Destination/Field";

export const CityListingAside = () => (
  <aside>
    <Suspense
      fallback={<Skeleton className="h-[300px] rounded-md bg-slate-100" />}
    >
      <FormClient>
        <>
          <div>
            <Destination className="bg-white border" />
          </div>
        </>
      </FormClient>
    </Suspense>
  </aside>
);

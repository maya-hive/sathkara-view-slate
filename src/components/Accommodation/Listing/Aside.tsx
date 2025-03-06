import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { AccommodationListingAsideClient as FormClient } from "@/components/Accommodation/Listing/Aside.client";
import { AccommodationSearchCategories as Categories } from "@/components/Accommodation/Search/Categories/Field";
import { AccommodationSearchDestination as Destination } from "@/components/Accommodation/Search/Destination/Field";

export const AccommodationListingAside = () => (
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
            <Destination className="bg-white border" />
          </div>
        </>
      </FormClient>
    </Suspense>
  </aside>
);

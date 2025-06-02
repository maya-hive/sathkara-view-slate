import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { AccommodationListingAsideClient as FormClient } from "@/components/Accommodation/Listing/Aside.client";
import { AccommodationSearchCategories as Categories } from "@/components/Accommodation/Search/Categories/Field";
import { AccommodationSearchCountry as Country } from "@/components/Accommodation/Search/Country/Field";

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
            <Country className="bg-white border" />
          </div>
        </>
      </FormClient>
    </Suspense>
  </aside>
);

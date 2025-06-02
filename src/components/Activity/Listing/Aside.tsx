import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { ActivityListingAsideClient as FormClient } from "@/components/Activity/Listing/Aside.client";
import { ActivitySearchCategories as Categories } from "@/components/Activity/Search/Categories/Field";
import { ActivitySearchCountry as Country } from "@/components/Activity/Search/Country/Field";

export const ActivityListingAside = () => (
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

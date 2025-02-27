import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CityCompactCard } from "./CompactCard";

interface Props {
  destination: string;
  cities?: City[] | null;
}

type City = {
  slug: string;
  name: string;
};

export const CityList = ({ cities, destination }: Props) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Available Cities</h3>
      <div className="grid xl:grid-cols-4 gap-3 xl:gap-2">
        {cities?.slice(0, 8).map(({ slug }, idx) => (
          <CityCompactCard key={idx} slug={slug} />
        ))}
      </div>
      {cities && cities.length > 8 && (
        <div className="mt-4 text-center">
          <Link
            href={`/${destination}/cities`}
            className="text-blue-500 hover:underline"
          >
            <Button variant="ghost">View All Cities</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

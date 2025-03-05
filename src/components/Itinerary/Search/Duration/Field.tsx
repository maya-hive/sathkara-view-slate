import { ItinerarySearchDurationClient as Client } from "./Field.client";

interface Props {
  className?: string;
  label?: boolean;
}

export const ItienrarySearchDuration = async (props: Props) => {
  const options = Array.from({ length: 24 }, (_, idx) => ({
    value: (idx + 1).toString(),
    label: `${idx + 1} Day(s)`,
  }));

  return <Client options={options} {...props} />;
};

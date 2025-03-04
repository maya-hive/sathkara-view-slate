import { ItinerarySearchDurationClient as Client } from "./Field.client";

interface Props {
  className?: string;
  label?: boolean;
}

export const ItienrarySearchDuration = async (props: Props) => {
  const options = [
    {
      value: "0-3",
      label: "3 Days or Less",
    },
    {
      value: "4-6",
      label: "4 to 6 Days",
    },
    {
      value: "6-9",
      label: "6 to 9 Days",
    },
    {
      value: "9-12",
      label: "9 to 12 Days",
    },
    {
      value: "12-15",
      label: "12 to 15 Days",
    },
    {
      value: "15-18",
      label: "15 to 18 Days",
    },
    {
      value: "18-21",
      label: "18 to 21 Days",
    },
    {
      value: "21-24",
      label: "21 to 24 Days",
    },
    {
      value: "24+",
      label: "More than 24 Days",
    },
  ];

  return <Client options={options} {...props} />;
};

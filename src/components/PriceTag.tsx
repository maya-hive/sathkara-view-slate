import { ComponentPropsWithoutRef } from "react";

interface Props extends ComponentPropsWithoutRef<"span"> {
  amount?: string | null;
}

export const PriceTag = ({ amount, ...props }: Props) => {
  if (!amount) return null;

  const price = numberFormat(parseFloat(amount));

  return (
    <span {...props}>
      {currencySymbol} {price}
    </span>
  );
};

export const currencySymbol = "$";

const numberFormat = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "decimal",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

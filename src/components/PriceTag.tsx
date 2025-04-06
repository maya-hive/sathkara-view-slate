import { ComponentPropsWithoutRef } from "react";

interface Props extends ComponentPropsWithoutRef<"span"> {
  amount?: string | null;
  cents?: "show" | "hide";
}

export const PriceTag = ({ amount, cents = "hide", ...props }: Props) => {
  if (!amount) return null;

  const price = numberFormat(parseFloat(amount), cents);

  return (
    <span {...props}>
      {currencySymbol} {price}
    </span>
  );
};

export const currencySymbol = "$";

const numberFormat = (amount: number, cents: "show" | "hide") =>
  new Intl.NumberFormat("en-US", {
    style: "decimal",
    currency: "USD",
    minimumFractionDigits: cents === "show" ? 2 : 0,
    maximumFractionDigits: cents === "show" ? 2 : 0,
  }).format(amount);

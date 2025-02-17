import { ComponentPropsWithoutRef } from "react";

interface Props extends ComponentPropsWithoutRef<"span"> {
  amount?: string | null;
}

export const PriceTag = ({ amount, ...props }: Props) => {
  if (!amount) return null;

  const price = formatCurrency(parseFloat(amount));

  return <span {...props}>{price}</span>;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

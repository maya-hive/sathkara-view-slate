import { ComponentPropsWithoutRef } from "react";

interface Props extends ComponentPropsWithoutRef<"span"> {
  amount?: string | null;
}

export const PriceTag = ({ amount, ...props }: Props) => (
  <span {...props}>$ {amount?.replace(".00", "")}</span>
);

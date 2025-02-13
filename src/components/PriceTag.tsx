interface Props {
  amount?: string | null;
}

export const PriceTag = ({ amount }: Props) => (
  <>$ {amount?.replace(".00", "")}</>
);

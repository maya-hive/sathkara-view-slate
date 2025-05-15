import { Badge } from "@/components/ui/badge";

interface Props {
  status: number;
}

export const InvoicePaymentStatusBadge = ({ status }: Props) => {
  switch (status) {
    case 3:
      return <Badge className="bg-red-500">Payment Declined</Badge>;
    case 1:
      return <Badge className="bg-green-500">Paid</Badge>;
    case 0:
      return <Badge className="bg-gray-200 text-black">Payment Pending</Badge>;
    default:
      return <Badge className="bg-gray-500">Unknown</Badge>;
  }
};

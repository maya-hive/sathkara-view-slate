import { Calendar, CreditCard, Download } from "lucide-react";
import Link from "next/link";

import { PriceTag } from "@/components/PriceTag";
import { InvoicePaymentStatusBadge } from "@/components/Invoice/PaymentStatusBadge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PayHereForm } from "@/components/Checkout/PayHereForm";

type Props = {
  invoice: Invoice;
  customer: Customer;
  encodedId: string;
};

type Invoice = {
  id: number;
  number: string;
  date: string;
  due_date: string;
  amount: string;
  payment_status: number;
  download_link: string;
};

type Customer = {
  id: number;
  status: number;
  name: string;
  email: string;
  phone: string;
  address: string;
};

export const InvoiceCard = ({ invoice, customer, encodedId }: Props) => (
  <Card className="overflow-hidden">
    <CardContent className="p-4">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold">{invoice.number}</h2>
        <InvoicePaymentStatusBadge status={invoice.payment_status} />
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-md">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-muted-foreground mr-1">Date:</span>
          <span>{invoice.date}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-muted-foreground mr-1">Due:</span>
          <span>{invoice.due_date}</span>
        </div>
      </div>
    </CardContent>

    <CardContent className="p-0 border-t pb-2">
      <div className="px-4 py-2">
        <div className="mt-2 flex justify-between items-center">
          <div>Invoice Amount</div>
          <div className="text-lg font-semibold ml-2">
            <PriceTag amount={invoice.amount} cents="show" />
          </div>
        </div>
      </div>
    </CardContent>

    <CardFooter className="border-t pb-4 bg-slate-50 px-4">
      <div className="mt-4 w-full flex justify-end space-x-2">
        <Link
          href={invoice.download_link}
          className="rounded w-fit flex items-center justify-center bg-white border text-secondary px-10 py-2 text-center text-md font-semibold uppercase"
        >
          <Download className="h-4 w-4 mr-1" />
          Download
        </Link>
        <PayHereForm
          encodedId={encodedId}
          reference={invoice.number}
          amount={parseFloat(invoice.amount)}
          customer={customer}
        >
          {invoice.payment_status !== 1 && (
            <Button className="rounded w-fit flex items-center justify-center bg-yellow-400 text-yellow-800 px-10 py-2 text-center text-md font-semibold uppercase">
              <CreditCard className="h-4 w-4 mr-1" />
              Pay Now
            </Button>
          )}
        </PayHereForm>
      </div>
    </CardFooter>
  </Card>
);

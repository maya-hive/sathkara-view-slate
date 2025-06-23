import crypto from "crypto";
interface Props {
  encodedId: string;
  reference: string;
  amount: number;
  customer: Customer;
  children?: React.ReactNode | null;
}

type Customer = {
  id: number;
  status: number;
  name: string;
  email: string;
  phone: string;
  address: string;
};

export const PayHereForm = ({
  encodedId,
  reference,
  amount,
  customer,
  children,
}: Props) => {
  const checkoutId = process.env.CHECKOUT_API_ID ?? "";
  const checkoutSecret = process.env.CHECKOUT_API_SECRET ?? "";
  const currency = process.env.CHECKOUT_API_CURRENCY ?? "";

  const hash = generateHash({
    checkoutSecret,
    checkoutId,
    reference,
    amount,
    currency,
  });

  const checkoutUrl = process.env.CHECKOUT_API_URL;
  const callbackUrl = `${process.env.API_URL}/payments/payhere/notification`;
  const checkoutPageUrl = `${process.env.BASE_URL}/orders/checkout/${encodedId}`;

  if (!checkoutUrl) {
    return;
  }

  return (
    <form method="POST" action={checkoutUrl} className="text-center">
      <input type="hidden" name="merchant_id" value={checkoutId} />
      <input type="hidden" name="return_url" value={checkoutPageUrl} />
      <input type="hidden" name="cancel_url" value={checkoutPageUrl} />
      <input type="hidden" name="notify_url" value={callbackUrl} />

      <input type="hidden" name="order_id" value={reference} />
      <input type="hidden" name="items" value="Door bell wireless" />
      <input type="hidden" name="currency" value={currency} />
      <input type="hidden" name="amount" value={amount.toFixed(0)} />

      <input type="hidden" name="first_name" value={customer.name} />
      <input type="hidden" name="last_name" value={customer.name} />
      <input type="hidden" name="email" value={customer.email} />
      <input type="hidden" name="phone" value={customer.phone} />
      <input type="hidden" name="address" value={customer.address} />
      <input type="hidden" name="city" value={customer.address} />
      <input type="hidden" name="country" value={customer.address} />
      <input type="hidden" name="hash" value={hash} />

      {children}
    </form>
  );
};

function generateHash({
  checkoutSecret,
  checkoutId,
  reference,
  amount,
  currency,
}: {
  checkoutSecret: string;
  checkoutId: string;
  reference: string;
  amount: number;
  currency: string;
}): string {
  const hashedSecret = crypto
    .createHash("md5")
    .update(checkoutSecret)
    .digest("hex")
    .toUpperCase();

  const amountFormatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    useGrouping: false,
  });

  const raw =
    checkoutId + reference + amountFormatted + currency + hashedSecret;
  const hash = crypto.createHash("md5").update(raw).digest("hex").toUpperCase();

  return hash;
}

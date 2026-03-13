"use client";

interface PaystackOptions {
  email: string;
  amountNgn: number;       // in Naira — we convert to kobo here
  reference: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}

// Initialise and open the Paystack inline payment modal
export function openPaystackModal({
  email,
  amountNgn,
  reference,
  onSuccess,
  onClose,
}: PaystackOptions) {
  // Paystack expects amount in kobo (1 NGN = 100 kobo)
  const amountKobo = Math.round(amountNgn * 100);

  const handler = (window as any).PaystackPop.setup({
    key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    email,
    amount: amountKobo,
    currency: "NGN",
    ref: reference,
    callback: (response: { reference: string }) => {
      onSuccess(response.reference);
    },
    onClose,
  });

  handler.openIframe();
}

// Generate a unique payment reference
export function generateReference(): string {
  return `KS-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

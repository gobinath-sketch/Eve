declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function openRazorpayCheckout(options: {
  key: string;
  amount: number;
  orderId: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  onSuccess: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  onDismiss: () => void;
}) {
  const loaded = await loadRazorpay();
  if (!loaded) throw new Error('Failed to load Razorpay');

  const rzp = new window.Razorpay({
    key: options.key,
    amount: options.amount,
    currency: 'INR',
    name: options.name,
    description: options.description,
    order_id: options.orderId,
    prefill: { name: options.name, email: options.email, contact: options.phone },
    theme: { color: '#000000' },
    handler: options.onSuccess,
    modal: { ondismiss: options.onDismiss },
  });
  rzp.open();
}

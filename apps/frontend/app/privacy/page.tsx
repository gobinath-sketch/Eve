import PageShell from '@/components/layout/PageShell';
import { SITE_NAME, CONTACT } from '@/lib/constants';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy',
  description: `Privacy Policy for the ${SITE_NAME} one-day offline AI event.`,
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <section className="py-16 px-6 md:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="section-label mb-4">LEGAL</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">Privacy Policy</h1>
          <p className="text-white/40 text-sm mb-10">Last updated: June 2026</p>

          <div className="space-y-5">
            {[
              {
                title: 'Information We Collect',
                text: `When you register for the ${SITE_NAME} event, we collect personal information including your name, email address, phone number, educational background, and professional details. This information is used solely for event administration.`,
              },
              {
                title: 'How We Use Your Information',
                text: 'Your information is used to process your registration, send event confirmations and updates, manage event logistics, and communicate important information about the event before, during, and after.',
              },
              {
                title: 'Payment Information',
                text: 'Payment processing is handled securely by Razorpay. We do not store your credit/debit card details on our servers. All payment data is encrypted and processed in compliance with PCI-DSS standards.',
              },
              {
                title: 'Data Sharing',
                text: 'We do not sell, trade, or rent your personal information to third parties. Your data may be shared with our payment processor (Razorpay) and email service provider solely for event-related communications.',
              },
              {
                title: 'Data Security',
                text: 'We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.',
              },
              {
                title: 'Your Rights',
                text: `You have the right to access, correct, or delete your personal information at any time. To exercise these rights, contact us at ${CONTACT.email}.`,
              },
              {
                title: 'Photos & Media',
                text: `By attending the ${SITE_NAME} event, you consent to being photographed or recorded during the event. These photos or recordings may be used for promotional purposes.`,
              },
              {
                title: 'Contact',
                text: `For any privacy-related questions or concerns, please contact us at ${CONTACT.email} or call +91 ${CONTACT.phone}.`,
              },
            ].map((item) => (
              <div key={item.title} className="glass-card p-5 rounded-lg">
                <h3 className="text-sm font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/terms" className="btn-outline-brand text-sm">Terms & Conditions</Link>
            <Link href="/refund" className="btn-secondary text-sm">Refund Policy</Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

import PageShell from '@/components/layout/PageShell';
import { SITE_NAME, REGISTRATION_FEE, CONTACT } from '@/lib/constants';
import Link from 'next/link';

export const metadata = {
  title: 'Refund Policy',
  description: `Refund Policy for the ${SITE_NAME} one-day offline AI event.`,
};

export default function RefundPage() {
  return (
    <PageShell>
      <section className="py-16 px-6 md:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="section-label mb-4">LEGAL</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">Refund Policy</h1>
          <p className="text-white/40 text-sm mb-10">Last updated: June 2026</p>

          <div className="space-y-5">
            <div className="glass-card p-6 rounded-lg border border-white/8">
              <h2 className="font-serif text-xl text-white mb-3">
                Registration Fee: ₹{REGISTRATION_FEE}
              </h2>
              <p className="text-sm text-white/60 leading-relaxed">
                Once your payment of ₹{REGISTRATION_FEE} is successfully processed and your registration
                is confirmed for the {SITE_NAME} event, the registration fee is strictly non-refundable
                under any circumstances.
              </p>
            </div>

            {[
              {
                title: 'No Refunds After Registration',
                text: 'All sales are final. We do not offer refunds after a successful registration and payment. Please review all event details, date, and venue information carefully before completing registration.',
              },
              {
                title: 'Event Cancellation by Organizers',
                text: `If the ${SITE_NAME} event is cancelled by the organizers due to unforeseen circumstances, all registered participants will receive a full refund of ₹${REGISTRATION_FEE} within 7–10 business days.`,
              },
              {
                title: 'Event Postponement',
                text: 'If the event is postponed, your registration will be automatically transferred to the new date. If you cannot attend the new date, you may request a refund within 48 hours of the postponement announcement.',
              },
              {
                title: 'Transfer of Registration',
                text: `You may transfer your registration to another person before the event date by contacting us at ${CONTACT.email}. Transfers are subject to approval and must be completed at least 24 hours before the event.`,
              },
              {
                title: 'How to Contact Us',
                text: `For any refund-related queries, contact us at ${CONTACT.email} or call +91 ${CONTACT.phone}. Refund requests are processed within 5–7 business days where applicable.`,
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
            <Link href="/privacy" className="btn-secondary text-sm">Privacy Policy</Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

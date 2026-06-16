import PageShell from '@/components/layout/PageShell';
import { SITE_NAME, REGISTRATION_FEE, CONTACT } from '@/lib/constants';
import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions',
  description: `Terms and Conditions for registering at the ${SITE_NAME} one-day offline AI event.`,
};

export default function TermsPage() {
  return (
    <PageShell>
      <section className="py-16 px-6 md:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="section-label mb-4">LEGAL</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">Terms &amp; Conditions</h1>
          <p className="text-white/40 text-sm mb-10">Last updated: June 2026</p>

          <div className="space-y-6">
            {[
              {
                title: '1. Registration & Payment',
                text: `By registering for the ${SITE_NAME} event, you agree to pay the registration fee of ₹${REGISTRATION_FEE}. This fee is non-negotiable and no discounts or promo codes apply unless explicitly stated.`,
              },
              {
                title: '2. Accurate Information',
                text: 'You must provide accurate and complete information during registration. False or incomplete information may result in your registration being cancelled without refund.',
              },
              {
                title: '3. Event Entry',
                text: 'Event entry is subject to successful payment and a valid registration confirmation. Please carry your event pass (digital or printed) to the venue.',
              },
              {
                title: '4. Agenda & Changes',
                text: 'The organizers reserve the right to modify the agenda, sessions, or venue with prior notice. In the event of significant changes, registered participants will be notified via email.',
              },
              {
                title: '5. Conduct',
                text: 'Participants must conduct themselves professionally and respectfully at the physical event venue. The organizers reserve the right to remove any participant engaging in disruptive behaviour.',
              },
              {
                title: '6. Recording Policy',
                text: 'Recording or distributing event content (video, audio, presentations) without explicit written permission from the organizers is strictly prohibited.',
              },
              {
                title: '7. Liability',
                text: 'The organizers are not liable for personal belongings lost or damaged at the venue. Participants attend at their own risk. The organizers are not responsible for travel or accommodation expenses.',
              },
              {
                title: '8. Contact',
                text: `For any questions regarding these terms, contact us at ${CONTACT.email} or call +91 ${CONTACT.phone}.`,
              },
            ].map((item) => (
              <div key={item.title} className="glass-card p-5 rounded-lg">
                <h3 className="text-sm font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/refund" className="btn-outline-brand text-sm">Refund Policy</Link>
            <Link href="/privacy" className="btn-secondary text-sm">Privacy Policy</Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

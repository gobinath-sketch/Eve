'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PageShell from '@/components/layout/PageShell';
import { SITE_NAME, REGISTRATION_FEE } from '@/lib/constants';
import { getRegistration } from '@/lib/api';
import { generateEventPassImage, downloadBlob } from '@/lib/generate-event-pass';
import Link from 'next/link';

interface RegData {
  fullName: string;
  registrationId: string;
  email: string;
  createdAt: string;
  payments?: { razorpayPaymentId: string; razorpayOrderId: string }[];
  eventPass?: { passCode: string; qrData: string };
}

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [data, setData] = useState<RegData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  const loadRegistration = async () => {
    if (!id) {
      setError('No registration ID provided.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await getRegistration(id);
      setData(result);
    } catch {
      setError('Could not load registration details. Make sure the backend is running on port 4000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistration();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const downloadPass = async () => {
    if (!data) return;
    setDownloading(true);
    try {
      const payment = data.payments?.[0];
      const blob = await generateEventPassImage({
        fullName: data.fullName,
        registrationId: data.registrationId,
        email: data.email,
        paymentId: payment?.razorpayPaymentId || 'N/A',
        transactionId: payment?.razorpayOrderId || 'N/A',
        amount: REGISTRATION_FEE,
        date: new Date(data.createdAt).toLocaleDateString('en-IN'),
        eventName: SITE_NAME,
        qrDataUrl: data.eventPass?.qrData,
      });
      downloadBlob(blob, `event-pass-${data.registrationId}.png`);
    } catch {
      alert('Failed to generate pass. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <PageShell>
        <section className="py-20 px-6">
          <div className="mx-auto max-w-lg text-center">
            <div className="w-12 h-12 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/50 text-sm">Loading your registration details...</p>
          </div>
        </section>
      </PageShell>
    );
  }

  if (error || !data) {
    return (
      <PageShell>
        <section className="py-20 px-6">
          <div className="mx-auto max-w-lg text-center">
            <div className="glass-card p-8 rounded-xl mb-6">
              <p className="text-red-400 text-sm mb-4">{error || 'Registration not found.'}</p>
              <button onClick={loadRegistration} className="btn-primary text-sm">
                Retry
              </button>
              <p className="mt-4 text-xs text-white/30">
                Ensure backend is running: <code className="text-white/50">cd backend &amp;&amp; npm run start:dev</code>
              </p>
            </div>
          </div>
        </section>
      </PageShell>
    );
  }

  const payment = data.payments?.[0];

  return (
    <PageShell>
      <section className="py-12 px-4 md:px-6">
        <div className="mx-auto max-w-xl">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand/10 border border-brand/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-brand font-serif text-2xl font-bold">ok</span>
            </div>
            <div className="tag-brand mb-3 inline-flex">Registration Successful</div>
            <h1 className="font-serif text-3xl md:text-4xl text-white mb-2">
              You&apos;re In, {data.fullName.split(' ')[0]}!
            </h1>
            <p className="text-white/50 text-sm">
              You&apos;re registered for {SITE_NAME}. Check your email for confirmation details.
            </p>
          </div>

          {/* Event Pass Card */}
          <div className="glass-card rounded-xl overflow-hidden mb-5">
            {/* Pass Header */}
            <div className="bg-gradient-to-r from-brand/15 to-brand/5 border-b border-white/8 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-brand/70 mb-1">Event Pass</p>
                  <h2 className="font-serif text-xl text-white">{SITE_NAME}</h2>
                  <p className="text-xs text-white/40 mt-0.5">One-Day Offline AI Event 2026</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/40 mb-1">Amount Paid</p>
                  <p className="font-outfit text-2xl font-bold text-brand">₹{REGISTRATION_FEE}</p>
                </div>
              </div>
            </div>

            {/* Pass Details */}
            <div className="p-5">
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: 'Name', value: data.fullName },
                  { label: 'Email', value: data.email },
                  { label: 'Registration ID', value: data.registrationId },
                  { label: 'Date Registered', value: new Date(data.createdAt).toLocaleDateString('en-IN') },
                  { label: 'Payment ID', value: payment?.razorpayPaymentId || 'N/A' },
                  { label: 'Transaction ID', value: payment?.razorpayOrderId || 'N/A' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white/3 border border-white/6 rounded-lg p-3">
                    <p className="text-[10px] text-white/35 mb-0.5 uppercase tracking-wide">{label}</p>
                    <p className="text-xs text-white/80 font-medium truncate">{value}</p>
                  </div>
                ))}
              </div>

              {/* QR Code */}
              {data.eventPass?.qrData && (
                <div className="flex justify-center mb-5">
                  <div className="bg-white p-3 rounded-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={data.eventPass.qrData} alt="Event QR Code" className="w-28 h-28" />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={downloadPass}
                  disabled={downloading}
                  className="btn-primary w-full justify-center"
                  id="download-pass-btn"
                >
                  {downloading ? 'Generating Pass...' : 'Download Event Pass'}
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: `I registered for ${SITE_NAME}!`, text: `Just registered for ${SITE_NAME} — a one-day AI event. Join me!` });
                    }
                  }}
                  className="btn-secondary w-full justify-center text-sm"
                  id="share-btn"
                >
                  Share with Friends
                </button>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="glass-card p-5 rounded-xl mb-5">
            <h3 className="text-sm font-semibold text-white mb-4">What happens next?</h3>
            <div className="space-y-3">
              {[
                { step: '1', text: 'Check your email for a confirmation from us.' },
                { step: '2', text: 'Venue details will be shared 7 days before the event.' },
                { step: '3', text: 'Bring your laptop, charger, and curiosity on the event day.' },
                { step: '4', text: 'Walk in, build AI tools, and transform your career!' },
              ].map(({ step, text }) => (
                <div key={step} className="flex items-center gap-3 text-sm text-white/60">
                  <div className="w-6 h-6 rounded-full bg-brand/15 border border-brand/25 flex items-center justify-center flex-shrink-0">
                    <span className="text-brand text-xs font-bold font-outfit">{step}</span>
                  </div>
                  {text}
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-white/30">
            A confirmation email has been sent to{' '}
            <span className="text-white/50">{data.email}</span>
          </p>

          <div className="mt-6 text-center">
            <Link href="/" className="btn-secondary text-sm px-6">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

'use client';

import PageShell from '@/components/layout/PageShell';
import { CONTACT } from '@/lib/constants';
import { submitContact } from '@/lib/api';
import { useState } from 'react';
import { Mail, Phone, ExternalLink, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await submitContact(form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <PageShell>
      <section className="py-16 px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="section-label mb-4">GET IN TOUCH</p>
          <h1 className="font-serif text-4xl md:text-6xl text-white mb-5">Contact Us</h1>
          <p className="text-white/55 text-sm md:text-base max-w-xl mb-12">
            Have a question about the event? We&apos;re happy to help. Reach out via the form or directly through any of the channels below.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Form */}
            <div className="glass-card p-6 md:p-8 rounded-xl">
              <h2 className="font-serif text-xl text-white mb-6">Send us a message</h2>
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <CheckCircle size={48} className="text-brand mb-4" />
                  <h3 className="text-white font-semibold text-lg mb-2">Message Sent!</h3>
                  <p className="text-white/55 text-sm">We&apos;ll get back to you within 24 hours.</p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="btn-secondary mt-6 text-sm"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5">Your Name *</label>
                      <input
                        placeholder="John Doe"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        id="contact-name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5">Email *</label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        id="contact-email"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Subject *</label>
                    <input
                      placeholder="What is your question about?"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      id="contact-subject"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Message *</label>
                    <textarea
                      placeholder="Tell us more..."
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      id="contact-message"
                    />
                  </div>
                  {status === 'error' && (
                    <p className="text-xs text-red-400">Failed to send. Please try again or email us directly.</p>
                  )}
                  <button
                    type="submit"
                    className="btn-primary w-full justify-center"
                    disabled={status === 'loading'}
                    id="contact-submit"
                  >
                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-xl text-white mb-5">Direct Contact</h2>
                <div className="space-y-4">
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="flex items-center gap-4 glass-card p-4 rounded-lg group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0">
                      <Mail size={18} className="text-brand" />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 mb-0.5">Email</p>
                      <p className="text-sm font-medium text-white group-hover:text-brand transition-colors">
                        {CONTACT.email}
                      </p>
                    </div>
                  </a>
                  <a
                    href={`tel:${CONTACT.phone}`}
                    className="flex items-center gap-4 glass-card p-4 rounded-lg group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0">
                      <Phone size={18} className="text-brand" />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 mb-0.5">Phone</p>
                      <p className="text-sm font-medium text-white group-hover:text-brand transition-colors">
                        +91 {CONTACT.phone}
                      </p>
                    </div>
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Find us on</h3>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={CONTACT.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline-brand flex items-center gap-2 text-sm"
                    aria-label="LinkedIn"
                  >
                    <ExternalLink size={14} /> LinkedIn
                  </a>
                  <a
                    href={CONTACT.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex items-center gap-2 text-sm"
                    aria-label="GitHub"
                  >
                    <ExternalLink size={14} /> GitHub
                  </a>
                  <a
                    href={CONTACT.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex items-center gap-2 text-sm"
                    aria-label="Twitter"
                  >
                    <ExternalLink size={14} /> Twitter / X
                  </a>
                </div>
              </div>

              <div className="glass-card p-5 rounded-lg">
                <p className="text-sm font-semibold text-white mb-1.5">Response Time</p>
                <p className="text-xs text-white/50 leading-relaxed">
                  We typically respond within 24 hours. For urgent queries about the event, please call or WhatsApp us directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

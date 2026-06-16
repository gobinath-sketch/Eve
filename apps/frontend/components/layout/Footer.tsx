'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { SITE_NAME, CONTACT } from '@/lib/constants';

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const id = href.slice(1);
      if (pathname === '/') {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        router.push(`/${href}`);
      }
    }
  };
  return (
    <footer className="bg-[#000000] border-t border-white/8 mt-0">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        {/* Main Grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <a href="#hero" onClick={(e) => handleAnchor(e, '#hero')} className="font-serif text-xl text-white font-semibold tracking-tight hover:opacity-80 transition-opacity">
              {SITE_NAME}
            </a>
            <p className="mt-3 text-xs text-white/38 leading-relaxed max-w-[200px]">
              One day. Real AI skills. Zero fluff. An offline event built for the builders of tomorrow.
            </p>
            <div className="mt-5 flex items-center gap-5">
              <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-white/38 hover:text-white transition-colors">LinkedIn</a>
              <a href={CONTACT.twitter} target="_blank" rel="noopener noreferrer" className="text-xs text-white/38 hover:text-white transition-colors">Twitter</a>
              <a href={CONTACT.github} target="_blank" rel="noopener noreferrer" className="text-xs text-white/38 hover:text-white transition-colors">GitHub</a>
            </div>
          </div>

          {/* Event */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/35 mb-4">Event</h4>
            <ul className="space-y-2.5">
              {[
                { href: '#about', label: 'About the Event' },
                { href: '#agenda', label: 'Event Agenda' },
                { href: '#speaker', label: 'Speaker' },
                { href: '/register', label: 'Register Now', external: true },
              ].map(l => (
                <li key={l.label}>
                  {l.external ? (
                    <Link href={l.href} className="text-sm text-white/45 hover:text-white transition-colors">{l.label}</Link>
                  ) : (
                    <a href={l.href} onClick={(e) => handleAnchor(e, l.href)} className="text-sm text-white/45 hover:text-white transition-colors">{l.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/35 mb-4">Learn</h4>
            <ul className="space-y-2.5">
              {['Vibe Coding', 'AI Agents', 'Prompt Engineering', 'AI App Dev', 'LLMs'].map(t => (
                <li key={t}>
                  <span className="text-sm text-white/40">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/35 mb-4">Company</h4>
            <ul className="space-y-2.5">
              {[
                { href: '#contact', label: 'Contact Us' },
                { href: '/privacy', label: 'Privacy Policy', external: true },
                { href: '/terms', label: 'Terms & Conditions', external: true },
                { href: '/refund', label: 'Refund Policy', external: true },
              ].map(l => (
                <li key={l.label}>
                  {l.external ? (
                    <Link href={l.href} className="text-sm text-white/45 hover:text-white transition-colors">{l.label}</Link>
                  ) : (
                    <a href={l.href} onClick={(e) => handleAnchor(e, l.href)} className="text-sm text-white/45 hover:text-white transition-colors">{l.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/28">© 2026 {SITE_NAME}. All rights reserved.</p>
          <a href={`mailto:${CONTACT.email}`} className="text-xs text-white/28 hover:text-white transition-colors">{CONTACT.email}</a>
        </div>
      </div>
    </footer>
  );
}

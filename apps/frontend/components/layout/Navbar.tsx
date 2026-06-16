'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

import { usePathname, useRouter } from 'next/navigation';
import { NAV_LINKS, SITE_NAME } from '@/lib/constants';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      // Update active section based on scroll position
      const sections = ['hero', 'about', 'agenda', 'speaker', 'testimonials', 'contact'];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      setOpen(false);
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-black/90 backdrop-blur-xl border-b border-white/8"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => handleAnchor(e, '#hero')}
          className="font-serif text-xl font-semibold text-white tracking-tight hover:opacity-80 transition-opacity"
        >
          {SITE_NAME}
        </a>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleAnchor(e, link.href)}
              className={`text-sm font-medium transition-colors duration-200 ${
                activeSection === link.href.slice(1)
                  ? 'text-white'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center">
          <Link href="/register" className="btn-primary text-sm px-5 py-2.5">
            Register — ₹199
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="text-white md:hidden p-1"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          id="mobile-menu-toggle"
        >
          <span className="text-sm font-medium">{open ? 'Close' : 'Menu'}</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-[rgba(10,11,7,0.98)] backdrop-blur-xl border-b border-white/8">
          <div className="mx-auto max-w-7xl px-6 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchor(e, link.href)}
                className="block py-2.5 text-sm font-medium text-white/55 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 pb-1">
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="btn-primary w-full justify-center text-sm"
              >
                Register — ₹199
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

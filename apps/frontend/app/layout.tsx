import type { Metadata } from 'next';
import './globals.css';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — One-Day Offline AI Event`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Code with Zen is a one-day hands-on offline AI event covering vibe coding, AI agents, prompt engineering, and AI application development. Register now for ₹199.',
  openGraph: {
    title: `${SITE_NAME} — One-Day Offline AI Event`,
    description: 'Master AI in one day. Vibe coding, agent building, AI apps. Register for ₹199.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — One-Day AI Event`,
    description: 'Register for our offline AI event. Learn AI tools, agents, and vibe coding in one day.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" data-scroll-behavior="smooth">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}

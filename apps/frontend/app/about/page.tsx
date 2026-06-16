import PageShell from '@/components/layout/PageShell';
import { SITE_NAME, TOPICS, REGISTRATION_FEE } from '@/lib/constants';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'About',
  description: `Learn about ${SITE_NAME} — a one-day hands-on offline AI event covering vibe coding, AI agents, prompt engineering, and more. Only ₹${REGISTRATION_FEE}.`,
};

export default function AboutPage() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="py-16 px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="section-label mb-4">ABOUT THE EVENT</p>
          <h1 className="font-serif text-4xl md:text-6xl text-white mb-5 max-w-3xl">
            What You Will Learn at {SITE_NAME}
          </h1>
          <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-2xl">
            {SITE_NAME} is a hands-on, one-day offline AI event designed for students, developers,
            engineers, founders, and anyone passionate about AI. Learn practical AI skills you can apply the very same day.
          </p>
        </div>
      </section>

      {/* Topics */}
      <section className="pb-16 px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="section-label mb-6">TOPICS COVERED</p>
          <div className="flex flex-wrap gap-2 mb-14">
            {TOPICS.map((topic) => (
              <span key={topic} className="topic-tag">
                {topic}
              </span>
            ))}
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
            {[
              {
                title: 'Hands-On Building',
                desc: 'Build real projects with AI tools during live sessions. You ship actual working products — not just complete exercises.',
                icon: '⚡',
              },
              {
                title: 'Expert-Led Learning',
                desc: 'Learn from Zenovate — an AI practitioner who builds AI products every day and brings real-world insights.',
                icon: '🎓',
              },
              {
                title: 'Network & Community',
                desc: 'Connect with developers, founders, and AI enthusiasts in an offline setting for genuine human connections.',
                icon: '🤝',
              },
            ].map((item) => (
              <div key={item.title} className="glass-card p-6 rounded-lg">
                <span className="text-3xl mb-4 block">{item.icon}</span>
                <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Who is this for */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">Who is this event for?</h2>
              <p className="text-white/55 text-sm leading-relaxed mb-5">
                Whether you are a student exploring AI for the first time, a developer looking to ship faster,
                a founder who wants to build AI products, or a professional aiming to future-proof their career —
                this event is for you.
              </p>
              <ul className="space-y-2.5">
                {[
                  'Students & recent graduates',
                  'Software developers & engineers',
                  'Founders & entrepreneurs',
                  'Marketing & business professionals',
                  'Freelancers & creators',
                  'Anyone curious about AI',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/70">
                    <CheckCircle size={15} className="text-brand flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-card p-8 rounded-lg">
              <div className="tag-brand mb-4 inline-flex">One-Day Event</div>
              <h3 className="font-serif text-2xl text-white mb-3">What you walk away with</h3>
              <ul className="space-y-3">
                {[
                  'Hands-on experience with 5+ AI tools',
                  'A working AI agent you built yourself',
                  'An AI-powered website or app you shipped',
                  'Your 30-day AI action plan',
                  'Certificate of completion',
                  'Access to the Code with Zen community',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/70">
                    <span className="text-brand text-base flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-white/8">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="font-outfit text-3xl font-bold text-white">₹{REGISTRATION_FEE}</span>
                  <span className="text-white/40 text-sm">only</span>
                </div>
                <Link href="/register" className="btn-primary w-full justify-center">
                  Register Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

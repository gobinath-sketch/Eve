import PageShell from '@/components/layout/PageShell';
import { SPEAKERS, CONTACT } from '@/lib/constants';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Speaker',
  description: 'Meet Zenovate, the AI Engineer and Founder presenting at the Code with Zen one-day offline AI event.',
};

export default function SpeakersPage() {
  const speaker = SPEAKERS[0];

  return (
    <PageShell>
      <section className="py-16 px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="section-label mb-4">YOUR GUIDE</p>
          <h1 className="font-serif text-4xl md:text-6xl text-white mb-12">
            Meet Your Speaker
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
            {/* Visual */}
            <div className="aspect-square max-w-md mx-auto md:mx-0">
              <div className="w-full h-full bg-[rgba(255,255,255,0.03)] border border-white/8 rounded-xl overflow-hidden flex items-center justify-center">
                <div className="text-center p-10">
                  <div className="w-32 h-32 rounded-full bg-brand/10 border-2 border-brand/30 flex items-center justify-center mx-auto mb-6">
                    <span className="text-brand text-5xl font-serif font-bold">
                      {speaker.name.charAt(0)}
                    </span>
                  </div>
                  <h2 className="font-serif text-4xl text-white">{speaker.name}</h2>
                  <p className="text-brand text-sm font-medium mt-2">{speaker.role}</p>
                  <p className="text-white/35 text-xs mt-2 leading-relaxed">{speaker.expertise}</p>
                  <div className="flex justify-center gap-3 mt-5">
                    <a href={speaker.linkedin} target="_blank" rel="noopener noreferrer"
                      className="text-white/40 hover:text-white transition-colors" aria-label="LinkedIn">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                        <circle cx="4" cy="4" r="2"/>
                      </svg>
                    </a>
                    {speaker.github && (
                      <a href={speaker.github} target="_blank" rel="noopener noreferrer"
                        className="text-white/40 hover:text-white transition-colors" aria-label="GitHub">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                        </svg>
                      </a>
                    )}
                    {speaker.twitter && (
                      <a href={speaker.twitter} target="_blank" rel="noopener noreferrer"
                        className="text-white/40 hover:text-white transition-colors" aria-label="Twitter">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Info */}
            <div>
              <div className="flex flex-wrap gap-2 mb-5">
                {speaker.tags.map(tag => (
                  <span key={tag} className="tag-brand">{tag}</span>
                ))}
              </div>
              <h2 className="font-serif text-3xl md:text-5xl text-white mb-2">{speaker.name}</h2>
              <p className="text-brand font-semibold text-base mb-5">{speaker.role}</p>
              <p className="text-white/60 text-sm leading-relaxed mb-6">{speaker.bio}</p>

              <div className="grid grid-cols-1 gap-3 mb-8">
                {[
                  'Expert in Agentic AI & Large Language Models',
                  'Founder building AI-powered developer tools',
                  'Educator with hands-on teaching approach',
                  'Practitioner who ships AI products daily',
                ].map(item => (
                  <div key={item} className="flex items-center gap-3 text-sm text-white/65">
                    <span className="text-brand text-sm">✦</span> {item}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a href={speaker.linkedin} target="_blank" rel="noopener noreferrer"
                  className="btn-outline-brand flex items-center gap-2 text-sm">
                  <ExternalLink size={14} /> LinkedIn
                </a>
                {speaker.github && (
                  <a href={speaker.github} target="_blank" rel="noopener noreferrer"
                    className="btn-secondary flex items-center gap-2 text-sm">
                    <ExternalLink size={14} /> GitHub
                  </a>
                )}
                {speaker.twitter && (
                  <a href={speaker.twitter} target="_blank" rel="noopener noreferrer"
                    className="btn-secondary flex items-center gap-2 text-sm">
                    <ExternalLink size={14} /> Twitter
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="glass-card p-8 rounded-xl text-center">
            <h3 className="font-serif text-2xl text-white mb-3">Learn directly from Zenovate</h3>
            <p className="text-white/55 text-sm mb-6 max-w-md mx-auto">
              Join the Code with Zen one-day offline AI event and get hands-on guidance from an AI engineer who builds AI products every single day.
            </p>
            <Link href="/register" className="btn-primary px-8 py-3.5">
              Register Now — ₹199
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

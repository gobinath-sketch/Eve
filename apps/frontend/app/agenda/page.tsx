'use client';

import { useState } from 'react';
import PageShell from '@/components/layout/PageShell';
import { AGENDA } from '@/lib/constants';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function AgendaPage() {
  const [activeIdx, setActiveIdx] = useState(1);
  const item = AGENDA[activeIdx];

  return (
    <PageShell>
      <section className="py-16 px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="section-label mb-4">SCHEDULE</p>
          <h1 className="font-serif text-4xl md:text-6xl text-white mb-3">
            Event Agenda
          </h1>
          <p className="text-white/50 text-sm md:text-base mb-12 max-w-xl">
            One day. Five expert sessions. One transformed you.
          </p>

          {/* Interactive Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-0 border border-white/8 rounded-lg overflow-hidden mb-12">
            {/* Session List */}
            <div className="md:col-span-2 border-r border-white/8">
              {AGENDA.map((a, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className={`w-full text-left schedule-item ${activeIdx === i ? 'active' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-[10px] font-bold text-white/25 font-outfit mt-0.5 w-6 flex-shrink-0">
                      {String(i).padStart(2, '0')}
                    </span>
                    <div>
                      <p className={`text-[10px] font-semibold uppercase tracking-widest mb-0.5 ${activeIdx === i ? 'text-brand' : 'text-white/30'}`}>
                        {a.session} · {a.time}
                      </p>
                      <p className={`text-sm font-medium ${activeIdx === i ? 'text-white' : 'text-white/55'}`}>
                        {a.title}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Detail Panel */}
            <div className="md:col-span-3 bg-[rgba(255,255,255,0.02)]">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-6 md:p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="tag-brand">{item.session}</span>
                  <span className="text-xs text-white/40 font-outfit">{item.time}</span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl text-white mb-3">{item.title}</h2>
                <p className="text-white/55 text-sm leading-relaxed mb-6">{item.desc}</p>
                <ul className="space-y-3">
                  {item.details.map((d, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                      <CheckCircle size={16} className="text-brand flex-shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Simple Timeline View */}
          <div>
            <p className="section-label mb-6">FULL DAY AT A GLANCE</p>
            <div className="space-y-0">
              {AGENDA.map((a, i) => (
                <div key={i} className="flex gap-6 py-4 border-b border-white/6 last:border-none">
                  <div className="w-20 flex-shrink-0">
                    <span className="text-xs font-medium text-white/35 font-outfit">{a.time}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-brand/70">{a.session}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-white">{a.title}</h3>
                    <p className="text-xs text-white/40 mt-0.5">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/register" className="btn-primary text-base px-8 py-3.5">
              Register Now — ₹199
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

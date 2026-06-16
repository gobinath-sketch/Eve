'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Typewriter from '@/components/ui/Typewriter';
import { submitContact } from '@/lib/api';
import {
  SITE_NAME, AGENDA, SPEAKERS, FAQS,
  REGISTRATION_FEE, CONTACT,
} from '@/lib/constants';

// ── Countdown Timer ────────────────────────────────────────────
function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return (
    <div className="flex items-center gap-3 font-outfit">
      {Object.entries(timeLeft).map(([k, v]) => (
        <div key={k} className="text-center">
          <div className="text-base font-bold text-white leading-none">{String(v).padStart(2, '0')}</div>
          <div className="text-[9px] text-white/40 uppercase tracking-widest mt-0.5">{k}</div>
        </div>
      ))}
    </div>
  );
}

// ── FAQ Item ───────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button className="faq-header w-full text-left" onClick={() => setOpen(!open)}>
        <span className="text-sm font-medium text-white/90 pr-4">{q}</span>
        <span className={`text-white/40 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : 'rotate-0'} text-xs font-bold font-outfit select-none w-4 h-4 flex items-center justify-center border border-white/15 rounded`}>
          {open ? '–' : '+'}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="faq-body"
          >
            {a}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Contact Form ───────────────────────────────────────────────
function ContactForm() {
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

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-brand/10 border border-brand/30 flex items-center justify-center mx-auto mb-4">
          <span className="text-brand text-sm font-bold font-outfit">sent</span>
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">Message Sent!</h3>
        <p className="text-white/50 text-sm">We will get back to you within 24 hours.</p>
        <button onClick={() => setStatus('idle')} className="btn-secondary mt-5 text-sm">Send Another</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-white/45 mb-1.5">Name <span className="text-brand">*</span></label>
          <input placeholder="Your full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} id="contact-name" />
        </div>
        <div>
          <label className="block text-xs font-medium text-white/45 mb-1.5">Email <span className="text-brand">*</span></label>
          <input type="email" placeholder="you@example.com" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} id="contact-email" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-white/45 mb-1.5">Subject <span className="text-brand">*</span></label>
        <input placeholder="What is your question about?" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} id="contact-subject" />
      </div>
      <div>
        <label className="block text-xs font-medium text-white/45 mb-1.5">Message <span className="text-brand">*</span></label>
        <textarea placeholder="Write your message here..." required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} id="contact-message" />
      </div>
      {status === 'error' && <p className="text-xs text-red-400">Failed to send. Please email us directly at {CONTACT.email}</p>}
      <button type="submit" className="btn-primary w-full justify-center" disabled={status === 'loading'} id="contact-submit">
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}

// ── Bullet point ───────────────────────────────────────────────
function Dot() {
  return <span className="w-1 h-1 rounded-full bg-brand flex-shrink-0 mt-2" />;
}

function BulletItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3 text-sm text-white/65">
      <span className="w-4 h-4 rounded-full bg-brand/12 border border-brand/25 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-brand text-[9px] font-bold font-outfit">ok</span>
      </span>
      {text}
    </li>
  );
}

// ── Main SPA Page ──────────────────────────────────────────────
const EVENT_DATE = new Date('2026-08-15T09:00:00+05:30');

export default function HomePage() {
  const [activeSession, setActiveSession] = useState(1);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowSticky(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sessionItem = AGENDA[activeSession];

  return (
    <div className="relative bg-[#000000] min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ══════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════ */}
      <section id="hero" className="relative min-h-[90vh] flex flex-col justify-center pt-32 pb-20 overflow-hidden border-b border-white/8">
        {/* Glow spotlight behind the text */}
        <div className="absolute inset-0 bg-spotlight-green z-0" />
        {/* Crisp grid pattern that fades out at the bottom/sides */}
        <div className="absolute inset-0 bg-grid-premium-masked z-0" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="tag-brand mb-6 inline-flex">Offline AI Event 2026</div>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white tracking-tight leading-[1.05] max-w-4xl">
              Learn AI & Yourself<br />
              <span className="font-mono text-white/70 not-italic tracking-normal text-3xl sm:text-4xl md:text-6xl lg:text-[72px] block my-2 select-all">
                <Typewriter words={['Vibe Coding', 'RAG Pipelines', 'Autonomous Agents', 'Prompt Engineering', 'CrewAI Orchestration', 'Full-Stack Web Dev', 'System Design', 'Rapid MVP Dev', 'LLM Orchestration']} />
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base md:text-lg text-white/58 leading-relaxed">
              From prompt engineering to building AI agents — learn practical, real-world AI skills at our hands-on offline event. No fluff. Just results.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/45">
              <span className="border-l-2 border-brand pl-3 text-white/70 font-medium">One-Day Offline Event</span>
              <span>Registration Fee: ₹{REGISTRATION_FEE}</span>
              <span>Venue details shared after registration</span>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/register" className="btn-primary text-base px-7 py-3.5" id="hero-register-btn">Register Now — ₹{REGISTRATION_FEE}</Link>
              <a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }} className="btn-secondary text-base px-7 py-3.5">Learn More</a>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-8">
              {[{ n: '100%', l: 'Hands-On' }, { n: '5+', l: 'Expert Sessions' }, { n: '1 Day', l: 'Duration' }, { n: '₹199', l: 'Only Fee' }].map(({ n, l }) => (
                <div key={l}>
                  <div className="stat-number">{n}</div>
                  <div className="stat-label">{l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ABOUT / PROGRAM SECTION
      ══════════════════════════════════════════════ */}
      <section id="about" className="relative z-10 py-20 px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="section-label mb-3">THE PROGRAM</p>
          <h2 className="font-serif text-3xl md:text-5xl text-white mb-4 max-w-3xl">
            One Day. Lifetime of AI Skills.
          </h2>
          <p className="text-white/48 text-sm md:text-base max-w-2xl leading-relaxed mb-14">
            While others debate if AI will take their jobs, you will learn to make AI work for you.
            This is not theory — it is a hands-on event that delivers real transformation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {[
              { title: 'Master Prompt Engineering', desc: 'Learn the art of talking to AI. Craft perfect prompts that get you exactly what you want, every time.' },
              { title: 'Build with Vibe Coding', desc: 'Use Cursor, Windsurf, and Bolt to build full applications with AI as your co-pilot. No advanced coding needed.' },
              { title: 'Create AI Agents', desc: 'Build custom AI agents that work 24/7 for you. Automate tasks, build GPTs, and design intelligent workflows.' },
              { title: 'Build AI Applications', desc: 'Ship real AI-powered websites and apps with modern tools like v0, Lovable, and Bolt in a single day.' },
              { title: 'Automate Your Workflow', desc: 'Identify repetitive tasks and replace them with AI automations that save you hours every week.' },
              { title: 'Future-Proof Your Career', desc: 'Walk away with a clear 30-day AI action plan tailored to your role and industry.' },
            ].map((f) => (
              <div key={f.title} className="glass-card p-6 rounded-lg">
                <h3 className="text-sm font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-white/48 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Who is it for */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <p className="section-label mb-4">WHO IS THIS FOR</p>
              <h3 className="font-serif text-2xl md:text-3xl text-white mb-4">Built for anyone curious about AI</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-5">
                Whether you are a student, developer, founder, professional, or complete beginner — this event is designed so that you leave with real, practical skills you can use immediately.
              </p>
              <ul className="space-y-2.5">
                {['Students and recent graduates', 'Software developers and engineers', 'Founders and entrepreneurs', 'Marketing and business professionals', 'Freelancers and creators', 'Anyone curious about AI'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/65">
                    <Dot /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-card p-6 rounded-lg">
              <p className="section-label mb-4">WHAT YOU WALK AWAY WITH</p>
              <ul className="space-y-3">
                {[
                  'Hands-on experience with 5 or more AI tools',
                  'A working AI agent you built yourself',
                  'An AI-powered website or app you shipped',
                  'Your 30-day AI action plan',
                  'Certificate of completion',
                  'Access to the Code with Zen community',
                ].map(item => (
                  <BulletItem key={item} text={item} />
                ))}
              </ul>
              <div className="mt-6 pt-5 border-t border-white/8">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="font-outfit text-3xl font-bold text-white">₹{REGISTRATION_FEE}</span>
                  <span className="text-white/35 text-sm">only</span>
                </div>
                <Link href="/register" className="btn-primary w-full justify-center">Register Now</Link>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ══════════════════════════════════════════════
          AGENDA / SCHEDULE SECTION
      ══════════════════════════════════════════════ */}
      <section id="agenda" className="relative z-10 py-20 px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="section-label mb-3">THE SCHEDULE</p>
          <h2 className="font-serif text-3xl md:text-5xl text-white mb-2">One Day. Five Expert Sessions.</h2>
          <p className="text-white/45 text-sm mb-12 max-w-xl">One day. One transformed you.</p>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-0 border border-white/8 rounded-lg overflow-hidden">
            {/* Session List */}
            <div className="md:col-span-2 border-r border-white/8">
              {AGENDA.map((a, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSession(i)}
                  className={`w-full text-left schedule-item ${activeSession === i ? 'active' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-[10px] font-bold text-white/20 font-outfit mt-0.5 w-6 flex-shrink-0">
                      {String(i).padStart(2, '0')}
                    </span>
                    <div>
                      <p className={`text-[10px] font-semibold uppercase tracking-widest mb-0.5 ${activeSession === i ? 'text-brand' : 'text-white/28'}`}>
                        {a.session}
                      </p>
                      <p className={`text-sm font-medium ${activeSession === i ? 'text-white' : 'text-white/55'}`}>
                        {a.title}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Session Detail */}
            <div className="md:col-span-3 bg-[rgba(255,255,255,0.018)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSession}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="p-6 md:p-8"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="tag-brand">{sessionItem.session}</span>
                    <span className="text-xs text-white/38 font-outfit">{sessionItem.time}</span>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl text-white mb-3">{sessionItem.title}</h3>
                  <p className="text-white/52 text-sm leading-relaxed mb-6">{sessionItem.desc}</p>
                  <ul className="space-y-2.5">
                    {sessionItem.details.map((d, i) => (
                      <BulletItem key={i} text={d} />
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SPEAKER SECTION
      ══════════════════════════════════════════════ */}
      <section id="speaker" className="relative z-10 py-20 px-6 md:px-10 bg-[rgba(255,255,255,0.012)]">
        <div className="mx-auto max-w-7xl">
          <p className="section-label mb-3">YOUR GUIDE</p>
          <h2 className="font-serif text-3xl md:text-5xl text-white mb-12">Meet Your Speaker</h2>

          {SPEAKERS.map((s) => (
            <div key={s.id} className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              {/* Visual */}
              <div className="aspect-[4/3] bg-[rgba(255,255,255,0.03)] border border-white/8 rounded-xl overflow-hidden flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 rounded-full bg-brand/10 border border-brand/25 flex items-center justify-center mx-auto mb-4">
                    <span className="text-brand font-serif text-3xl font-bold">{s.name.charAt(0)}</span>
                  </div>
                  <h3 className="font-serif text-3xl text-white">{s.name}</h3>
                  <p className="text-brand text-sm font-medium mt-1">{s.role}</p>
                  <p className="text-white/35 text-xs mt-2 leading-relaxed">{s.expertise}</p>
                  <div className="flex justify-center gap-4 mt-5">
                    <a href={s.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-white/40 hover:text-brand transition-colors">LinkedIn</a>
                    {s.github && <a href={s.github} target="_blank" rel="noopener noreferrer" className="text-xs text-white/40 hover:text-brand transition-colors">GitHub</a>}
                    {s.twitter && <a href={s.twitter} target="_blank" rel="noopener noreferrer" className="text-xs text-white/40 hover:text-brand transition-colors">Twitter</a>}
                  </div>
                </div>
              </div>

              {/* Info */}
              <div>
                <div className="flex flex-wrap gap-2 mb-5">
                  {s.tags.map(tag => (
                    <span key={tag} className="tag-brand">{tag}</span>
                  ))}
                </div>
                <h3 className="font-serif text-3xl md:text-4xl text-white mb-2">{s.name}</h3>
                <p className="text-brand font-semibold text-sm mb-4">{s.role}</p>
                <p className="text-white/55 text-sm leading-relaxed mb-6">{s.bio}</p>
                <ul className="space-y-2.5 mb-7">
                  {s.highlights?.map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm text-white/60">
                      <Dot />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3">
                  <a href={s.linkedin} target="_blank" rel="noopener noreferrer" className="btn-outline-brand text-sm">LinkedIn Profile</a>
                  {s.github && <a href={s.github} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">GitHub</a>}
                  {s.twitter && <a href={s.twitter} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">Twitter</a>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          WHY ATTEND
      ══════════════════════════════════════════════ */}
      <section className="relative z-10 py-20 px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-label mb-3">WHY ATTEND</p>
              <h2 className="font-serif text-3xl md:text-5xl text-white mb-5">Hands-on. Real. Offline.</h2>
              <p className="text-white/52 text-sm md:text-base leading-relaxed mb-8">
                Online courses give you videos. We give you experience. In one full day of offline learning,
                you build real things, ask real questions, and leave with real skills — not just a certificate.
              </p>
              <Link href="/register" className="btn-primary">Register Now — ₹{REGISTRATION_FEE}</Link>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {[
                { title: 'Hands-On, Not Theoretical', desc: 'Every session includes live building. You will write prompts, create agents, and ship apps — not just watch slides.' },
                { title: 'Expert-Led, Not Pre-Recorded', desc: 'Learn directly from Zenovate — an AI engineer who builds AI products every day. Ask questions, get real answers.' },
                { title: 'Community and Network', desc: 'Connect with developers, students, and entrepreneurs in your city who are passionate about AI.' },
                { title: 'Certificate of Completion', desc: 'Walk away with a verified certificate and a 30-day AI action plan personalized for your role.' },
              ].map((w) => (
                <div key={w.title} className="glass-card p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-white mb-1.5 flex items-start gap-2">
                    <Dot /> {w.title}
                  </h3>
                  <p className="text-xs text-white/42 leading-relaxed pl-4">{w.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FAQ SECTION
      ══════════════════════════════════════════════ */}
      <section id="faq" className="relative z-10 py-20 px-6 md:px-10 bg-[rgba(255,255,255,0.012)]">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
            <div className="md:col-span-2 md:sticky md:top-28 md:self-start">
              <p className="section-label mb-3">COMMON QUESTIONS</p>
              <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
                Everything you are wondering about
              </h2>
              <p className="text-white/48 text-sm leading-relaxed mb-6">
                Still have questions? Reach out directly and we will help you out.
              </p>
              <a href={`mailto:${CONTACT.email}`} className="btn-outline-brand text-sm">Contact Us</a>
            </div>
            <div className="md:col-span-3">
              {FAQS.map((f, i) => (
                <FaqItem key={i} q={f.q} a={f.a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CONTACT SECTION
      ══════════════════════════════════════════════ */}
      <section id="contact" className="relative z-10 py-20 px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="section-label mb-3">GET IN TOUCH</p>
          <h2 className="font-serif text-3xl md:text-5xl text-white mb-4">Contact Us</h2>
          <p className="text-white/48 text-sm max-w-xl mb-12">
            Have a question about the event? We are happy to help.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Form */}
            <div className="glass-card p-6 md:p-8 rounded-xl">
              <h3 className="font-serif text-xl text-white mb-6">Send us a message</h3>
              <ContactForm />
            </div>

            {/* Info */}
            <div className="space-y-5">
              <div>
                <p className="section-label mb-4">DIRECT CONTACT</p>
                <div className="space-y-3">
                  <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-4 glass-card p-4 rounded-lg group">
                    <div className="w-9 h-9 rounded-lg bg-brand/10 border border-brand/18 flex items-center justify-center flex-shrink-0">
                      <span className="text-brand text-xs font-bold font-outfit">mail</span>
                    </div>
                    <div>
                      <p className="text-xs text-white/38 mb-0.5">Email</p>
                      <p className="text-sm font-medium text-white group-hover:text-brand transition-colors">{CONTACT.email}</p>
                    </div>
                  </a>
                  <a href={`tel:${CONTACT.phone}`} className="flex items-center gap-4 glass-card p-4 rounded-lg group">
                    <div className="w-9 h-9 rounded-lg bg-brand/10 border border-brand/18 flex items-center justify-center flex-shrink-0">
                      <span className="text-brand text-xs font-bold font-outfit">tel</span>
                    </div>
                    <div>
                      <p className="text-xs text-white/38 mb-0.5">Phone</p>
                      <p className="text-sm font-medium text-white group-hover:text-brand transition-colors">+91 {CONTACT.phone}</p>
                    </div>
                  </a>
                </div>
              </div>

              <div>
                <p className="section-label mb-4">FIND US ON</p>
                <div className="flex flex-wrap gap-3">
                  <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" className="btn-outline-brand text-sm">LinkedIn</a>
                  <a href={CONTACT.github} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">GitHub</a>
                  <a href={CONTACT.twitter} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">Twitter</a>
                </div>
              </div>

              <div className="glass-card p-5 rounded-lg">
                <p className="text-sm font-semibold text-white mb-1.5">Response Time</p>
                <p className="text-xs text-white/45 leading-relaxed">
                  We typically respond within 24 hours. For urgent queries, please call or WhatsApp us directly at +91 {CONTACT.phone}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════ */}
      <section className="relative z-10 py-24 px-6 md:px-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/6 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl text-center">
          <p className="section-label mb-4">LIMITED SEATS</p>
          <h2 className="font-serif text-4xl md:text-6xl text-white mb-5 max-w-3xl mx-auto">
            Your AI journey starts with one decision.
          </h2>
          <p className="text-white/50 text-base max-w-xl mx-auto mb-10">
            Join the next generation of AI builders. Register for the Code with Zen one-day offline AI event for just ₹{REGISTRATION_FEE}.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/register" className="btn-primary text-base px-8 py-4" id="bottom-register-btn">
              Register Now — ₹{REGISTRATION_FEE}
            </Link>
            <a href={`mailto:${CONTACT.email}`} className="btn-secondary text-base px-8 py-4">Ask a Question</a>
          </div>
        </div>
      </section>

      <Footer />

      {/* ══════════════════════════════════════════════
          STICKY BOTTOM CTA
      ══════════════════════════════════════════════ */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="sticky-cta"
          >
            <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-5">
                <span className="font-serif text-base text-white font-medium">{SITE_NAME}</span>
                <span className="hidden sm:block text-white/20">|</span>
                <CountdownTimer targetDate={EVENT_DATE} />
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <div className="text-xs text-white/35">Registration Fee</div>
                  <div className="text-base font-bold text-brand font-outfit">₹{REGISTRATION_FEE} Only</div>
                </div>
                <Link href="/register" className="btn-primary text-sm px-5 py-2.5 whitespace-nowrap" id="sticky-register-btn">
                  Register Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

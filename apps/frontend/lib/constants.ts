export const SITE_NAME = 'Code with Zen';

export const VIDEOS = {
  home: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4',
  about: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4',
  agenda: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4',
  speakers: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4',
  contact: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4',
  register: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4',
} as const;

export const CONTACT = {
  email: 'learnwithzenovate@gmail.com',
  phone: '8438417884',
  linkedin: 'https://www.linkedin.com/in/zenovate/',
  github: 'https://github.com/gobinath-sketch',
  twitter: 'https://x.com/yaminosei',
};

export const REGISTRATION_FEE = 199;

export const NAV_LINKS = [
  { href: '#hero', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#agenda', label: 'Agenda' },
  { href: '#speaker', label: 'Speaker' },
  { href: '#contact', label: 'Contact' },
];

export const TOPICS = [
  'Generative AI Fundamentals',
  'Prompt Engineering',
  'Vibe Coding',
  'AI Agents & Automation',
  'Build AI Applications',
  'AI Website Development',
  'AI App Development',
  'LLMs & How They Work',
  'Cursor & Windsurf',
  'ChatGPT & Claude',
  'AI Productivity Tools',
  'Future of AI Careers',
];

export const AGENDA = [
  {
    time: '09:00 AM',
    title: 'Registration & Welcome',
    desc: 'Check-in, networking, and event kickoff',
    session: 'SESSION 0',
    details: ['Meet fellow AI enthusiasts', 'Get your event kit', 'Network with participants', 'Introduction to the day'],
  },
  {
    time: '10:00 AM',
    title: 'Getting Started with Generative AI',
    desc: 'Understand where you stand in the AI landscape and learn how AI really works — the foundation for everything that follows.',
    session: 'SESSION 1',
    details: [
      'What is Generative AI and how LLMs work',
      'Map of AI tools: ChatGPT, Claude, Gemini, Copilot',
      'The 5-step LLM pipeline explained simply',
      'Identify your AI path: specialist vs generalist',
      'Live demo: Prompt engineering fundamentals',
    ],
  },
  {
    time: '11:30 AM',
    title: 'Vibe Coding & AI-Assisted Development',
    desc: 'Build real applications using AI coding tools. No advanced coding skills required — just your ideas and AI as your co-pilot.',
    session: 'SESSION 2',
    details: [
      'Introduction to Cursor, Windsurf, and Bolt',
      'Build a full web app with AI in under 30 minutes',
      'Vibe coding methodology and best practices',
      'Debugging with AI assistants',
      'Deploy your first AI-built application live',
    ],
  },
  {
    time: '12:30 PM',
    title: 'Lunch & Networking',
    desc: 'Recharge and connect with fellow participants.',
    session: 'BREAK',
    details: ['Networking lunch provided', 'Q&A with the speaker', 'Share your ideas and projects'],
  },
  {
    time: '01:30 PM',
    title: 'Building AI Agents & Automation',
    desc: 'Create custom AI agents that work for you 24/7. Automate repetitive tasks and build intelligent workflows.',
    session: 'SESSION 3',
    details: [
      'What are AI agents and why they matter',
      'Build your first AI agent from scratch',
      'Connect AI tools to automate your workflow',
      'Custom GPTs and personalised AI assistants',
      'Real-world automation use cases and examples',
    ],
  },
  {
    time: '03:00 PM',
    title: 'AI Website & App Development',
    desc: 'Build production-ready websites and mobile apps powered by AI, without traditional coding bottlenecks.',
    session: 'SESSION 4',
    details: [
      'Build a complete website using AI tools',
      'AI-powered UI/UX design with v0 and Lovable',
      'Integrate APIs and AI features into apps',
      'Deploy and ship your AI product',
      'Monetisation strategies for AI products',
    ],
  },
  {
    time: '04:30 PM',
    title: 'Q&A, Demos & Closing Ceremony',
    desc: 'Showcase your builds, get expert feedback, and walk away with a clear AI action plan.',
    session: 'SESSION 5',
    details: [
      'Live project demos from participants',
      'Open Q&A with Zenovate',
      'Your 30-day AI action plan',
      'Certificate of completion',
      'Community access and next steps',
    ],
  },
];

export const SPEAKERS = [
  {
    id: 'zenovate',
    name: 'Gobinath M',
    role: 'AI Engineer & Full-Stack Developer',
    expertise: 'Vibe Coding · LLMs · RAG Pipelines · Multi-Agent Systems · Cloud/DevOps',
    bio: 'Gobinath M is a Strategic AI Engineer and Full-Stack Developer specializing in high-velocity product engineering through Vibe Coding. He is an expert in architecting production-ready LLM applications, autonomous multi-agent ecosystems (CrewAI), and enterprise platforms, bridging the gap between AI research and production software.',
    linkedin: 'https://www.linkedin.com/in/zenovate/',
    github: 'https://github.com/gobinath-sketch',
    twitter: 'https://x.com/yaminosei',
    tags: ['AI Engineer', 'Full-Stack Developer', 'Product Innovator', 'AI Builder'],
    highlights: [
      'Expert in LLM Orchestration, RAG Pipelines, and CrewAI',
      'Proficient in Next.js, React, Node.js, FastAPI, and TypeScript/Python',
      'Master of AI Dev Tools (Cursor, Windsurf, Lovable, Bolt.new, v0)',
      'Experienced with AWS, Microsoft Azure, Docker, and CI/CD Workflows',
      'Specializes in System Design, Rapid MVP development, and Vibe Coding and more etc..,'
    ],
  },
];

export const TESTIMONIALS = [
  {
    name: 'Arjun Krishnamurthy',
    role: 'Software Developer',
    quote: 'This event completely changed how I think about AI. I built my first AI agent in the afternoon session — something I thought would take weeks. Zenovate makes it so accessible.',
  },
  {
    name: 'Priya Ramesh',
    role: 'Marketing Manager',
    quote: 'I came in thinking AI was only for coders. I left with a fully working AI-powered website for my business. The hands-on approach is what makes this event stand out.',
  },
  {
    name: 'Karthik Sundaram',
    role: 'Final Year Engineering Student',
    quote: 'At ₹199, this is the best investment I\'ve made in my career. I learned more practical AI skills in one day than in my entire semester of AI coursework.',
  },
  {
    name: 'Divya Natarajan',
    role: 'Freelancer & Entrepreneur',
    quote: 'The vibe coding session was mind-blowing. I can now ship products 10x faster with AI. Zenovate is a phenomenal teacher who genuinely cares about your growth.',
  },
  {
    name: 'Rohit Menon',
    role: 'Product Manager',
    quote: 'This is the real-world AI training that colleges don\'t teach. The agent building lab alone is worth 10x the registration fee. Highly recommend to anyone in tech.',
  },
];

export const FAQS = [
  {
    q: 'What is the Code with Zen AI Event?',
    a: 'Code with Zen is a one-day, hands-on offline AI event where you learn practical AI skills — from prompt engineering and vibe coding to building AI agents and AI-powered applications. It\'s designed for students, developers, founders, and professionals who want to master AI in a single day.',
  },
  {
    q: 'Who is this event for?',
    a: 'This event is for anyone curious about AI — students, developers, software engineers, entrepreneurs, freelancers, and professionals. No prior AI experience is required. Whether you\'re a complete beginner or an experienced developer, you will leave with new, practical skills.',
  },
  {
    q: 'What will I learn in one day?',
    a: 'You will learn Generative AI fundamentals, prompt engineering, vibe coding with AI tools (Cursor, Windsurf, Bolt), building AI agents, AI website and app development, and AI automation — all through hands-on, practical sessions.',
  },
  {
    q: 'Is this event offline? Where is the venue?',
    a: 'Yes! This is a 100% offline, in-person event. The venue details will be shared with registered participants via email closer to the event date.',
  },
  {
    q: 'What is the registration fee?',
    a: 'The registration fee is ₹199. This covers your full-day attendance, hands-on sessions, event kit, networking lunch, and a certificate of completion.',
  },
  {
    q: 'What do I need to bring?',
    a: 'Bring your laptop (charged), a curious mind, and your ideas. All software tools used in the event are free or have free tiers. We\'ll guide you through everything.',
  },
  {
    q: 'Will I receive a certificate?',
    a: 'Yes! All participants who attend the event will receive a digital certificate of completion from Code with Zen.',
  },
  {
    q: 'What is the refund policy?',
    a: 'If you are unable to attend after registering, please contact us at learnwithzenovate@gmail.com at least 48 hours before the event. Refunds are processed within 5–7 business days.',
  },
];

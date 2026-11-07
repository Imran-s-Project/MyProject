/**
 * content.js
 * ----------------------------------------------------------------------
 * Every piece of copy on the site lives here, keyed by `bn` / `en`.
 * The HTML file no longer contains any text — main.js reads this object
 * and builds the DOM at runtime. Edit copy here; nothing else needs to
 * change for the change to show up on the page.
 * ----------------------------------------------------------------------
 */

export const SITE = {
  title: 'Imran Ahmed — Web Developer',
  description:
    'Imran Ahmed — Independent web developer building premium PWAs, Quran apps, and browser-based tools with vanilla JavaScript and Firebase.',
  email: 'project.developer.tech@gmail.com',
  // Drop your actual PDF at this path (e.g. assets/imran-ahmed-cv.pdf) —
  // the button below is wired up but the file itself isn't included here.
  resumeUrl: 'assets/imran-ahmed-cv.pdf',
  // Showcase/intro video shown in the "showcase" section, just below the
  // hero. Swap this URL any time — nothing else needs to change.
  showcaseVideoUrl: "https://myprojectinfo.vercel.app/ad.vd/imran's.mp4"
};

export const CONTENT = {
  nav: {
    logo: 'IMRAN AHMED',
    links: [
      { href: '#showcase', bn: 'Video', en: 'Video' },
      { href: '#projects', bn: 'Project', en: 'Projects' },
      { href: '#about', bn: 'About', en: 'About' },
      { href: '#contact', bn: 'Contact', en: 'Contact' }
    ],
    langBn: 'বাং',
    langEn: 'EN'
  },

  hero: {
    eyebrow: { bn: 'ইন্ডিপেন্ডেন্ট ওয়েব ডেভেলপার · বাংলাদেশ', en: 'Independent Web Developer · Bangladesh' },
    name: { bn: 'ইমরান আহমেদ', en: 'Imran Ahmed' },
    tagline: {
      bn: 'ওয়েব অভিজ্ঞতা তৈরি করি — কুরআন অ্যাপ থেকে শুরু করে পরীক্ষা প্ল্যাটফর্ম পর্যন্ত, প্রতিটি লাইন ভ্যানিলা জাভাস্ক্রিপ্ট আর ফায়ারবেস দিয়ে, কোনো ফ্রেমওয়ার্ক ছাড়াই।',
      en: 'I build web experiences — from Quran apps to exam platforms — every line written in vanilla JavaScript and Firebase, no frameworks, no shortcuts.'
    },
    ctaPrimary: { bn: 'প্রজেক্টগুলো দেখুন', en: 'View Projects' },
    ctaGhost: { bn: 'যোগাযোগ করুন', en: 'Get in Touch' },
    scrollHint: { bn: 'স্ক্রল করুন', en: 'SCROLL' }
  },

  showcase: {
    eyebrow: { bn: 'সংক্ষিপ্ত পরিচিতি', en: 'Introduction' },
    heading: { bn: 'একনজরে আমার কাজ', en: 'A closer look at my work' },
    intro: {
      bn: 'নিচের ভিডিওতে দেখে নিন আমার কাজের ধরন এবং তৈরি করা প্রজেক্টগুলোর একটি সংক্ষিপ্ত ঝলক।',
      en: "A short walkthrough of how I work and the projects I've built."
    }
  },

  about: {
    eyebrow: { bn: 'পরিচিতি', en: 'Introduction' },
    heading: { bn: 'যা নিয়ে কাজ করি', en: 'What I work on' },
    paragraphs: [
      {
        bn: 'পৃথিবীতে সকলের নেশা এক না ওয়েব ডিজাইন এবং ওয়েব বিল্ডিং সহ সকল কাজ আমি আমার জীবনের সবচেয়ে বেশি গুরুত্ব সহকারে করে থাকি আলহামদুলিল্লাহ্ আল্লাহ্ ভরসা। <strong> আধুনিক জাভা স্ক্রিপ্ট,আধুনিক সিএসএস ও এইচটিএমএল সহ ব্যাকএন্ড হিসেবে ফায়ার ডাটাবেজ এবং ইমেইল যেএস </strong> দিয়ে শুরু থেকে শেষ পর্যন্ত ফিচার-সমৃদ্ধ পিডব্লিউএ এবং ব্রাউজার-বেজড টুল তৈরি করি — প্রতিটি মডিউল নিজের হাতে গঠন করা।',
        en: "Not everyone in the world has the same addiction. I take all the work, including web design and web building, with the utmost seriousness in my life. Alhamdulillah, trust in Allah. <strong>Modern JavaScript, modern CSS and HTML, along with Firebase and email JS as backends</strong> — every module hand-structured."
      },
      {
        bn: 'আমার কাজের পরিধি একটা বাংলা কুরআন অ্যাপ থেকে শুরু করে একটা পূর্ণাঙ্গ কোলাবোরেটিভ ওয়েব আইডিই, একটা কমিউনিটি ফাউন্ডেশনের ওয়েবসাইট এবং ফায়ারবেস-চালিত এক্সাম প্ল্যাটফর্ম সহ বিভিন্ন টেক রিলেটেড আইডিয়া প্রয়োগ করে সাইট কে আরো বেশি স্ট্রং করে তোলাই আমার কাজ যা ইউজার এর জন্য বলো কিছু উপহার দেওয়া আমার চিন্তা দ্বারা।',
        en: "My work ranges from a Bengali Quran app to a full-fledged collaborative web IDE, a community foundation website, and a Firebase-powered exam platform. My job is to make the site stronger by implementing various tech-related ideas, which are my thoughts on giving something back to the user."
      },
      {
        bn: 'ওয়েবসাইট তৈরি করতে বিশ্বাস এবং যেই ভাষা হোক সেইটা নিয়েই কাজ শুরু করা যা নিজে কে অভিজ্ঞতা করে তোলে',
        en: 'Trust in building a website and starting with whatever language you choose is what makes you an expert.'
      }
    ],
    skillsLabel: { bn: 'আমার কাজ ও কাজের ধরন সমূহ', en: 'My work and types of work' },
    skills: [
      'JavaScript (ES2023)',
      'Firebase & Firestore database',
      'Firebase authentication',
      'PWA register',
      'IndexedDB data management',
      'Canvas API config',
      'Web Components',
      'GitHub OAuth & Pages',
      'Performance Tuning',
      'Modern UI-UX'

    ]
  },

  projectsSection: {
    eyebrow: { bn: 'আমার তৈরি করা কিছু কাজ', en: 'Some of the work I have created' },
    heading: { bn: 'প্রজেক্টসমূহ', en: 'Projects' },
    intro: { bn: 'যেকোনো প্রজেক্টে ক্লিক করে বিস্তারিত দেখুন।', en: 'Click on any project to see details.' },
    viewLabel: { bn: 'প্রজেক্ট দেখুন', en: 'View project' },
    soonLabel: { bn: 'শীঘ্রই আসছে', en: 'Coming soon' }
  },

  contactSection: {
    eyebrow: { bn: 'আমার সাথে যোগাযোগের মাধ্যম', en: 'Get in touch' },
    heading: { bn: 'যোগাযোগ করুন', en: "Let's talk" },
    primaryBlurb: {
      bn: 'নতুন প্রজেক্ট, সহযোগিতা, বা যেকোনো প্রশ্নের জন্য সরাসরি ইমেইল করুন বা ম্যাসেজ করুন আমাদের ফেসবুক পেজে।',
      en: 'For new projects, collaborations, or any questions, email or message us directly on our Facebook page.'
    },
    primaryCta: { bn: 'ইমেইল পাঠান', en: 'Send an Email' },
    resumeCta: { bn: 'সিভি ডাউনলোড করুন', en: 'Download CV' }
  },

  footer: {
    bn: 'Designed and created by — Imran Ahmed, Love <span class="heart">♥</span> With',
    en: 'Designed & built by Imran Ahmed, with <span class="heart">♥</span>'
  },

  modal: {
    visitLabel: { bn: 'সরাসরি সাইট দেখুন', en: 'Open Live Site' },
    previewLabel: { bn: 'প্রিভিউ লোড হচ্ছে…', en: 'Loading preview…' },
    soonLabel: { bn: 'এই প্রজেক্টটি এখনো প্রস্তুত হচ্ছে।', en: 'This project is still in the works.' },
    closeLabel: { bn: 'বন্ধ করুন', en: 'Close' },
    blockedLabel: {
      bn: 'এই সাইটটি এখানে প্রিভিউ করা যাচ্ছে না — সরাসরি খুলে দেখুন।',
      en: "This site can't be previewed here — open it directly instead."
    }
  }
};

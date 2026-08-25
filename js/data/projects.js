/**
 * projects.js — project data.
 * Shape (informal): { id, index, nameBn, nameEn, descBn, descEn,
 *                      detailBn, detailEn, tags[], url|null, status: 'live'|'soon' }
 */

export const projects = [
  {
    id: 'quranbangla',
    index: '01',
    nameBn: 'কুরআন বাংলা ',
    nameEn: 'QuranBangla ',
    descBn: 'ফিচার-সমৃদ্ধ বাংলা কুরআন পিডব্লিউএ (PWA) — ওয়ার্ড-বাই-ওয়ার্ড অনুবাদ, তাফসির, হিফজ ট্র্যাকার ও সিজদাহ চিহ্নিতকরণসহ।',
    descEn: 'A feature-rich Bengali Quran PWA with word-by-word translation, tafsir, a hifz tracker, and sajdah marking.',
    detailBn:
      'সম্পূর্ণ অফলাইন-প্রথম আর্কিটেকচারে তৈরি — ইনডেক্সডবি স্টোরেজ, সার্ভিস ওয়ার্কার ক্যাশিং, এবং একটি রিডার-মোড টুলবার যা পড়ার সময় নেভিগেশনকে সরিয়ে প্রসঙ্গ-সংবেদনশীল নিয়ন্ত্রণ দেয়। ১১৪টি সূরার জন্য শানে নুযূল ও ফযীলত যুক্ত করা হয়েছে বাংলায়।',
    detailEn:
      'Built offline-first with IndexedDB storage and service-worker caching, plus a context-aware reader-mode toolbar that replaces navigation while reading. Includes Bengali shan-e-nuzul and virtues (fazilat) for all 114 surahs.',
    tags: ['PWA', 'Firebase', 'IndexedDB', 'Service Worker'],
    url: 'https://quranresource.vercel.app',
    status: 'live'
  },
  {
    id: 'tvceditor',
    index: '02',
    nameBn: 'কোড এডিটর',
    nameEn: 'Code editor',
    descBn: 'এখানে সকল ধরনের কোডিং এডিটর রয়েছে এবং কোর্ট এডিট করে সরাসরি github এ পাবলিস্ট করারও সুবিধা রয়েছে যেটা একমাত্র tech verse করে দেখিয়েছে।',
    descEn: 'There are all kinds of coding editors here and there is also the facility to edit the code and publish it directly on github, which is what tech verse has shown.',
    detailBn: 'আমাদের এডিটরে সকল ধরনের ফিউচার সমৃদ্ধ রয়েছে পাইথন কোর্ট সহ সকল ধরনের ফ্লাট এবং কোড এডিট করে সরাসরি zip আইলে ডাউনলোড করা যাবে এবং json ফাইলেও ডাউনলোড করা যাবে এবং সকল ধরনের ফরমেটে কোডিং এডিট করা যাবে এবং কোড আমাদের স্টোরেজে সুবিধা করা হয়েছে যাতে আপনার কোড হারিয়ে না যায় আমাদের এখানে সকল ধরনের ফিউচার সমৃদ্ধ রয়েছে এবং যা প্রতিনিয়ত আপডেট হতেই থাকবে ইনশাআল্লাহ।',
    detailEn: 'Our editor is rich in all kinds of features. All kinds of flat and code editing including Python code can be downloaded directly in zip file and can also be downloaded in json file and coding can be edited in all kinds of formats and the code is facilitated in our storage so that your code is not lost. We are rich in all kinds of features here and which will be updated constantly, InshaAllah.',
    tags: ['PWA', 'Audio Streaming'],
    url: 'https://tvceditor.vercel.app',
    status: 'live'
  },
  {
    id: 'rupsha-jf',
    index: '05',
    nameBn: 'রূপসা জনকল্যাণ ফাউন্ডেশন',
    nameEn: 'Rupsha jonokollan foundation',
    descBn: 'রূপসা ফাউন্ডেশনের অল্টারনেট, সংক্ষিপ্ত ডোমেইন — একই মিশন, দ্রুত শেয়ারের জন্য।',
    descEn: "The foundation\u2019s alternate short-form domain \u2014 same mission, quicker to share.",
    detailBn: 'দ্রুত শেয়ারযোগ্য একটি সংক্ষিপ্ত ডোমেইনে ফাউন্ডেশনের মূল কন্টেন্ট ও ডোনেশন ফিচার হোস্ট করা।',
    detailEn: "Hosts the foundation\u2019s core content and donation features on a shorter, easy-to-share domain.",
    tags: ['Vercel', 'Static + Firestore'],
    url: 'https://rupshajf.vercel.app',
    status: 'live'
  },
  {
    id: 'tvcourse',
    index: '06',
    nameBn: 'Tech Verse course',
    nameEn: 'Tech Verse course',
    descBn: 'আমাদের সকল স্পেশাল কোর্স এবং ফ্রি কোর্স সহ সকল ধরনের কোর্স সারভাইপ করে থাকে এবং যেখানে সকল কিছু রয়েছে।',
    descEn: "We serve all types of courses, including all our special courses and free courses, and have everything you need.",
    detailBn: 'আমাদের এই প্লাটফর্মে কোর্সের পাশাপাশি প্রত্যেকটা লেসনে স্পেশাল মডেল টেস্ট এবং যেখানে সকলেই এটেন্ড করতে পারবে এবং প্রত্যেক সপ্তাহে শুক্রবারে লাইভ পরীক্ষা রয়েছে যেখানে কোর্সের সকল শিক্ষার্থী অ্যাটেন্ড করতে পারবে সম্পূর্ণ ফ্রিতে এবং আমাদের এই সম্পূর্ণ প্ল্যাটফর্মটি একদম অফলাইনে চলবে।',
    detailEn: 'In addition to the courses on this platform, there are special model tests in each lesson where everyone can attend and there is a live exam every Friday where all students of the course can attend completely free of charge and our entire platform runs completely offline.',
    tags: ['Firebase', 'In Progress'],
    url: 'https://tvcourse.vercel.app',
    status: 'live'
  }
];

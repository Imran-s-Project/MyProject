/**
 * projects.js — the 10 projects, in display order.
 * URLs are the owner-supplied source of truth. cats ∈ web | edu | dev | islamic | shop | interactive.
 * Tags are derived from the supplied category only — no unverified tech claims.
 */
export const projects = [
  {
    id: 'rupsha', mark: 'RJF', url: 'https://rupsshajf.vercel.app', cats: ['web'],
    name: { bn: 'রূপসা জনকল্যাণ ফাউন্ডেশন', en: 'Rupsha Jonokollan Foundation' },
    cat: { bn: 'ফাউন্ডেশন / সংগঠন', en: 'Foundation / Organization' },
    desc: { bn: 'রূপসা জনকল্যাণ ফাউন্ডেশন ও এর সাংগঠনিক উদ্যোগগুলোর প্রতিনিধিত্বকারী একটি ডিজিটাল প্ল্যাটফর্ম।', en: 'A digital platform representing Rupsha Jonokollan Foundation and its organizational initiatives.' }
  },
  {
    id: 'quranbangla', mark: 'QB', url: 'https://quranbangla.vercel.app', cats: ['islamic', 'edu', 'web'],
    name: { bn: 'কুরআন বাংলা', en: 'Quran Bangla' },
    cat: { bn: 'ইসলামিক / শিক্ষামূলক প্ল্যাটফর্ম', en: 'Islamic / Educational Platform' },
    desc: { bn: 'কুরআনের রিসোর্স সহজলভ্য করার লক্ষ্যে তৈরি বাংলা কুরআন-কেন্দ্রিক একটি ডিজিটাল প্ল্যাটফর্ম।', en: 'A Bengali Quran-focused digital platform designed to make Quranic resources accessible.' }
  },
  {
    id: 'tvcedit', mark: '{ }', url: 'https://tvcedit.vercel.app', cats: ['dev', 'web'],
    name: { bn: 'Tech Verse Code Editor', en: 'Tech Verse Code Editor' },
    cat: { bn: 'ডেভেলপার টুলস', en: 'Developer Tools' },
    desc: { bn: 'একটি আধুনিক কোডিং ও ডেভেলপমেন্ট প্ল্যাটফর্ম।', en: 'A modern coding and development platform.' }
  },
  {
    id: 'tvsites', mark: 'TVS', url: 'https://tvsites.vercel.app', cats: ['web'],
    name: { bn: 'Tech Verse Site', en: 'Tech Verse Site' },
    cat: { bn: 'ওয়েব প্ল্যাটফর্ম', en: 'Web Platform' },
    desc: { bn: 'টেক ভার্স ইকোসিস্টেমের অধীনে তৈরি একটি ডিজিটাল ওয়েব প্ল্যাটফর্ম।', en: 'A digital web platform developed under the Tech Verse ecosystem.' }
  },
  {
    id: 'tvcourse', mark: 'TVC', url: 'https://tvcourse.vercel.app', cats: ['edu', 'web'],
    name: { bn: 'Tech Verse Course', en: 'Tech Verse Course' },
    cat: { bn: 'শিক্ষা / অনলাইন লার্নিং', en: 'Education / Online Learning' },
    desc: { bn: 'অনলাইন লার্নিং ও কোর্সের জন্য একটি শিক্ষামূলক প্ল্যাটফর্ম।', en: 'An educational platform for online learning and courses.' }
  },
  {
    id: 'tvexam', mark: 'TVE', url: 'https://tvexam.vercel.app', cats: ['edu', 'web'],
    name: { bn: 'Tech Verse Exam', en: 'Tech Verse Exam' },
    cat: { bn: 'শিক্ষা / পরীক্ষা', en: 'Education / Examination' },
    desc: { bn: 'ডিজিটাল পরীক্ষা ও একাডেমিক মূল্যায়নের একটি প্ল্যাটফর্ম।', en: 'A digital examination and academic assessment platform.' }
  },
  {
    id: 'buyzen', mark: 'BZ', url: 'https://buyzenshop.vercel.app', cats: ['shop', 'web'],
    name: { bn: 'BuyZen Shop', en: 'BuyZen Shop' },
    cat: { bn: 'ই-কমার্স', en: 'E-commerce' },
    desc: { bn: 'একটি অনলাইন শপিং প্ল্যাটফর্ম।', en: 'An online shopping platform.' }
  },
  {
    id: 'mazeflow', mark: 'MF', url: 'https://imran-s-project.github.io/MazeFlow/', cats: ['interactive'],
    name: { bn: 'MazeFlow', en: 'MazeFlow' },
    cat: { bn: 'ইন্টারঅ্যাক্টিভ / ওয়েব এক্সপেরিয়েন্স', en: 'Interactive / Web Experience' },
    desc: { bn: 'একটি ইন্টারঅ্যাক্টিভ ওয়েব প্রজেক্ট।', en: 'An interactive web project.' }
  },
  {
    id: 'tvqrcode', mark: 'QR', url: 'https://tvqrcode.vercel.app', cats: ['dev', 'web'],
    name: { bn: 'Teach QR Code Generate', en: 'Teach QR Code Generate' },
    cat: { bn: 'ডেভেলপার টুলস / ইউটিলিটি', en: 'Developer Tools / Utility' },
    desc: { bn: 'একটি কিউআর কোড জেনারেশন টুল।', en: 'A QR code generation tool.' }
  },
  {
    id: 'questiongen', mark: 'AQ', url: 'https://imran-s-project.github.io/QuestionGenerate/', cats: ['edu', 'web'],
    name: { bn: 'Academic Question Generate', en: 'Academic Question Generate' },
    cat: { bn: 'শিক্ষামূলক টুলস', en: 'Educational Tools' },
    desc: { bn: 'একটি একাডেমিক প্রশ্ন তৈরির প্ল্যাটফর্ম।', en: 'An academic question generation platform.' }
  }
];

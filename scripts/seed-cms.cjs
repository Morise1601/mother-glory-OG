const fs = require('fs');
const envContent = fs.readFileSync('.env.local', 'utf8');
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx > 0) {
    const k = trimmed.slice(0, eqIdx).trim();
    let v = trimmed.slice(eqIdx + 1).trim();
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
    process.env[k] = v;
  }
}

const { createClient } = require('@supabase/supabase-js');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const db = createClient(url, key, { auth: { persistSession: false } });

// Content defaults from lib/data/content-defaults.ts
const INITIAL_BANNERS = [
  {
    id: 'banner-1',
    title: 'Your ambition. Our commitment.',
    description: 'Focused guidance. Disciplined learning. A stronger foundation for your medical career at our centres in Puducherry and Karaikal.',
    desktopImageUrl: '/images/hero_banner_mg.webp',
    focalPoint: 'center',
    ctaLabel: 'Explore Programs',
    ctaUrl: '/programs',
    secondaryCtaLabel: 'View Achievements',
    secondaryCtaUrl: '/achievements',
    status: 'visible',
    sortOrder: 1,
    version: 1,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'banner-2',
    title: 'Expert Coaching for a Brighter Tomorrow',
    description: 'Disciplined classroom pedagogy, daily doubt-clearing, and personalized faculty mentorship designed for top NEET qualification.',
    desktopImageUrl: '/images/campus_pondicherry.webp',
    focalPoint: 'center',
    ctaLabel: 'Admissions Open',
    ctaUrl: '/contact',
    secondaryCtaLabel: 'About Us',
    secondaryCtaUrl: '/about',
    status: 'visible',
    sortOrder: 2,
    version: 1,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'banner-3',
    title: 'Milestones of Excellence & Recognition',
    description: 'Empowering aspirants from Puducherry, Karaikal and beyond into premier government medical colleges.',
    desktopImageUrl: '/images/achievements/1.webp',
    focalPoint: 'center',
    ctaLabel: 'View Results',
    ctaUrl: '/achievements',
    secondaryCtaLabel: 'Plan Next Step',
    secondaryCtaUrl: '/contact',
    status: 'visible',
    sortOrder: 3,
    version: 1,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'banner-4',
    title: 'Modern Learning Spaces & Campus Facilities',
    description: 'Equipped tutorial classrooms, dedicated reading zones and personalized student support in Karaikal.',
    desktopImageUrl: '/images/campus_karaikal.webp',
    focalPoint: 'center',
    ctaLabel: 'Visit Campus',
    ctaUrl: '/about',
    secondaryCtaLabel: 'Enquire',
    secondaryCtaUrl: '/contact',
    status: 'visible',
    sortOrder: 4,
    version: 1,
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_FOUNDERS = [
  {
    id: 'founder-antoine-prabhu',
    name: 'M. Antoine@Prabhu',
    title: 'Founder & Managing Director',
    qualifications: 'M.Sc., M.Ed., M.Phil. — Academic Director',
    biography:
      'With over a decade and a half of dedicated educational leadership in medical entrance coaching, M. Antoine@Prabhu has shaped the instructional methodology that defines Mother Glory. His approach balances conceptual rigor with empathetic student mentorship, guiding aspirants through every phase of the competitive journey.',
    message:
      'Education is a service to society. We are committed to guiding students with sincerity, structure and unwavering support.',
    portraitUrl: '/images/founder-final.webp',
    sortOrder: 1,
    status: 'published',
    version: 1,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'founder-robert-clyive',
    name: 'Mr. Robert Clyive',
    title: 'Chairman & Managing Trustee',
    qualifications: 'Managing Trustee & Educational Administrator',
    biography:
      'As Chairman and Managing Trustee, Mr. Robert Clyive oversees institutional vision, infrastructure, and student welfare across our campuses in Puducherry and Karaikal. His stewardship ensures disciplined learning environments equipped with modern pedagogical facilities.',
    message:
      'Our goal is to create a learning environment where every student discovers their potential and moves forward with confidence.',
    portraitUrl: '/images/cofounder-final.webp',
    sortOrder: 2,
    status: 'published',
    version: 1,
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_PROGRAMS = [
  {
    id: 'prog-neet-ug',
    slug: 'neet-ug',
    title: 'NEET UG Comprehensive Program',
    tagline: 'Focused classroom training for Class 11 & 12 students aiming for top medical colleges.',
    category: 'neet_ug',
    targetAudience: 'Class 11 & 12 Appearing Students',
    overview:
      'The NEET UG Comprehensive Program is built on our core philosophy of disciplined learning and concept clarity. Designed to sync seamlessly with board curricula while mastering competitive NEET patterns, it provides in-depth instruction in Physics, Chemistry, and Biology accompanied by topic-wise assessments and dedicated doubt resolution.',
    eligibility: 'Students entering or currently studying in Class 11 or Class 12 with PCB stream.',
    curriculum: [
      'NCERT Line-by-Line Mastery & Conceptual Deep-Dive',
      'Daily Practice Problem (DPP) Sessions & Rapid Fire Drills',
      'OMR Pattern Grand Mock Tests with Negative Marking Simulation',
      'Detailed Post-Exam Analytics & Personal Rank Improvement Roadmaps',
    ],
    features: [
      'Comprehensive NEET syllabus coverage with Class 11/12 synchronization',
      'Experienced and dedicated permanent faculty panel',
      'Daily doubt-clearing sessions and 1-on-1 academic mentorship',
      'Regular test series with detailed performance analytics',
      'Disciplined, distraction-free study room environments',
    ],
    scheduleNotice: 'Weekday & Weekend Batches Available. Admissions open for current academic year.',
    campuses: ['puducherry', 'karaikal'],
    imageUrl: '/images/hero_banner_mg.webp',
    status: 'published',
    sortOrder: 1,
    version: 1,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prog-repeater-batch',
    slug: 'repeater-batch',
    title: 'Repeaters & Droppers Intensive Program',
    tagline: 'High-intensity coaching crafted for dedicated droppers aiming to maximize their NEET score.',
    category: 'repeater',
    targetAudience: '12th Passed / Dedicated Dropper Aspirants',
    overview:
      'Our Flagship Repeaters Batch is tailored specifically for students taking a dedicated preparation year to qualify for government medical seats. Emphasizing strategic speed, error analysis, and daily test drills, this program bridges academic gaps with rigorous faculty oversight.',
    eligibility: 'Students who have passed Class 12 PCB and are retaking NEET to elevate their score.',
    curriculum: [
      'Comprehensive Syllabus Acceleration (August to February)',
      'Intensive Full-Length Test Drills & Time Management Calibration',
      'High-Yield Topic Prioritization & Formula Precision Workshops',
      'Individual Weakness Eradication with Senior Department Heads',
    ],
    features: [
      'High-frequency test series with identical NTA exam interface',
      'Focused revision modules with error-log tracking',
      'Personalized score enhancement mentorship by senior doctors',
      'Exclusive doubt counters open till 8:00 PM IST',
      'Hostel tie-up guidance for outstation students',
    ],
    scheduleNotice: 'Full-day classroom program (8:30 AM to 5:00 PM IST, Monday to Saturday).',
    campuses: ['puducherry', 'karaikal'],
    imageUrl: '/images/achievements/2.webp',
    status: 'published',
    sortOrder: 2,
    version: 1,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prog-foundation',
    slug: 'foundation-program',
    title: 'Pre-Medical Foundation Program (Class 9 & 10)',
    tagline: 'Strong conceptual base and scientific temper for early medical aspirants.',
    category: 'foundation',
    targetAudience: 'Class 9 & 10 Students',
    overview:
      'Early preparation builds lasting confidence. The Foundation Program instills structured analytical thinking, logical problem-solving, and a deep appreciation for science fundamentals, ensuring smooth progression into Class 11 and 12 competitive prep.',
    eligibility: 'School students enrolled in Class 9 or 10 wanting an early start.',
    curriculum: [
      'Fundamental Physics, Chemistry, Biology & Mathematical Aptitude',
      'NTSE, Olympiad and Science Talent Examination Exposure',
      'Critical Thinking & Analytical Reasoning Development',
      'Visual Concept Learning & Laboratory Demonstrations',
    ],
    features: [
      'Non-stressful weekend-only schedule aligned with school exams',
      'Interactive visual teaching methods and smart classroom aids',
      'Regular parent-teacher feedback and academic progress reviews',
      'Early habit-building for time management and exam strategy',
    ],
    scheduleNotice: 'Weekend Batches (Saturday evening & Sunday morning).',
    campuses: ['puducherry'],
    imageUrl: '/images/achievements/4.webp',
    status: 'published',
    sortOrder: 3,
    version: 1,
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_ACHIEVEMENTS = [
  {
    id: 'ach-1',
    slug: 'neet-top-ranks-celebration-2024',
    title: 'Outstanding Performance in NEET 2024',
    year: 2024,
    category: 'Academic',
    campus: 'Both',
    summary: 'Our dedicated students secured stellar scores and state-level recognition in the NEET 2024 entrance examination.',
    caption: 'Official felicitation ceremony celebrating student determination, faculty guidance, and medical entrance success across Puducherry and Karaikal centres.',
    imageUrl: '/images/achievements/1.webp',
    altText: 'Mother Glory NEET 2024 top achievers felicitation banner showing student qualifiers and results.',
    featured: true,
    verificationStatus: 'verified',
    consentStatus: 'obtained',
    status: 'published',
    sortOrder: 1,
    version: 1,
    createdAt: '2024-06-15T10:00:00Z',
    updatedAt: '2024-06-15T10:00:00Z',
  },
  {
    id: 'ach-2',
    slug: 'repeaters-batch-distinction-honors',
    title: 'Repeaters Batch High Distinction Achievers',
    year: 2024,
    category: 'Awards',
    campus: 'Puducherry',
    summary: 'Dedicated dropper students achieved remarkable score elevation, earning government medical college seats.',
    caption: 'Annual award presentation for students demonstrating over 200+ score improvement through disciplined test-series practice.',
    imageUrl: '/images/achievements/2.webp',
    altText: 'Repeaters batch distinction winners with faculty and management.',
    featured: true,
    verificationStatus: 'verified',
    consentStatus: 'obtained',
    status: 'published',
    sortOrder: 2,
    version: 1,
    createdAt: '2024-07-02T11:00:00Z',
    updatedAt: '2024-07-02T11:00:00Z',
  },
  {
    id: 'ach-3',
    slug: 'karaikal-centre-toppers-recognition',
    title: 'Karaikal Campus Medical Aspirants Distinction',
    year: 2024,
    category: 'Academic',
    campus: 'Karaikal',
    summary: 'Outstanding academic achievements and medical seat allocations from our Karaikal branch.',
    caption: 'Celebrating our regional qualifiers who proved that focused preparation leads to premier medical admissions.',
    imageUrl: '/images/achievements/3.webp',
    altText: 'Karaikal campus medical aspirants holding merit certificates.',
    featured: true,
    verificationStatus: 'verified',
    consentStatus: 'obtained',
    status: 'published',
    sortOrder: 3,
    version: 1,
    createdAt: '2024-07-18T10:00:00Z',
    updatedAt: '2024-07-18T10:00:00Z',
  },
  {
    id: 'ach-4',
    slug: 'annual-merit-scholarship-felicitation',
    title: 'Merit Scholarship & Recognition Ceremony',
    year: 2023,
    category: 'Awards',
    campus: 'Both',
    summary: 'Recognizing academic excellence and awarding tuition scholarships to deserving meritorious students.',
    caption: 'Institution leadership presenting merit scholarships and learning support to high-performing aspirants.',
    imageUrl: '/images/achievements/4.webp',
    altText: 'Merit scholarship presentation ceremony with management and students.',
    featured: false,
    verificationStatus: 'verified',
    consentStatus: 'obtained',
    status: 'published',
    sortOrder: 4,
    version: 1,
    createdAt: '2023-08-10T10:00:00Z',
    updatedAt: '2023-08-10T10:00:00Z',
  },
  {
    id: 'ach-5',
    slug: 'neet-awareness-and-career-seminar',
    title: 'NEET Awareness & Career Guidance Seminar',
    year: 2023,
    category: 'Events',
    campus: 'Puducherry',
    summary: 'Comprehensive interactive workshop guiding parents and students through competitive exam strategy.',
    caption: 'Keynote sessions on exam temperament, stress management, and syllabus planning for Class 11 and 12 students.',
    imageUrl: '/images/achievements/5.webp',
    altText: 'Audience and speakers at the Mother Glory NEET Awareness and Guidance seminar.',
    featured: false,
    verificationStatus: 'verified',
    consentStatus: 'obtained',
    status: 'published',
    sortOrder: 5,
    version: 1,
    createdAt: '2023-11-05T14:00:00Z',
    updatedAt: '2023-11-05T14:00:00Z',
  },
  {
    id: 'ach-6',
    slug: 'grand-mock-test-champions-2023',
    title: 'All-Centre Grand Mock Test Champions',
    year: 2023,
    category: 'Academic',
    campus: 'Both',
    summary: 'Top scorers in our simulated full-length NEET grand mock examination series.',
    caption: 'Fostering healthy academic competition and time management under authentic test conditions.',
    imageUrl: '/images/achievements/6.webp',
    altText: 'Grand mock test rank holders receiving trophies and certificates.',
    featured: false,
    verificationStatus: 'verified',
    consentStatus: 'obtained',
    status: 'published',
    sortOrder: 6,
    version: 1,
    createdAt: '2023-12-20T12:00:00Z',
    updatedAt: '2023-12-20T12:00:00Z',
  },
  {
    id: 'ach-7',
    slug: 'medical-career-orientation-initiative',
    title: 'Medical Career Pathway Workshop',
    year: 2022,
    category: 'Initiatives',
    campus: 'Karaikal',
    summary: 'Special initiative connecting aspiring doctors with alumni doctors and senior faculty mentors.',
    caption: 'Interactive Q&A session discussing life in government medical colleges and medical specializations.',
    imageUrl: '/images/achievements/7.webp',
    altText: 'Doctor alumni mentoring aspiring students at the career orientation session.',
    featured: false,
    verificationStatus: 'verified',
    consentStatus: 'obtained',
    status: 'published',
    sortOrder: 7,
    version: 1,
    createdAt: '2022-09-12T10:00:00Z',
    updatedAt: '2022-09-12T10:00:00Z',
  },
  {
    id: 'ach-8',
    slug: 'biology-olympiad-and-merit-honors',
    title: 'Science & Biology Merit Distinctions',
    year: 2022,
    category: 'Awards',
    campus: 'Puducherry',
    summary: 'Celebrating students who achieved top percentiles in regional and national science aptitude assessments.',
    caption: 'Honoring foundational curiosity and rigorous analytical preparation.',
    imageUrl: '/images/achievements/8.webp',
    altText: 'Mother Glory students honored for science and biology distinctions.',
    featured: false,
    verificationStatus: 'verified',
    consentStatus: 'obtained',
    status: 'published',
    sortOrder: 8,
    version: 1,
    createdAt: '2022-11-25T11:00:00Z',
    updatedAt: '2022-11-25T11:00:00Z',
  },
  {
    id: 'ach-9',
    slug: 'decennial-academic-excellence-milestone',
    title: 'Over 16 Years of Dedicated NEET Guidance',
    year: 2021,
    category: 'Initiatives',
    campus: 'Both',
    summary: 'A milestone commemoration honoring educators, parents, and medical alumni across Puducherry and Karaikal.',
    caption: 'Continuing our commitment to providing structured, ethical, and high-impact medical entrance coaching.',
    imageUrl: '/images/achievements/9.webp',
    altText: 'Commemorative academic gathering of faculty and students.',
    featured: false,
    verificationStatus: 'verified',
    consentStatus: 'obtained',
    status: 'published',
    sortOrder: 9,
    version: 1,
    createdAt: '2021-12-10T10:00:00Z',
    updatedAt: '2021-12-10T10:00:00Z',
  },
];

const DEFAULT_SETTINGS = {
  siteTitle: 'Mother Glory Coaching & Tutorial Centre | NEET Institute in Puducherry & Karaikal',
  institutionName: 'Mother Glory Coaching & Tutorial Centre',
  tagline: 'Discipline • Guidance • Higher Goals — For a Brighter Tomorrow',
  canonicalOrigin: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.motherglory.com',
  announcementNotice: 'Contact our Puducherry and Karaikal centres for current admissions and batch availability.',
  showAnnouncement: true,
  puducherryPlaceId: process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID_PUDUCHERRY || 'ChIJu_bO33dhUzoR6ULpTx3jkbk',
  karaikalPlaceId: process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID_KARAIKAL || 'ChIJ0RMnMEwRVToRx6r0pDqIJRo',
  contactPhones: ['+91 98428 23195', '+91 98944 23195'],
  contactEmail: 'admissions@motherglory.edu',
  workingHours: 'Mon–Sat 8:00 AM–5:00 PM IST',
  seoDescription:
    'Mother Glory Coaching & Tutorial Centre provides expert, disciplined NEET coaching, foundation courses, and repeaters programs in Puducherry and Karaikal.',
  updatedAt: new Date().toISOString(),
};

async function seed() {
  console.log('Seeding Supabase app_settings table with CMS content...');

  const items = [
    { key: 'public_cms.banners', value: INITIAL_BANNERS },
    { key: 'public_cms.founders', value: INITIAL_FOUNDERS },
    { key: 'public_cms.programs', value: INITIAL_PROGRAMS },
    { key: 'public_cms.achievements', value: INITIAL_ACHIEVEMENTS },
    { key: 'public_cms.settings', value: DEFAULT_SETTINGS },
    {
      key: 'public_cms.welcome_popup',
      value: {
        isEnabled: true,
        title: 'Admissions Open 2026–2027',
        subtitle: "Puducherry & Karaikal's Premier NEET Institute — Scholarship test & batch registrations open.",
        posterImageUrl: '/images/hero_banner_mg.webp',
        posterAltText: 'Admissions Open 2026-2027 Poster',
        aspectRatio: '16:9',
        ctaLabel: 'Explore Programs',
        ctaUrl: '/programs',
        showEnquiryButton: true,
        frequency: 'once_per_session',
        version: 1,
        updatedAt: new Date().toISOString(),
      },
    },
  ];

  for (const { key, value } of items) {
    const record = {
      setting_key: key,
      setting_value: value,
      is_public: false,
      updated_at: new Date().toISOString(),
    };

    const { data: existing } = await db.from('app_settings').select('setting_key').eq('setting_key', key).maybeSingle();
    if (existing) {
      const { error: updErr } = await db.from('app_settings').update(record).eq('setting_key', key);
      console.log(`Updated [${key}]:`, updErr ? updErr.message : 'SUCCESS');
    } else {
      const { error: insErr } = await db.from('app_settings').insert(record);
      console.log(`Inserted [${key}]:`, insErr ? insErr.message : 'SUCCESS');
    }
  }

  const { data: all } = await db.from('app_settings').select('setting_key, updated_at');
  console.log('\nFinal app_settings rows in Supabase:');
  console.log(all);
}

seed().catch(console.error);


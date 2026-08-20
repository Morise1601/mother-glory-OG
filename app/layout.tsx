import type { Metadata, Viewport } from "next";
import { Sora, Outfit } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#090d16",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Mother Glory Coaching & Tutorial Centre | NEET Coaching in Karaikal & Puducherry",
  description:
    "Best NEET Coaching in Karaikal & Puducherry | Mother Glory Coaching & Tutorial Centre",
  keywords: [
    "Mother Glory Coaching & Tutorial Centre",
    "Mother Glory",
    "Mother Glory NEET Coaching center",
    "Best NEET Coaching in Karaikal",
    "Best NEET Coaching in Puducherry",
    "NEET Academy Karaikal",
    "NEET Academy Pondicherry",
    "Medical Entrance Coaching Puducherry",
    "JIPMER Entrance Coaching Karaikal",
    "AIIMS Coaching Puducherry",
    "Top NEET Repeaters Batch Karaikal",
    "NEET Test Series Puducherry",
  ],
  authors: [{ name: "Mother Glory Coaching & Tutorial Centre" }],
  creator: "Mother Glory Coaching & Tutorial Centre",
  publisher: "Mother Glory Coaching & Tutorial Centre",
  metadataBase: new URL("https://motherglory.edu"),
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/images/favicons/favicon.ico" },
      { url: "/images/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/images/favicons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "icon",
        url: "/images/favicons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/images/favicons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Mother Glory Coaching & Tutorial Centre | NEET Coaching Centre",
    description:
      "Best NEET Coaching in Karaikal & Puducherry | Mother Glory Coaching & Tutorial Centre",
    url: "https://motherglory.edu",
    siteName: "Mother Glory Coaching & Tutorial Centre",
    images: [
      {
        url: "/images/hero_banner_mg.png",
        width: 1200,
        height: 630,
        alt: "Mother Glory Coaching & Tutorial Centre Interactive Campus Classroom",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mother Glory Coaching & Tutorial Centre | NEET Coaching Centre",
    description:
      "Best NEET Coaching in Karaikal & Puducherry | Mother Glory Coaching & Tutorial Centre",
    images: ["/images/gallery/gallery-1.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "@id": "https://motherglory.edu/#organization",
      name: "Mother Glory Coaching & Tutorial Centre",
      url: "https://motherglory.edu",
      logo: "https://motherglory.edu/images/logo_mg.png",
      image: "https://motherglory.edu/images/hero_banner_mg.png",
      description:
        "Best NEET Coaching in Karaikal & Puducherry | Mother Glory Coaching & Tutorial Centre",
      telephone: "+91 98428 23195",
      email: "admissions@motherglory.edu",
      address: [
        {
          "@type": "PostalAddress",
          streetAddress: "11, 1st Cross, Subaiya Nagar, Sanjay Gandhi Nagar, Pudupalaiyam",
          addressLocality: "Puducherry",
          postalCode: "605001",
          addressCountry: "IN",
        },
        {
          "@type": "PostalAddress",
          streetAddress: "171, Church St",
          addressLocality: "Karaikal",
          postalCode: "609602",
          addressRegion: "Puducherry",
          addressCountry: "IN",
        },
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "520",
        bestRating: "5",
        worstRating: "1",
      },
      sameAs: [
        "https://www.facebook.com/mothergloryneetacademykaraikal",
        "https://www.instagram.com/mother_glory_official?igsh=aTVuOWNueXNqd2h6",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Course",
      name: "NEET UG Entrance Coaching Course",
      description:
        "Specialized intensive NEET UG medical entrance coaching program covering Physics, Chemistry, and Biology with daily practice problems, mock tests, and expert mentorship.",
      provider: {
        "@type": "EducationalOrganization",
        name: "Mother Glory Coaching & Tutorial Centre",
        url: "https://motherglory.edu",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Why is Mother Glory Coaching Centre considered the best NEET coaching in Karaikal and Puducherry?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Mother Glory Coaching & Tutorial Centre has a proven 16+ year track record of excellence with over 3,000+ students clearing NEET eligibility marks and 1,000+ securing medical college seats.",
          },
        },
        {
          "@type": "Question",
          name: "What courses are offered at Mother Glory Coaching Centre?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We offer NEET UG Coaching, Foundation Courses for Class 9 & 10, Board & Entrance prep for Class 11 & 12, and dedicated Repeater / Dropper batches.",
          },
        },
        {
          "@type": "Question",
          name: "Where are Mother Glory Coaching Centre campuses located?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Our campuses are located in Puducherry (Subaiya Nagar, Pudupalaiyam) and Karaikal (171, Church Street).",
          },
        },
      ],
    },
  ];

  return (
    <html
      lang="en"
      className={`${sora.variable} ${outfit.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}

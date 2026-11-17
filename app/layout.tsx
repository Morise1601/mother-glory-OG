import type { Metadata, Viewport } from "next";
import "./globals.css";
import MobileStickyBar from "@/components/MobileStickyBar";
import SiteSettingsProvider from "@/components/public/SiteSettingsProvider";
import { getSiteSettings } from "@/lib/data/settings";
import { getCampuses } from "@/lib/data/campuses";
export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  themeColor: "#090d16",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const baseMetadata: Metadata = {
  title: "Mother Glory Coaching & Tutorial Centre | Best NEET Coaching in Puducherry & Karaikal",
  description:
  "Best NEET Coaching in Puducherry & Karaikal. Over a decade and a half of medical entrance excellence, intensive repeaters batch, pre-medical foundation courses, and expert faculty.",
  keywords: [
    "Mother Glory Coaching & Tutorial Centre",
    "Mother Glory NEET Academy",
    "Mother Glory",
    "Best NEET Coaching in Puducherry",
    "Best NEET Coaching in Karaikal",
    "NEET Academy Pondicherry",
    "NEET Academy Karaikal",
    "Medical Entrance Coaching Puducherry",
    "NEET Repeater Batch Puducherry",
    "NEET Dropper Batch Karaikal",
    "JIPMER Entrance Coaching",
    "AIIMS NEET Coaching Puducherry",
    "NEET Test Series Puducherry",
    "NEET Crash Course Puducherry",
    "Top Medical Coaching Center Near Me",
  ],
  authors: [{ name: "Mother Glory Coaching & Tutorial Centre", url: "https://www.motherglory.com" }],
  creator: "Mother Glory Coaching & Tutorial Centre",
  publisher: "Mother Glory Coaching & Tutorial Centre",
  metadataBase: new URL("https://www.motherglory.com"),
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
    title: "Mother Glory Coaching & Tutorial Centre | Best NEET Coaching in Puducherry & Karaikal",
    description:
    "Premier NEET medical entrance coaching institute in Puducherry and Karaikal. Structured repeaters batch, pre-medical foundation, and proven results.",
    url: "https://www.motherglory.com",
    siteName: "Mother Glory Coaching & Tutorial Centre",
    images: [
      {
        url: "/images/hero_banner_mg.webp",
        width: 1200,
        height: 630,
        alt: "Mother Glory Coaching & Tutorial Centre Interactive Campus Classroom",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mother Glory Coaching & Tutorial Centre | NEET Coaching Centre",
    description:
    "Best NEET Coaching in Puducherry & Karaikal | Mother Glory Coaching & Tutorial Centre",
    images: ["/images/hero_banner_mg.webp"],
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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    ...baseMetadata, title: settings.siteTitle, description: settings.seoDescription,
    metadataBase: new URL(settings.canonicalOrigin),
    openGraph: { ...baseMetadata.openGraph, title: settings.siteTitle, description: settings.seoDescription, url: settings.canonicalOrigin, siteName: settings.institutionName },
    twitter: { ...baseMetadata.twitter, title: settings.siteTitle, description: settings.seoDescription },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, campuses] = await Promise.all([getSiteSettings(), getCampuses()]);
  const siteUrl = (settings.canonicalOrigin || "https://www.motherglory.com").replace(/\/$/, "");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${siteUrl}/#organization`,
    name: settings.institutionName,
    alternateName: [
      "Mother Glory NEET Academy",
      "Mother Glory Coaching Center",
      "Mother Glory Coaching & Tutorial Centre Karaikal",
      "Mother Glory Coaching Centre Puducherry",
      "MGCT Puducherry",
      "MGCT Karaikal",
    ],
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/images/logo_mg.webp`,
      caption: "Mother Glory Coaching & Tutorial Centre Seal",
    },
    image: `${siteUrl}/images/hero_banner_mg.webp`,
    description: settings.seoDescription,
    telephone: settings.contactPhones?.[0] || "+91 98428 23195",
    email: settings.contactEmail,
    sameAs: [
      "https://www.facebook.com/mothergloryneetacademykaraikal",
      "https://www.instagram.com/mother_glory_official?igsh=aTVuOWNueXNqd2h6",
      "https://www.youtube.com/@mothergloryneetacademy",
    ],
    areaServed: [
      { "@type": "City", name: "Puducherry" },
      { "@type": "City", name: "Karaikal" },
      { "@type": "State", name: "Tamil Nadu" },
      { "@type": "Country", name: "India" },
    ],
    knowsAbout: [
      "NEET UG Medical Entrance Preparation",
      "NEET Repeaters & Dropper Coaching",
      "Pre-Medical Foundation Courses for Class 9 and 10",
      "Physics for Medical Entrance",
      "Chemistry for NEET",
      "Botany and Zoology NEET Syllabus",
      "JIPMER Entrance Guidance",
      "AIIMS Medical Entrance Preparation",
    ],
    address: campuses.map((campus) => ({
      "@type": "PostalAddress",
      streetAddress: campus.address,
      addressLocality: campus.city,
      addressRegion: campus.state,
      postalCode: campus.postalCode,
      addressCountry: "IN",
    })),
    subOrganization: campuses.map((campus) => {
      const isPuducherry = campus.slug === "puducherry" || campus.city.toLowerCase().includes("puducherry");
      return {
        "@type": "LocalBusiness",
        "@id": `${siteUrl}/#${campus.slug}-campus`,
        name: `${settings.institutionName} - ${campus.name}`,
        image: `${siteUrl}${campus.imageUrl || "/images/hero_banner_mg.webp"}`,
        telephone: campus.phone,
        email: campus.email || settings.contactEmail,
        hasMap: campus.mapsUrl,
        address: {
          "@type": "PostalAddress",
          streetAddress: campus.address,
          addressLocality: campus.city,
          addressRegion: campus.state,
          postalCode: campus.postalCode,
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: isPuducherry ? 11.931086 : 10.9254,
          longitude: isPuducherry ? 79.809073 : 79.8329,
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "08:00",
          closes: "17:00",
        },
      };
    }),
  };

  return (
    <html
      lang="en"
      className="h-full antialiased scroll-smooth"
      data-scroll-behavior="smooth"
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 antialiased pb-16 sm:pb-0">
        <SiteSettingsProvider settings={settings}>
          {children}
          <MobileStickyBar />
        </SiteSettingsProvider>
      </body>
    </html>
  );
}

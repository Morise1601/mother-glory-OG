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
        url: "/images/hero_banner_mg.webp",
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
    images: ["/images/gallery/gallery-1.webp"],
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
  const jsonLd = {
    "@context": "https://schema.org", "@type": "EducationalOrganization",
    "@id": settings.canonicalOrigin + "/#organization", name: settings.institutionName,
    url: settings.canonicalOrigin, logo: settings.canonicalOrigin + "/images/logo_mg.webp",
    description: settings.seoDescription, telephone: settings.contactPhones?.[0] || '+91 98428 23195', email: settings.contactEmail,
    address: campuses.map(campus => ({ "@type": "PostalAddress", streetAddress: campus.address,
      addressLocality: campus.city, addressRegion: campus.state, postalCode: campus.postalCode, addressCountry: "IN" })),
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

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
  title: "Mother Glory | Empowering Minds & Shaping Bright Futures",
  description:
    "Mother Glory is a premier educational institution dedicated to academic excellence, STEM innovation, robotics, athletics, and holistic student development.",
  keywords: [
    "Mother Glory",
    "Mother Glory School",
    "Best School STEM Education",
    "Robotics School Lab",
    "Interactive Gallery Slider",
    "Holistic School Admissions",
    "Quality Education Academy",
  ],
  authors: [{ name: "Mother Glory Institutions" }],
  creator: "Mother Glory",
  publisher: "Mother Glory",
  metadataBase: new URL("https://motherglory.edu"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Mother Glory | Premier Educational Institution",
    description:
      "Explore Mother Glory's state-of-the-art campus, smart classrooms, robotics labs, and vibrant student gallery.",
    url: "https://motherglory.edu",
    siteName: "Mother Glory",
    images: [
      {
        url: "/images/gallery/gallery-1.png",
        width: 1200,
        height: 630,
        alt: "Mother Glory Interactive Campus Classroom",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mother Glory | Empowering Minds & Shaping Bright Futures",
    description:
      "Mother Glory provides world-class education, robotics labs, multi-sport facilities, and holistic character building.",
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Mother Glory",
    url: "https://motherglory.edu",
    logo: "https://motherglory.edu/images/Logo%20bg%20removed.png",
    image: "https://motherglory.edu/images/gallery/gallery-1.png",
    description:
      "Mother Glory is a premier educational institution providing STEM, robotics, athletics, and holistic character education.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Main Knowledge Hub Road, Sector 12",
      addressLocality: "Education City",
      addressCountry: "IN",
    },
    telephone: "+1-800-123-4567",
    sameAs: [
      "https://facebook.com",
      "https://instagram.com",
      "https://twitter.com",
    ],
  };

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

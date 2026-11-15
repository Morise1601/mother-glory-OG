import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | Mother Glory NEET Academy",
  description: "Secure access to Mother Glory NEET Academy management portal.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen bg-[#FAF8F3] text-[#172033]">
      {children}
    </div>
  );
}

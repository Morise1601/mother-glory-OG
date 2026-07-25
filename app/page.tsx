import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import FounderSection from "@/components/FounderSection";
import FeaturesSection from "@/components/FeaturesSection";
import GallerySection from "@/components/GallerySection";
import TestimonialSection from "@/components/TestimonialSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-[#122452]/30 selection:text-amber-400">
      {/* Header & Navigation */}
      <Navbar />

      {/* Main Single-Page Content */}
      <main className="flex-grow">
        <Hero />
        <AboutSection />
        <FounderSection />
        <FeaturesSection />
        <GallerySection />
        <TestimonialSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

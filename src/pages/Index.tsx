import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CinematicVideo from "@/components/CinematicVideo";
import PhilosophySection from "@/components/PhilosophySection";
import ProductShowcase from "@/components/ProductShowcase";
import { lazy, Suspense } from "react";
import FounderDrop from "@/components/FounderDrop";
import WaitlistSection from "@/components/WaitlistSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

const Watch3D = lazy(() => import("@/components/Watch3D"));

const Index = () => {
  return (
    <>
      <Header />
      <main id="main" className="bg-background min-h-screen">
        <HeroSection />
        <CinematicVideo />
        <PhilosophySection />
        <ProductShowcase />
        <Suspense fallback={<div className="h-[500px] flex items-center justify-center text-muted-foreground text-sm animate-pulse">Loading 3D Experience...</div>}>
          <Watch3D />
        </Suspense>
        <FounderDrop />
        <WaitlistSection />
        <TestimonialsSection />
        <Footer />
      </main>
    </>
  );
};


export default Index;

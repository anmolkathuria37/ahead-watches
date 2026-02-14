import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PhilosophySection from "@/components/PhilosophySection";
import ProductShowcase from "@/components/ProductShowcase";
import FounderDrop from "@/components/FounderDrop";
import WaitlistSection from "@/components/WaitlistSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
// import AHEADvideo from "@/components/AHEADvideo";

const Index = () => {
  return (
    <main className="bg-background min-h-screen">
      <Header />
      <HeroSection />
      {/* <AHEADvideo /> */}
      <PhilosophySection />
      <ProductShowcase />
      <FounderDrop />
      <WaitlistSection />
      <TestimonialsSection />
      <Footer />
    </main>
  );
};

export default Index;

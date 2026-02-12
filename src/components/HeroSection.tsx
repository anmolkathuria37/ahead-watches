import { motion } from "framer-motion";
import aheadLogo from "@/assets/ahead-logo.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center hero-gradient-bg overflow-hidden">
      {/* Animated background streaks */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-glow/5 blur-[120px] animate-pulse_glow" />
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full bg-steel-dark/10 blur-[100px] animate-pulse_glow" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <img
            src={aheadLogo}
            alt="AHEAD - Be Ahead Of Time"
            className="mx-auto h-16 md:h-24 lg:h-28 w-auto mb-8"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-muted-foreground text-lg md:text-xl tracking-wide max-w-xl mx-auto mb-12 font-light"
        >
          Worn by the ambitious. Built for the early movers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#waitlist"
            className="bg-gradient-steel text-primary-foreground px-8 py-3.5 text-sm font-semibold tracking-widest uppercase rounded-sm hover:opacity-90 transition-all duration-300 hover:shadow-[0_0_30px_-5px_hsl(220_20%_60%/0.3)]"
          >
            Apply For Founder Access
          </a>
          <a
            href="#collection"
            className="border border-border text-foreground px-8 py-3.5 text-sm font-semibold tracking-widest uppercase rounded-sm hover:bg-secondary transition-all duration-300"
          >
            Explore The Early Series
          </a>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;

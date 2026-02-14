import { motion } from "framer-motion";
import aheadLogo from "@/assets/ahead-logo.png";
import heroWatch from "@/assets/hero-watch.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero background image */}
      <div className="absolute inset-0">
        <img
          src={heroWatch}
          alt=""
          className="w-full h-full object-cover object-center"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20" />
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

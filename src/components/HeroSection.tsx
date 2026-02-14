// import { motion } from "framer-motion";
// import heroWatch from "@/assets/hero-watch.jpg";

// const HeroSection = () => {
//   return (
//     <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
//       {/* Hero background image */}
//       <div className="absolute inset-0">
//         <img
//           src={heroWatch}
//           alt=""
//           className="w-full h-full object-cover object-center"
//           aria-hidden="true"
//         />
//         <div className="absolute inset-0 bg-background/60" />
//         <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20" />
//       </div>

//       <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
//         {/* Brand Name */}
//         <motion.h1
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 1.2, ease: "easeOut" }}
//           className="font-display text-7xl sm:text-8xl md:text-9xl font-bold tracking-[0.08em] uppercase mb-2 hero-brand-text select-none"
//           aria-label="AHEAD Watches"
//         >
//           <span className="inline-block italic" style={{ fontStyle: 'italic' }}>A</span>
//           <span>HEAD</span>
//         </motion.h1>

//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.8, delay: 0.6 }}
//           className="font-display text-base sm:text-lg md:text-xl tracking-[0.35em] uppercase text-steel-light/70 font-medium mb-10"
//         >
//           Watches
//         </motion.p>

//         {/* Tagline with decorative lines */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.9 }}
//           className="flex items-center justify-center gap-4 md:gap-6 mb-14"
//         >
//           <div className="h-px w-10 md:w-20 bg-gradient-to-r from-transparent to-steel" />
//           <p className="text-sm sm:text-base md:text-lg tracking-[0.4em] uppercase text-steel-light font-medium drop-shadow-[0_0_12px_hsl(220_20%_70%/0.5)] whitespace-nowrap">
//             Be Ahead Of Time
//           </p>
//           <div className="h-px w-10 md:w-20 bg-gradient-to-l from-transparent to-steel" />
//         </motion.div>

//         <motion.p
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 1.2 }}
//           className="text-muted-foreground text-lg md:text-xl tracking-wide max-w-xl mx-auto mb-12 font-light"
//         >
//           Worn by the ambitious. Built for the early movers.
//         </motion.p>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 1.5 }}
//           className="flex flex-col sm:flex-row gap-4 justify-center"
//         >
//           <a
//             href="#waitlist"
//             className="bg-gradient-steel text-primary-foreground px-8 py-3.5 text-sm font-semibold tracking-widest uppercase rounded-sm hover:opacity-90 transition-all duration-300 hover:shadow-[0_0_30px_-5px_hsl(220_20%_60%/0.3)]"
//           >
//             Apply For Founder Access
//           </a>
//           <a
//             href="#collection"
//             className="border border-border text-foreground px-8 py-3.5 text-sm font-semibold tracking-widest uppercase rounded-sm hover:bg-secondary transition-all duration-300"
//           >
//             Explore The Early Series
//           </a>
//         </motion.div>
//       </div>

//       {/* Bottom fade */}
//       <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
//     </section>
//   );
// };

// export default HeroSection;




import { motion } from "framer-motion";
import heroWatch from "@/assets/hero-watch.jpg";

const brandContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,   // tighter, more premium
      delayChildren: 0.15,
    },
  },
};

const brandLetter = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1], // cubic-bezier → luxury feel
    },
  },
};


export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background */}
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

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">

        {/* BRAND NAME */}
        <motion.h1
          variants={brandContainer}
          initial="hidden"
          animate="show"
          className="font-display text-7xl sm:text-8xl md:text-9xl font-bold tracking-[0.08em] uppercase mb-2 select-none"
          aria-label="AHED Watches"
        >
          <motion.span
            variants={brandLetter}
            className="inline-block italic mr-1 "
          >
            A
          </motion.span>

          {"HED".split("").map((char, i) => (
            <motion.span
              key={i}
              variants={brandLetter}
              className="inline-block "
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>

        {/* SUB BRAND */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="font-display text-base sm:text-lg tracking-[0.35em] uppercase text-steel-light/70 font-medium mb-10"
        >
          Watches
        </motion.p>

        {/* TAGLINE */}
        <motion.div
          initial="hidden"
          animate="show"
          className="flex items-center justify-center gap-4 md:gap-6 mb-14"
        >
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="origin-right h-px w-10 md:w-20 bg-gradient-to-r from-transparent to-steel"
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.15 }}
            className="text-sm sm:text-base md:text-lg tracking-[0.4em] uppercase text-steel-light font-medium whitespace-nowrap"
          >
            Be Ahead Of Time
          </motion.p>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="origin-left h-px w-10 md:w-20 bg-gradient-to-l from-transparent to-steel"
          />
        </motion.div>

        {/* SUPPORTING COPY */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-muted-foreground text-lg md:text-xl tracking-wide max-w-xl mx-auto mb-12 font-light"
        >
          Worn by the ambitious. Built for the early movers.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
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
}

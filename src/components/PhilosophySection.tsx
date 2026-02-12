import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const PhilosophySection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="philosophy" className="py-32 px-6 relative">
      <div className="section-divider max-w-xs mx-auto mb-20" />
      <div ref={ref} className="max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-display text-3xl md:text-5xl font-bold text-gradient-steel mb-10 tracking-tight"
        >
          Not Just A Watch. A Reminder.
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-4 text-muted-foreground text-lg md:text-xl leading-relaxed font-light"
        >
          <p>Ahead isn't about checking time.</p>
          <p>It's about respecting it.</p>
          <p className="text-foreground font-normal">
            Built for those who move before the world does.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PhilosophySection;

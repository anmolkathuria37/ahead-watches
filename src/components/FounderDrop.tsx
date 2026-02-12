import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const LAUNCH_DATE = new Date("2026-04-01T00:00:00");

const useCountdown = (target: Date) => {
  const calc = () => {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
};

const FounderDrop = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { days, hours, minutes, seconds } = useCountdown(LAUNCH_DATE);

  const units = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];

  return (
    <section className="py-32 px-6 relative">
      <div className="section-divider max-w-xs mx-auto mb-20" />
      <div ref={ref} className="max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-display text-3xl md:text-5xl font-bold text-gradient-steel mb-6 tracking-tight"
        >
          Limited Founder Drop
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-muted-foreground text-lg mb-4"
        >
          150 Pieces Only.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-muted-foreground font-light max-w-md mx-auto mb-12"
        >
          The first 150 owners get exclusive early-access pricing, a numbered certificate,
          and lifetime founder status with the AHEAD community.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center gap-4 md:gap-8 mb-14"
        >
          {units.map((u) => (
            <div key={u.label} className="text-center">
              <div className="font-display text-4xl md:text-5xl font-bold text-foreground tabular-nums">
                {String(u.value).padStart(2, "0")}
              </div>
              <div className="text-xs tracking-widest uppercase text-muted-foreground mt-2">
                {u.label}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.a
          href="#waitlist"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="inline-block bg-gradient-steel text-primary-foreground px-10 py-3.5 text-sm font-semibold tracking-widest uppercase rounded-sm hover:opacity-90 transition-all duration-300 hover:shadow-[0_0_30px_-5px_hsl(220_20%_60%/0.3)]"
        >
          Secure Founder Access
        </motion.a>
      </div>
    </section>
  );
};

export default FounderDrop;

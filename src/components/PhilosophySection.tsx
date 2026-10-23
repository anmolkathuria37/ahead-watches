import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowDownRight } from "lucide-react";

const principles = [
  { number: "01", title: "Own your time", copy: "Treat every hour as something you choose, not something you lose." },
  { number: "02", title: "Move with intent", copy: "Less noise. Clear priorities. Progress that compounds quietly." },
  { number: "03", title: "Stay ahead", copy: "Build the habits today that your future self will thank you for." },
];

const PhilosophySection = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="philosophy" ref={ref} className="relative overflow-hidden px-6 py-24 sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-steel/5 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="grid gap-8 border-b border-white/10 pb-12 md:grid-cols-[1.15fr_0.85fr] md:items-end md:gap-16 md:pb-16"
        >
          <div>
            <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.32em] text-steel-light/70">
              <span className="h-px w-8 bg-steel/70" />
              A way of thinking
            </p>
            <h2 className="max-w-3xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Not just a watch. <span className="text-gradient-steel">A reminder.</span>
            </h2>
          </div>
          <p className="max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
            AHEAD is for people who respect the small decisions that shape a bigger life. The first move matters. So does showing up tomorrow.
          </p>
        </motion.div>

        <div className="grid gap-0 md:grid-cols-3">
          {principles.map((principle, index) => (
            <motion.article
              key={principle.number}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 + index * 0.1 }}
              className="group border-b border-white/10 py-7 md:border-b-0 md:border-r md:px-7 md:py-10 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="font-display text-sm tracking-[0.2em] text-steel-light/60">{principle.number}</span>
                <ArrowDownRight aria-hidden="true" className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:text-steel-light" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground sm:text-2xl">{principle.title}</h3>
              <p className="mt-3 max-w-sm text-sm leading-7 text-muted-foreground">{principle.copy}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;

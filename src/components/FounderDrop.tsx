import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const founderBenefits = [
  { number: "01", title: "First access", copy: "Get launch news before the wider release." },
  { number: "02", title: "Founder updates", copy: "Hear about each edition and its availability." },
  { number: "03", title: "Early pricing", copy: "Receive founder-offer details when they're confirmed." },
];

const FounderDrop = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative overflow-hidden px-6 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(220_24%_20%/0.28),transparent_65%)]" />
      <div className="section-divider relative mx-auto mb-16 max-w-xs" />
      <div ref={ref} className="relative mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.32em] text-steel-light/70">
            The AHEAD experience
          </p>
          <h2 className="mb-6 font-display text-3xl font-semibold tracking-tight text-gradient-steel md:text-5xl">
            Be there from the beginning.
          </h2>
          <p className="mx-auto max-w-xl text-base font-light leading-7 text-muted-foreground md:text-lg">
            Join the list for first access, collection announcements, and founder-offer details.
            No invented countdowns. Just considered updates, when they are ready.
          </p>
        </motion.div>

        <div className="mb-12 grid gap-4 md:grid-cols-3">
          {founderBenefits.map((benefit, index) => (
            <motion.article
              key={benefit.number}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: index * 0.1 }}
              className="rounded-xl border border-border/60 bg-card/50 p-6 backdrop-blur-sm transition-colors duration-300 hover:border-steel/40 hover:bg-card/80 md:p-7"
            >
              <span className="mb-8 block font-display text-sm tracking-[0.2em] text-steel-light/60">
                {benefit.number}
              </span>
              <h3 className="mb-2 font-display text-xl font-medium text-foreground">
                {benefit.title}
              </h3>
              <p className="text-sm leading-6 text-muted-foreground">{benefit.copy}</p>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-center"
        >
          <a
            href="#waitlist"
            className="inline-flex min-h-12 items-center justify-center rounded-sm bg-gradient-steel px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-all duration-300 hover:opacity-90 hover:shadow-[0_0_30px_-5px_hsl(220_20%_60%/0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Get founder updates
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FounderDrop;

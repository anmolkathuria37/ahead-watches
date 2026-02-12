import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const testimonials = [
  {
    quote: "AHEAD isn't just a watch — it's the mindset I strap on every morning.",
    name: "Arjun M.",
    role: "Startup Founder",
  },
  {
    quote: "The 5:00 AM Edition is a daily reminder to outwork everyone.",
    name: "Priya K.",
    role: "MBA Aspirant",
  },
  {
    quote: "Premium build, no-nonsense design. Exactly what I was looking for.",
    name: "Rohan S.",
    role: "Engineering Student",
  },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-32 px-6">
      <div className="section-divider max-w-xs mx-auto mb-20" />
      <div ref={ref} className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-center text-steel-dark text-sm tracking-[0.3em] uppercase mb-16 font-medium"
        >
          From The Community
        </motion.p>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 * i }}
              className="bg-card border border-border rounded-sm p-8"
            >
              <p className="text-foreground font-light leading-relaxed mb-6 italic">
                "{t.quote}"
              </p>
              <div>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

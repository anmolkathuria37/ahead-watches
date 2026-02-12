import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import watch5am from "@/assets/watch-5am.jpg";
import watchFounder from "@/assets/watch-founder.jpg";
import watchMidnight from "@/assets/watch-midnight.jpg";

const watches = [
  {
    name: "5:00 AM Edition",
    description: "Matte black dial. Minimal. Disciplined.",
    price: "₹4,999",
    image: watch5am,
  },
  {
    name: "Founder's Steel",
    description: "Silver casing. White dial. Authority.",
    price: "₹5,999",
    image: watchFounder,
  },
  {
    name: "Midnight Discipline",
    description: "Deep navy dial. Steel precision.",
    price: "₹5,499",
    image: watchMidnight,
  },
];

const ProductShowcase = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="collection" className="py-32 px-6 bg-gradient-dark">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-steel-dark text-sm tracking-[0.3em] uppercase mb-4 font-medium">
            The Collection
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-gradient-steel tracking-tight">
            The Early Series
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {watches.map((watch, i) => (
            <motion.div
              key={watch.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 * i }}
              className="group relative bg-card rounded-sm overflow-hidden border-gradient-steel"
            >
              <div className="aspect-square overflow-hidden bg-background">
                <img
                  src={watch.image}
                  alt={watch.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                  {watch.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 font-light">
                  {watch.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-steel-light text-sm font-medium">
                    Expected Launch: {watch.price}
                  </span>
                </div>
                <a
                  href="#waitlist"
                  className="mt-4 block text-center w-full border border-border py-2.5 text-xs tracking-widest uppercase font-semibold text-foreground hover:bg-secondary transition-all duration-300 rounded-sm"
                >
                  Join Waitlist
                </a>
              </div>
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none glow-steel-hover rounded-sm" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;

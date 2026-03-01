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
    specs: ["42mm case", "Japanese Quartz", "5ATM"],
  },
  {
    name: "Founder's Steel",
    description: "Silver casing. White dial. Authority.",
    price: "₹5,999",
    image: watchFounder,
    specs: ["40mm case", "Swiss Quartz", "10ATM"],
  },
  {
    name: "Midnight Discipline",
    description: "Deep navy dial. Steel precision.",
    price: "₹5,499",
    image: watchMidnight,
    specs: ["44mm case", "Japanese Quartz", "Luminous"],
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
              className="group relative rounded-lg border border-border/50 bg-card/40 backdrop-blur-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-steel/30 hover:shadow-[0_8px_40px_rgba(100,110,140,0.15)] hover:-translate-y-2 transition-all duration-500"
            >
              {/* Glass shimmer */}
              <div className="absolute inset-0 bg-gradient-to-br from-steel-light/5 via-transparent to-transparent pointer-events-none z-10" />

              <div className="aspect-square overflow-hidden bg-background relative">
                <img
                  src={watch.image}
                  alt={watch.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-all duration-500" />
              </div>

              <div className="p-6 relative z-10">
                <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                  {watch.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-3 font-light">
                  {watch.description}
                </p>

                {/* Specs pills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {watch.specs.map((spec) => (
                    <span
                      key={spec}
                      className="text-[10px] tracking-wider uppercase px-2 py-1 rounded-full bg-secondary/50 text-muted-foreground border border-border/30"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-steel-light text-sm font-medium">
                    Expected: {watch.price}
                  </span>
                </div>
                <a
                  href="#waitlist"
                  className="block text-center w-full bg-gradient-steel text-primary-foreground py-2.5 text-xs tracking-widest uppercase font-semibold rounded-sm hover:opacity-90 transition-all duration-300"
                >
                  Join Waitlist
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;

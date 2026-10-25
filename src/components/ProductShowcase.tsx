import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight, Check } from "lucide-react";

const watches = [
  {
    name: "5:00 AM Edition",
    descriptor: "For the ones already moving.",
    description: "A restrained dark-dial concept built around focus, consistency, and the quiet work no one sees.",
    price: "₹4,999",
    image: "https://www.watchesofswitzerland.com/cdn/shop/files/18100268_1.jpg?height=1600&v=1745258611&width=1600",
    modelId: "5am",
    specs: ["42 mm concept", "Movement TBC", "Water resistance TBC"],
  },
  {
    name: "Founder’s Steel",
    descriptor: "Make every second count.",
    description: "A crisp, architectural concept for people building what comes next—understated, balanced, and purposeful.",
    price: "₹5,999",
    image: "https://cdn.thewatchpages.com/app/uploads/2020/03/13214504/jacob-co-astronomia-tourbillon-at10040acsda.jpg",
    modelId: "founder",
    specs: ["40 mm concept", "Movement TBC", "Water resistance TBC"],
  },
  {
    name: "Midnight Discipline",
    descriptor: "Calm under pressure.",
    description: "A deep, nocturnal concept with a composed silhouette, made for late nights and early starts alike.",
    price: "₹5,499",
    image: "https://www.europastar.com/local/cache-vignettes/L1400xH1653/jacob.co-7d78f.jpg",
    modelId: "midnight",
    specs: ["44 mm concept", "Movement TBC", "Luminous details TBC"],
  },
];

const selectModel = (modelId: string) => {
  const url = new URL(window.location.href);
  url.searchParams.set("model", modelId);
  url.hash = "waitlist";
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  window.dispatchEvent(new CustomEvent("ahead:model-selected", { detail: modelId }));
};

const ProductShowcase = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="collection" ref={ref} className="relative overflow-hidden bg-gradient-dark px-5 py-24 sm:px-8 sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-steel/40 to-transparent" />
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.32em] text-steel-light/70"><span className="h-px w-8 bg-steel/70" /> Designed with intent</p>
            <h2 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl">The Early <span className="text-gradient-steel">Series.</span></h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-muted-foreground sm:text-base">Three expressions of the same belief: your time should reflect the person you’re becoming.</p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          {watches.map((watch, index) => (
            <motion.article key={watch.modelId} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay: index * 0.12 }} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] transition-colors duration-500 hover:border-steel/40 hover:bg-white/[0.045]">
              <div className="relative aspect-[4/4.5] overflow-hidden bg-secondary/40">
                <img src={watch.image} alt={`Temporary visual reference for the AHEAD ${watch.name} concept`} referrerPolicy="no-referrer" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]" loading="lazy" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/10" />
                <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-background/55 px-3 py-1.5 text-[10px] font-semibold tracking-[0.2em] text-foreground/90 backdrop-blur-md">CONCEPT STUDY</span>
                <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-1">
                  <span className="font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">{watch.price}</span>
                  <span className="text-[9px] uppercase tracking-[0.16em] text-white/65">Indicative concept pricing</span>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-steel-light/65">{watch.descriptor}</p>
                <h3 className="font-display text-xl font-semibold text-foreground sm:text-2xl">{watch.name}</h3>
                <p className="mt-3 min-h-[4.5rem] text-sm leading-6 text-muted-foreground">{watch.description}</p>

                <div className="my-5 flex flex-wrap gap-x-4 gap-y-2 border-y border-white/10 py-4">
                  {watch.specs.map((spec) => <span key={spec} className="inline-flex items-center gap-1.5 text-[11px] text-foreground/75"><Check aria-hidden="true" className="h-3.5 w-3.5 text-steel-light/70" />{spec}</span>)}
                </div>

                <button type="button" onClick={() => { selectModel(watch.modelId); document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} aria-label={`Get early access to ${watch.name}`} className="group/cta inline-flex min-h-12 w-full items-center justify-between rounded-lg border border-white/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-foreground transition-all duration-300 hover:border-steel/60 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel">
                  <span>Get early access</span><ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
        <p className="mt-6 text-center text-xs leading-5 text-muted-foreground/70">These are AHEAD design concepts, not final products. Images are temporary visual references; specifications and prices are indicative only. Replace all reference imagery with original or properly licensed AHEAD assets before launch.</p>
      </div>
    </section>
  );
};

export default ProductShowcase;

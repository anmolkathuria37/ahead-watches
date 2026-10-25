import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

const concepts = [
  {
    modelId: "5am",
    name: "5:00 AM Edition",
    edition: "The discipline concept",
    image: "https://www.watchesofswitzerland.com/cdn/shop/files/18100268_1.jpg?height=1600&v=1745258611&width=1600",
    alt: "Temporary visual reference for the 5:00 AM Edition concept",
    description:
      "A restrained dark-dial concept for early starts and deliberate momentum. Quiet detailing, confident proportions, and a design language built around discipline.",
    mood: "Focus · Restraint · Momentum",
  },
  {
    modelId: "founder",
    name: "Founder’s Steel",
    edition: "The ambition concept",
    image: "https://cdn.thewatchpages.com/app/uploads/2020/03/13214504/jacob-co-astronomia-tourbillon-at10040acsda.jpg",
    alt: "Temporary visual reference for the Founder’s Steel concept",
    description:
      "A polished steel-and-light concept for people building what comes next. Balanced, architectural, and deliberately understated—with presence that never needs to announce itself.",
    mood: "Clarity · Craft · Ambition",
  },
  {
    modelId: "midnight",
    name: "Midnight Discipline",
    edition: "The after-hours concept",
    image: "https://www.europastar.com/local/cache-vignettes/L1400xH1653/jacob.co-7d78f.jpg",
    alt: "Temporary visual reference for the Midnight Discipline concept",
    description:
      "A deep, nocturnal concept with a bold silhouette and composed presence—made to move from late-night focus to first light without losing its edge.",
    mood: "Depth · Composure · Precision",
  },
];

const emitModelSelected = (modelId: string) => {
  const url = new URL(window.location.href);
  url.searchParams.set("model", modelId);
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  window.dispatchEvent(new CustomEvent("ahead:model-selected", { detail: modelId }));
};

export default function Watch3D() {
  const [activeIndex, setActiveIndex] = useState(() => {
    const model = new URLSearchParams(window.location.search).get("model");
    const foundIndex = concepts.findIndex((concept) => concept.modelId === model);
    return foundIndex >= 0 ? foundIndex : 0;
  });
  const active = concepts[activeIndex];

  useEffect(() => {
    const handleModelSelected = (event: Event) => {
      const modelId = (event as CustomEvent<string>).detail;
      const index = concepts.findIndex((concept) => concept.modelId === modelId);
      if (index >= 0) setActiveIndex(index);
    };
    window.addEventListener("ahead:model-selected", handleModelSelected);
    return () => window.removeEventListener("ahead:model-selected", handleModelSelected);
  }, []);

  const selectModel = (index: number) => {
    setActiveIndex(index);
    emitModelSelected(concepts[index].modelId);
  };
  const showPrevious = () => selectModel((activeIndex + concepts.length - 1) % concepts.length);
  const showNext = () => selectModel((activeIndex + 1) % concepts.length);

  return (
    <section aria-labelledby="watch-study-heading" className="relative overflow-hidden border-y border-white/10 bg-[#080A0E] py-20 sm:py-28 md:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_40%,rgba(190,170,125,0.13),transparent_48%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <p className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.34em] text-[#C9B58D]">
            <span className="h-px w-8 bg-[#C9B58D]/70" /> AHEAD design language
          </p>
          <h2 id="watch-study-heading" className="max-w-xl font-display text-4xl font-medium leading-[1.04] tracking-tight text-white sm:text-5xl md:text-6xl">
            One point of view. <span className="text-[#C9B58D]">Three expressions.</span>
          </h2>
          <p className="mt-6 max-w-lg text-sm leading-7 text-white/55 sm:text-base">
            Explore the concepts. Select a timepiece to see its story—and carry that exact choice into early access.
          </p>

          <motion.div key={active.modelId} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mt-10 border-l border-[#C9B58D]/60 pl-5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#C9B58D]">{active.edition}</p>
            <h3 className="mt-3 font-display text-2xl text-white sm:text-3xl">{active.name}</h3>
            <p className="mt-4 max-w-lg text-sm leading-7 text-white/65">{active.description}</p>
            <p className="mt-4 text-[9px] font-medium uppercase tracking-[0.18em] text-white/40">{active.mood}</p>
            <button
              type="button"
              onClick={() => {
                emitModelSelected(active.modelId);
                window.location.hash = "waitlist";
                document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="mt-7 inline-flex min-h-12 items-center justify-between gap-8 border border-[#C9B58D]/45 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:border-[#E1D0AA] hover:bg-[#C9B58D]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9B58D]"
            >
              Get early access <span aria-hidden="true">↗</span>
            </button>
          </motion.div>
        </motion.div>

        <div className="min-w-0">
          <motion.div key={active.image} initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45 }} className="relative overflow-hidden border border-white/10 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.09),rgba(255,255,255,0.015)_55%,transparent_78%)]">
            <div className="absolute left-5 top-5 z-10 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/55">AHEAD concept study / 0{activeIndex + 1}</div>
            <div className="flex aspect-[4/3] items-center justify-center p-5 sm:p-10">
              <img src={active.image} alt={active.alt} referrerPolicy="no-referrer" className="h-full w-full object-contain drop-shadow-[0_28px_42px_rgba(0,0,0,0.42)]" />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#080A0E]/85 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#C9B58D]">{active.edition}</p>
                <h3 className="mt-1 font-display text-xl text-white sm:text-2xl">{active.name}</h3>
              </div>
              <div className="flex shrink-0 gap-2">
                <button type="button" onClick={showPrevious} aria-label="Previous AHEAD concept" className="grid h-10 w-10 place-items-center border border-white/25 bg-black/30 text-white transition hover:border-[#C9B58D] hover:text-[#E1D0AA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9B58D]"><ArrowLeft className="h-4 w-4" /></button>
                <button type="button" onClick={showNext} aria-label="Next AHEAD concept" className="grid h-10 w-10 place-items-center border border-white/25 bg-black/30 text-white transition hover:border-[#C9B58D] hover:text-[#E1D0AA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9B58D]"><ArrowRight className="h-4 w-4" /></button>
              </div>
            </div>
          </motion.div>

          <div className="mt-3 grid grid-cols-3 gap-3">
            {concepts.map((concept, index) => (
              <button key={concept.modelId} type="button" onClick={() => selectModel(index)} aria-pressed={activeIndex === index} className={`group overflow-hidden border text-left transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9B58D] ${activeIndex === index ? "border-[#C9B58D] bg-[#C9B58D]/[0.07]" : "border-white/10 hover:border-white/35"}`}>
                <div className="relative aspect-[4/3] bg-white/[0.03] p-2 sm:p-3">
                  <img src={concept.image} alt="" loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
                  {activeIndex === index && <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-[#C9B58D] text-[#090a0d]"><Check className="h-3 w-3" /></span>}
                </div>
                <span className="block truncate px-2 pb-2 pt-1 text-[9px] uppercase tracking-[0.1em] text-white/65 sm:px-3">{concept.name}</span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-[10px] leading-5 text-white/35">Temporary reference photography for layout exploration only—not AHEAD products. Replace with original or properly licensed AHEAD imagery before launch. These are concept visuals, not interactive 3D models.</p>
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";

const references = [
  {
    name: "Astronomia Solar",
    edition: "Celestial complication",
    image: "https://www.watchesofswitzerland.com/cdn/shop/files/18100268_1.jpg?height=1600&v=1745258611&width=1600",
    source: "https://www.watchesofswitzerland.com/products/jacob-co-astronomia-as300-40-aa-ae-abala-18100268",
    sourceName: "Watches of Switzerland",
    alt: "Jacob & Co. Astronomia Solar watch with a blue celestial dial",
  },
  {
    name: "Astronomia Tourbillon",
    edition: "Open-worked movement",
    image: "https://cdn.thewatchpages.com/app/uploads/2020/03/13214504/jacob-co-astronomia-tourbillon-at10040acsda.jpg",
    source: "https://www.thewatchpages.com/watches/jacob-co-astronomia-tourbillon-at10040acsda/",
    sourceName: "The Watch Pages",
    alt: "Jacob & Co. Astronomia Tourbillon with a visible mechanical movement",
  },
  {
    name: "Astronomia Black Ceramic",
    edition: "Black ceramic case",
    image: "https://www.europastar.com/local/cache-vignettes/L1400xH1653/jacob.co-7d78f.jpg",
    source: "https://www.europastar.com/watch-gallery/1004090452-jacob-co-astronomia-black-ceramic.html",
    sourceName: "Europa Star",
    alt: "Jacob & Co. Astronomia Black Ceramic watch",
  },
];

export default function Watch3D() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = references[activeIndex];
  const showPrevious = () => setActiveIndex((current) => (current + references.length - 1) % references.length);
  const showNext = () => setActiveIndex((current) => (current + 1) % references.length);

  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-[#07090d] py-20 sm:py-28 md:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(171,143,94,0.14),transparent_52%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <p className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.34em] text-[#c8b58a]">
            <span className="h-px w-8 bg-[#c8b58a]/70" /> The art of horology
          </p>
          <h2 className="max-w-xl font-display text-4xl font-medium leading-[1.04] tracking-tight text-white sm:text-5xl md:text-6xl">
            Extraordinary timepieces. <span className="text-[#c8b58a]">Uncompromising detail.</span>
          </h2>
          <p className="mt-6 max-w-lg text-sm leading-7 text-white/60 sm:text-base">
            A temporary visual moodboard while AHEAD’s own product photography and 3D assets are being developed. Explore these reference timepieces; they are not AHEAD products.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={active.source} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 border border-white/20 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition hover:border-[#c8b58a]/70 hover:text-[#e2d1a8]">
              View source imagery · {active.sourceName} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            <span className="text-[10px] uppercase tracking-[0.16em] text-white/35">Reference only · replace before launch</span>
          </div>
        </motion.div>

        <div className="min-w-0">
          <motion.div key={active.image} initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45 }} className="relative overflow-hidden border border-white/10 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.09),rgba(255,255,255,0.015)_55%,transparent_78%)]">
            <div className="absolute left-5 top-5 z-10 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/60">AHEAD visual study / 0{activeIndex + 1}</div>
            <div className="flex aspect-[4/3] items-center justify-center p-5 sm:p-10">
              <img src={active.image} alt={active.alt} referrerPolicy="no-referrer" className="h-full w-full object-contain drop-shadow-[0_28px_42px_rgba(0,0,0,0.42)]" />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#07090d]/90 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#c8b58a]">{active.edition}</p>
                <h3 className="mt-1 font-display text-xl text-white sm:text-2xl">{active.name}</h3>
              </div>
              <div className="flex shrink-0 gap-2">
                <button type="button" onClick={showPrevious} aria-label="Previous reference watch" className="grid h-10 w-10 place-items-center border border-white/25 bg-black/30 text-white transition hover:border-[#c8b58a] hover:text-[#e2d1a8]"><ArrowLeft className="h-4 w-4" /></button>
                <button type="button" onClick={showNext} aria-label="Next reference watch" className="grid h-10 w-10 place-items-center border border-white/25 bg-black/30 text-white transition hover:border-[#c8b58a] hover:text-[#e2d1a8]"><ArrowRight className="h-4 w-4" /></button>
              </div>
            </div>
          </motion.div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {references.map((reference, index) => (
              <button key={reference.name} type="button" onClick={() => setActiveIndex(index)} aria-pressed={activeIndex === index} className={`group overflow-hidden border text-left transition ${activeIndex === index ? "border-[#c8b58a]" : "border-white/10 hover:border-white/35"}`}>
                <div className="aspect-[4/3] bg-white/[0.03] p-2 sm:p-3"><img src={reference.image} alt="" loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" /></div>
                <span className="block truncate px-2 pb-2 text-[9px] uppercase tracking-[0.1em] text-white/65 sm:px-3">{reference.name}</span>
              </button>
            ))}
          </div>
          <p className="mt-3 text-[10px] leading-5 text-white/35">Images linked from their respective publishers. Usage rights should be confirmed before a public or commercial launch.</p>
        </div>
      </div>
    </section>
  );
}

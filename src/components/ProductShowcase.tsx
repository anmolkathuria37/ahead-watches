import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, X, Maximize2 } from "lucide-react";

const watches = [
  {
    name: "5:00 AM Edition",
    descriptor: "For the ones already moving.",
    description: "A restrained dark-dial concept built around focus, consistency, and the quiet work no one sees. The design direction is minimal, purposeful, and made to feel at home from the first alarm to the final decision of the day.",
    price: "To be announced",
    image: "https://www.watchesofswitzerland.com/cdn/shop/files/18100268_1.jpg?height=1600&v=1745258611&width=1600",
    gallery: [
      "https://www.watchesofswitzerland.com/cdn/shop/files/18100268_1.jpg?height=1600&v=1745258611&width=1600",
      "https://cdn.thewatchpages.com/app/uploads/2020/03/13214504/jacob-co-astronomia-tourbillon-at10040acsda.jpg",
      "https://www.europastar.com/local/cache-vignettes/L1400xH1653/jacob.co-7d78f.jpg",
    ],
    modelId: "5am",
    specs: [["Design direction", "Dark-dial minimalism"], ["Case size", "To be confirmed"], ["Movement", "To be confirmed"], ["Water resistance", "To be confirmed"], ["Availability", "Concept / early access"]],
    story: "Built around a simple idea: the most important work often happens before anyone is watching. 5:00 AM Edition explores restraint, legibility, and a quietly confident silhouette.",
    mood: "Focus · Restraint · Momentum",
  },
  {
    name: "Founder’s Steel",
    descriptor: "Make every second count.",
    description: "A crisp, architectural concept for people building what comes next—understated, balanced, and purposeful.",
    price: "To be announced",
    image: "https://cdn.thewatchpages.com/app/uploads/2020/03/13214504/jacob-co-astronomia-tourbillon-at10040acsda.jpg",
    gallery: [
      "https://cdn.thewatchpages.com/app/uploads/2020/03/13214504/jacob-co-astronomia-tourbillon-at10040acsda.jpg",
      "https://www.watchesofswitzerland.com/cdn/shop/files/18100268_1.jpg?height=1600&v=1745258611&width=1600",
      "https://www.europastar.com/local/cache-vignettes/L1400xH1653/jacob.co-7d78f.jpg",
    ],
    modelId: "founder",
    specs: [["Design direction", "Steel / architectural"], ["Case size", "To be confirmed"], ["Movement", "To be confirmed"], ["Water resistance", "To be confirmed"], ["Availability", "Concept / early access"]],
    story: "For people who turn ideas into something real. Founder’s Steel explores clean geometry, composed proportions, and a versatile presence that works as hard as the person wearing it.",
    mood: "Clarity · Craft · Ambition",
  },
  {
    name: "Midnight Discipline",
    descriptor: "Calm under pressure.",
    description: "A deep, nocturnal concept with a composed silhouette, made for late nights and early starts alike.",
    price: "To be announced",
    image: "https://www.europastar.com/local/cache-vignettes/L1400xH1653/jacob.co-7d78f.jpg",
    gallery: [
      "https://www.europastar.com/local/cache-vignettes/L1400xH1653/jacob.co-7d78f.jpg",
      "https://www.watchesofswitzerland.com/cdn/shop/files/18100268_1.jpg?height=1600&v=1745258611&width=1600",
      "https://cdn.thewatchpages.com/app/uploads/2020/03/13214504/jacob-co-astronomia-tourbillon-at10040acsda.jpg",
    ],
    modelId: "midnight",
    specs: [["Design direction", "Nocturnal / bold"], ["Case size", "To be confirmed"], ["Movement", "To be confirmed"], ["Luminous details", "To be confirmed"], ["Availability", "Concept / early access"]],
    story: "Midnight Discipline is a study in depth and composure: a watch concept for the hours when the world gets quiet and the work gets personal.",
    mood: "Depth · Composure · Precision",
  },
] as const;

type Watch = (typeof watches)[number];
const getModelFromUrl = () => {
  const modelId = new URLSearchParams(window.location.search).get("model");
  return watches.find((watch) => watch.modelId === modelId)?.modelId ?? watches[0].modelId;
};

const selectModel = (modelId: string) => {
  const url = new URL(window.location.href);
  url.searchParams.set("model", modelId);
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  window.dispatchEvent(new CustomEvent("ahead:model-selected", { detail: modelId }));
};

const ProductShowcase = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeModelId, setActiveModelId] = useState<string>(getModelFromUrl);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const activeWatch = watches.find((watch) => watch.modelId === activeModelId) ?? watches[0];

  useEffect(() => {
    const handleModelSelected = (event: Event) => {
      const modelId = (event as CustomEvent<string>).detail;
      if (watches.some((watch) => watch.modelId === modelId)) setActiveModelId(modelId);
    };
    const handlePopState = () => setActiveModelId(getModelFromUrl());
    window.addEventListener("ahead:model-selected", handleModelSelected);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("ahead:model-selected", handleModelSelected);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (!detailOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDetailOpen(false);
      if (event.key === "ArrowRight") setActiveImage((index) => (index + 1) % activeWatch.gallery.length);
      if (event.key === "ArrowLeft") setActiveImage((index) => (index + activeWatch.gallery.length - 1) % activeWatch.gallery.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [detailOpen, activeWatch.gallery.length]);

  const openDetails = (watch: Watch) => {
    setActiveModelId(watch.modelId);
    setActiveImage(0);
    selectModel(watch.modelId);
    setDetailOpen(true);
  };

  const getEarlyAccess = () => {
    selectModel(activeWatch.modelId);
    setDetailOpen(false);
    const url = new URL(window.location.href);
    url.hash = "waitlist";
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    window.setTimeout(() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  return (
    <section id="collection" ref={ref} className="relative overflow-hidden bg-gradient-dark px-5 py-24 sm:px-8 sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#C9B58D]/45 to-transparent" />
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.32em] text-[#C9B58D]"><span className="h-px w-8 bg-[#C9B58D]" /> Designed with intent</p>
            <h2 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl">The Early <span className="text-[#C9B58D]">Series.</span></h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-muted-foreground sm:text-base">Three expressions of the same belief: your time should reflect the person you’re becoming.</p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          {watches.map((watch, index) => (
            <motion.article key={watch.modelId} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay: index * 0.12 }} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#171B22]/55 transition-all duration-500 hover:-translate-y-1 hover:border-[#C9B58D]/55 hover:bg-[#171B22]/80 hover:shadow-[0_24px_70px_-40px_rgba(201,181,141,0.4)]">
              <button type="button" onClick={() => openDetails(watch)} aria-label={`View details for ${watch.name}`} className="relative block aspect-[4/4.5] w-full overflow-hidden bg-[#171B22] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#C9B58D]">
                <img src={watch.image} alt={`Temporary inspiration photograph for the AHEAD ${watch.name} concept`} referrerPolicy="no-referrer" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]" loading="lazy" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#080A0E] via-[#080A0E]/10 to-[#080A0E]/5" />
                <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-[#080A0E]/65 px-3 py-1.5 text-[10px] font-semibold tracking-[0.2em] text-white/90 backdrop-blur-md">CONCEPT STUDY</span>
                <span className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-[#080A0E]/50 text-white transition group-hover:border-[#C9B58D] group-hover:text-[#C9B58D]"><Maximize2 aria-hidden="true" className="h-4 w-4" /></span>
                <div className="absolute bottom-5 left-5 right-5">
                  <span className="font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">{watch.price}</span>
                  <span className="mt-1 block text-[9px] uppercase tracking-[0.16em] text-white/65">Pricing announced at launch</span>
                </div>
              </button>
              <div className="p-5 sm:p-6">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#C9B58D]">{watch.descriptor}</p>
                <h3 className="font-display text-xl font-semibold text-foreground sm:text-2xl">{watch.name}</h3>
                <p className="mt-3 min-h-[4.5rem] text-sm leading-6 text-muted-foreground">{watch.description}</p>
                <button type="button" onClick={() => openDetails(watch)} className="mt-5 inline-flex min-h-12 w-full items-center justify-between rounded-lg border border-[#C9B58D]/40 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-foreground transition-all duration-300 hover:border-[#C9B58D] hover:bg-[#C9B58D]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9B58D]">
                  <span>Explore timepiece</span><ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
        <p className="mt-6 text-center text-xs leading-5 text-muted-foreground/70">AHEAD concepts are in development. Images shown are temporary third-party inspiration references, not AHEAD products or product photography. Final imagery, specifications and pricing will be confirmed before launch.</p>
      </div>

      <AnimatePresence>
        {detailOpen && (
          <motion.div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 p-0 backdrop-blur-md sm:items-center sm:p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDetailOpen(false); }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.section role="dialog" aria-modal="true" aria-labelledby="product-detail-title" className="relative max-h-[100dvh] w-full max-w-6xl overflow-y-auto rounded-t-2xl border border-white/10 bg-[#080A0E] shadow-[0_35px_120px_rgba(0,0,0,0.7)] sm:max-h-[92vh] sm:rounded-2xl" initial={{ y: 28, opacity: 0, scale: 0.99 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0, scale: 0.99 }} transition={{ duration: 0.24 }}>
              <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#080A0E]/90 px-5 py-4 backdrop-blur-xl sm:px-7">
                <a href="#collection" onClick={(event) => event.preventDefault()} className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9B58D]">AHEAD / THE EARLY SERIES</a>
                <button type="button" onClick={() => setDetailOpen(false)} aria-label="Close product details" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/75 transition hover:border-[#C9B58D] hover:text-[#C9B58D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9B58D]"><X className="h-4 w-4" /></button>
              </div>
              <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
                <div className="min-w-0 p-4 sm:p-7 lg:p-9">
                  <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(ellipse_at_center,rgba(201,181,141,0.13),rgba(23,27,34,0.4)_48%,#080A0E_80%)] sm:min-h-[480px]">
                    <img src={activeWatch.gallery[activeImage]} alt={`Temporary reference image ${activeImage + 1} for the ${activeWatch.name} design concept`} referrerPolicy="no-referrer" className="max-h-[62vh] w-full object-contain p-5 sm:p-10" />
                    <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-white/75">Reference {String(activeImage + 1).padStart(2, "0")} / {String(activeWatch.gallery.length).padStart(2, "0")}</span>
                    <button type="button" aria-label="Previous reference image" onClick={() => setActiveImage((index) => (index + activeWatch.gallery.length - 1) % activeWatch.gallery.length)} className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/40 text-white hover:border-[#C9B58D] hover:text-[#C9B58D]"><ArrowLeft className="h-4 w-4" /></button>
                    <button type="button" aria-label="Next reference image" onClick={() => setActiveImage((index) => (index + 1) % activeWatch.gallery.length)} className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/40 text-white hover:border-[#C9B58D] hover:text-[#C9B58D]"><ArrowRight className="h-4 w-4" /></button>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {activeWatch.gallery.map((image, index) => (
                      <button key={image} type="button" onClick={() => setActiveImage(index)} aria-label={`Show reference image ${index + 1}`} aria-pressed={activeImage === index} className={`relative aspect-[4/3] overflow-hidden rounded-lg border bg-[#171B22] p-1 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9B58D] ${activeImage === index ? "border-[#C9B58D]" : "border-white/10 hover:border-white/35"}`}>
                        <img src={image} alt="" loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-contain" />
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-[10px] leading-5 text-white/40">These are mood-board references from third-party publishers, not views of the same AHEAD watch. We’ll replace them with owned or licensed AHEAD photography before launch.</p>
                </div>
                <div className="px-5 pb-8 pt-3 sm:px-8 sm:pb-9 lg:px-9 lg:py-10">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#C9B58D]">{activeWatch.descriptor}</p>
                  <h2 id="product-detail-title" className="mt-4 font-display text-3xl font-medium leading-tight text-[#E8E6E0] sm:text-4xl">{activeWatch.name}</h2>
                  <p className="mt-5 text-sm leading-7 text-white/65">{activeWatch.story}</p>
                  <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.18em] text-[#C9B58D]">{activeWatch.mood}</p>
                  <div className="my-7 border-y border-white/10 py-5">
                    <div className="flex items-end justify-between gap-4">
                      <div><p className="text-[9px] uppercase tracking-[0.2em] text-white/45">Pricing</p><p className="mt-2 font-display text-2xl text-[#E8E6E0]">{activeWatch.price}</p></div>
                      <span className="rounded-full border border-[#C9B58D]/30 px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] text-[#C9B58D]">In development</span>
                    </div>
                  </div>
                  <h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/80">Concept specifications</h3>
                  <dl className="mt-4 divide-y divide-white/[0.08]">
                    {activeWatch.specs.map(([label, value]) => <div key={label} className="flex items-start justify-between gap-5 py-3 text-xs"><dt className="text-white/45">{label}</dt><dd className="max-w-[58%] text-right text-white/80">{value}</dd></div>)}
                  </dl>
                  <div className="mt-7 rounded-xl border border-[#C9B58D]/20 bg-[#C9B58D]/[0.055] p-4">
                    <p className="flex items-center gap-2 text-xs font-medium text-[#E8E6E0]"><Check className="h-4 w-4 text-[#C9B58D]" /> Early access is interest-only</p>
                    <p className="mt-2 text-xs leading-5 text-white/55">No payment is taken. Final design, pricing and specifications will be confirmed before launch.</p>
                  </div>
                  <button type="button" onClick={getEarlyAccess} className="mt-5 flex min-h-14 w-full items-center justify-between rounded-lg bg-[#C9B58D] px-5 py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#080A0E] transition hover:bg-[#E1D0AA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#C9B58D]"><span>Get early access</span><ArrowUpRight className="h-4 w-4" /></button>
                  <button type="button" onClick={() => { const index = watches.findIndex((watch) => watch.modelId === activeWatch.modelId); const next = watches[(index + 1) % watches.length]; setActiveModelId(next.modelId); setActiveImage(0); selectModel(next.modelId); }} className="mt-3 min-h-11 w-full rounded-lg border border-white/10 px-4 text-xs uppercase tracking-[0.16em] text-white/65 transition hover:border-white/25 hover:text-white">Explore next concept <span aria-hidden="true">↗</span></button>
                </div>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProductShowcase;

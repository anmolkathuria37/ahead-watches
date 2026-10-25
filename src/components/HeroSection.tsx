import { motion } from "framer-motion";

const brandContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};
const brandLetter = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#080A0E]">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=2400&q=90"
          alt=""
          className="h-full w-full object-cover object-center opacity-80"
          aria-hidden="true"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080A0E]/95 via-[#080A0E]/55 to-[#080A0E]/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080A0E] via-transparent to-[#080A0E]/35" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_42%,rgba(201,181,141,0.12),transparent_44%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 pt-32 sm:px-10 lg:pt-36">
        <div className="max-w-3xl">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-7 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.36em] text-[#C9B58D] sm:text-xs">
            <span className="h-px w-10 bg-[#C9B58D]" /> Independent watchmaking · A new point of view
          </motion.p>
          <motion.h1 variants={brandContainer} initial="hidden" animate="show" className="select-none font-display text-6xl font-semibold uppercase leading-[0.9] tracking-[0.06em] text-[#E8E6E0] sm:text-8xl md:text-9xl" aria-label="AHEAD Watches">
            {"AHEAD".split("").map((char, index) => <motion.span key={index} variants={brandLetter} className={index === 0 ? "inline-block text-[#C9B58D]" : "inline-block"}>{char}</motion.span>)}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.65 }} className="mt-5 font-display text-xs font-medium uppercase tracking-[0.45em] text-white/65 sm:text-sm">Watches</motion.p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="mt-9 max-w-xl border-l border-[#C9B58D]/65 pl-5 sm:mt-12 sm:pl-7">
            <p className="font-display text-2xl leading-snug tracking-tight text-[#E8E6E0] sm:text-3xl md:text-4xl">Be ahead of time.</p>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/65 sm:text-base">Worn by the ambitious. Built for the early movers. Discover the ideas behind the first AHEAD collection.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1 }} className="mt-9 flex flex-col gap-3 sm:mt-11 sm:flex-row">
            <a href="#collection" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-[#C9B58D] px-7 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#080A0E] transition hover:bg-[#E1D0AA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#C9B58D]">Explore the collection <span aria-hidden="true">↗</span></a>
            <a href="#waitlist" className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/25 bg-white/[0.035] px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition hover:border-[#C9B58D]/70 hover:bg-white/[0.07] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#C9B58D]">Request early access</a>
          </motion.div>
        </div>
        <div className="mt-16 flex items-center gap-3 text-[9px] uppercase tracking-[0.22em] text-white/40 sm:mt-20"><span className="h-px w-8 bg-[#C9B58D]/60" /> Thoughtful design. Time, redefined.</div>
      </div>
      <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#080A0E] to-transparent" />
    </section>
  );
}

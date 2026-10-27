import { motion } from "framer-motion";
import { ArrowRight, Check, Mail, ShieldCheck, Sparkles } from "lucide-react";
import watch5am from "../../assets/watch-5am.jpg";
import watchFounder from "../../assets/watch-founder.jpg";
import watchMidnight from "../../assets/watch-midnight.jpg";

type WatchModel = "5am" | "founder" | "midnight";

interface WaitlistConfirmationProps {
  name: string;
  email: string;
  model: WatchModel;
}

const watchDetails: Record<WatchModel, {
  name: string;
  description: string;
  image: string;
  edition: string;
}> = {
  "5am": {
    name: "5:00 AM Edition",
    description: "Focus · Restraint · Momentum",
    image: watch5am,
    edition: "01 / THE DISCIPLINE SERIES",
  },
  founder: {
    name: "Founder’s Steel",
    description: "Clarity · Craft · Ambition",
    image: watchFounder,
    edition: "02 / THE FOUNDERS SERIES",
  },
  midnight: {
    name: "Midnight Discipline",
    description: "Depth · Composure · Precision",
    image: watchMidnight,
    edition: "03 / THE DISCIPLINE SERIES",
  },
};

const nextSteps = [
  {
    number: "01",
    title: "Your interest is recorded",
    detail: "Your selected AHEAD timepiece is attached to your waitlist entry.",
  },
  {
    number: "02",
    title: "Stay close to your inbox",
    detail: "We’ll share relevant launch and early-access updates by email.",
  },
  {
    number: "03",
    title: "Be ready for first access",
    detail: "Look out for the next update from AHEAD as the launch approaches.",
  },
];

const WaitlistConfirmation: React.FC<WaitlistConfirmationProps> = ({ name, email, model }) => {
  const watch = watchDetails[model];

  return (
    <section
      id="waitlist"
      aria-labelledby="waitlist-confirmation-title"
      aria-live="polite"
      className="relative isolate min-h-[100svh] overflow-hidden bg-[#080a0e] px-5 py-8 sm:px-8 sm:py-10 lg:h-svh lg:min-h-[680px] lg:overflow-y-auto"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(201,181,141,0.10)_0%,rgba(201,181,141,0.025)_42%,transparent_72%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9b58d]/40 to-transparent" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-6xl flex-col justify-center lg:min-h-[calc(100svh-5rem)]"
      >
        <div className="mb-6 flex items-center justify-center gap-3 sm:mb-8">
          <span className="h-px w-8 bg-[#c9b58d]/50" />
          <span className="text-[9px] font-medium uppercase tracking-[0.34em] text-[#c9b58d] sm:text-[10px]">
            AHEAD · Private access
          </span>
          <span className="h-px w-8 bg-[#c9b58d]/50" />
        </div>

        <div className="grid items-center gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 xl:gap-14">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.12, duration: 0.45 }}
              className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#c9b58d]/45 bg-[#c9b58d]/[0.07] text-[#e7d6b1] shadow-[0_0_45px_-18px_rgba(201,181,141,0.65)] lg:mx-0"
            >
              <Check aria-hidden="true" size={24} strokeWidth={1.5} />
            </motion.div>

            <p className="mb-3 text-[9px] font-medium uppercase tracking-[0.24em] text-white/45">
              Your next chapter starts now
            </p>
            <h1
              id="waitlist-confirmation-title"
              className="font-display text-4xl font-medium leading-[1.04] tracking-[-0.045em] text-[#f0eee8] sm:text-5xl xl:text-6xl"
            >
              You’re on the list.
              <span className="mt-2 block text-gradient-steel">Stay ahead, {name.trim().split(/\s+/)[0]}.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-white/55 sm:text-base sm:leading-7 lg:mx-0">
              Your interest in AHEAD has been recorded. Thank you for being part of what comes next—we’ll keep you informed as early access approaches.
            </p>

            <div className="mx-auto mt-5 flex max-w-md flex-col gap-3 border-y border-white/[0.09] py-5 text-left sm:flex-row sm:items-start sm:gap-4 lg:mx-0">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.035] text-[#c9b58d]">
                <Mail aria-hidden="true" size={16} strokeWidth={1.6} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/40">Updates will be sent to</p>
                <p className="mt-1 break-all text-sm text-[#e8e3d7]">{email}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-[10px] uppercase tracking-[0.12em] text-white/45 lg:justify-start">
              <span className="inline-flex items-center gap-2"><ShieldCheck size={14} className="text-[#c9b58d]" /> No payment taken</span>
              <span className="inline-flex items-center gap-2"><Sparkles size={14} className="text-[#c9b58d]" /> Launch updates only</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.16, duration: 0.65, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="absolute -inset-3 rounded-[1.4rem] border border-[#c9b58d]/10" />
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0d1015] shadow-[0_35px_100px_-45px_rgba(0,0,0,0.95)]">
              <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3 sm:px-5">
                <span className="text-[9px] uppercase tracking-[0.22em] text-white/45">Your selected timepiece</span>
                <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.15em] text-[#c9b58d]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c9b58d]" /> Saved
                </span>
              </div>

              <div className="relative aspect-[16/9] overflow-hidden bg-[#11151b] sm:aspect-[2/1] lg:aspect-[16/7]">
                <img
                  src={watch.image}
                  alt={watch.name}
                  className="h-full w-full object-cover object-center opacity-90"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0d1015] via-transparent to-black/10" />
                <span className="absolute bottom-4 left-5 text-[8px] uppercase tracking-[0.24em] text-white/65">{watch.edition}</span>
              </div>

              <div className="p-4 sm:p-5">
                <h2 className="font-display text-2xl font-medium tracking-tight text-[#f0eee8]">{watch.name}</h2>
                <p className="mt-2 text-[10px] uppercase tracking-[0.17em] text-[#c9b58d]/80">{watch.description}</p>

                <div className="my-4 h-px bg-gradient-to-r from-[#c9b58d]/50 via-white/10 to-transparent" />

                <p className="mb-3 text-[9px] uppercase tracking-[0.22em] text-white/40">What happens next</p>
                <ol className="space-y-2.5">
                  {nextSteps.map((step, index) => (
                    <li key={step.number} className="flex gap-3">
                      <span className="mt-0.5 text-[10px] tabular-nums text-[#c9b58d]">{step.number}</span>
                      <div>
                        <p className="text-xs font-medium text-white/85">{step.title}</p>
                        <p className="mt-0.5 text-[10px] leading-4 text-white/45">{step.detail}</p>
                      </div>
                      {index === 0 && <Check aria-hidden="true" size={14} className="ml-auto mt-0.5 shrink-0 text-[#c9b58d]" />}
                    </li>
                  ))}
                </ol>

                <a
                  href="#collection"
                  className="group mt-4 inline-flex min-h-11 w-full items-center justify-between border border-white/[0.13] px-4 py-3 text-[9px] font-medium uppercase tracking-[0.2em] text-[#e8e3d7] transition-colors hover:border-[#c9b58d]/50 hover:bg-[#c9b58d]/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9b58d]"
                >
                  Continue exploring AHEAD
                  <ArrowRight aria-hidden="true" size={15} className="transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
            <p className="mt-3 text-center text-[9px] uppercase tracking-[0.2em] text-white/30">Be ahead of time · AHEAD Watches</p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default WaitlistConfirmation;

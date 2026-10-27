import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import WaitlistConfirmation from "./ui/WaitlistConfirmation";

const models = [
  { id: "5am", name: "5:00 AM Edition", description: "Focus · Restraint · Momentum" },
  { id: "founder", name: "Founder’s Steel", description: "Clarity · Craft · Ambition" },
  { id: "midnight", name: "Midnight Discipline", description: "Depth · Composure · Precision" },
] as const;

type ModelId = (typeof models)[number]["id"];
const isModelId = (value: string | null): value is ModelId =>
  models.some((model) => model.id === value);

const WaitlistSection = () => {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    model: (() => {
      const requestedModel = new URLSearchParams(window.location.search).get("model");
      return isModelId(requestedModel) ? requestedModel : "5am";
    })() as ModelId,
  });
  const [loading, setLoading] = useState(false);
  const selectedModel = models.find((model) => model.id === form.model) ?? models[0];

  useEffect(() => {
    const syncModel = (modelId: string | null) => {
      if (isModelId(modelId)) {
        setForm((current) => ({ ...current, model: modelId }));
      }
    };

    const handleModelSelected = (event: Event) => {
      syncModel((event as CustomEvent<string>).detail);
    };
    const handlePopState = () => {
      syncModel(new URLSearchParams(window.location.search).get("model"));
    };

    window.addEventListener("ahead:model-selected", handleModelSelected);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("ahead:model-selected", handleModelSelected);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleModelChange = (model: ModelId) => {
    setForm((current) => ({ ...current, model }));
    const url = new URL(window.location.href);
    url.searchParams.set("model", model);
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    window.dispatchEvent(new CustomEvent("ahead:model-selected", { detail: model }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || !form.model) {
      toast.error("Please add your name, phone number, and email.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) throw new Error("The waitlist service is not configured. Please try again later.");

      const response = await fetch(`${apiUrl}/api/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, preorder: "not_asked" }),
      });

      if (response.status === 409) {
        const data = await response.json().catch(() => ({}));
        toast.error(data.message || "You're already on the waitlist for this watch model.");
        return;
      }
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "We couldn’t submit your request. Please try again.");
      }
      setSubmitted(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return <WaitlistConfirmation name={form.name} email={form.email} model={form.model} />;

  return (
    <section id="waitlist" ref={ref} className="scroll-mt-20 bg-gradient-dark px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-steel-light/70">Your next chapter starts here</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-gradient-steel sm:text-4xl md:text-5xl">A place on the list. A step ahead.</h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">Three quick details. Your selected timepiece is already saved—no need to choose it again.</p>
        </div>

        <div className="grid overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] shadow-[0_30px_100px_-45px_rgba(0,0,0,0.85)] md:grid-cols-[0.8fr_1.2fr]">
          <div className="relative flex flex-col justify-between border-b border-white/10 bg-[radial-gradient(ellipse_at_top_left,rgba(190,170,125,0.13),transparent_65%)] p-6 sm:p-8 md:border-b-0 md:border-r md:p-10">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-steel-light/70">Your selection</p>
              <h3 className="mt-4 font-display text-2xl text-foreground sm:text-3xl">{selectedModel.name}</h3>
              <p className="mt-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">{selectedModel.description}</p>
              <div className="my-7 h-px w-14 bg-steel/60" />
              <p className="max-w-xs text-sm leading-7 text-muted-foreground">We’ll keep your interest attached to this concept, so you can focus on what matters: getting early access.</p>
            </div>
            <label className="mt-8 block">
              <span className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Want a different model?</span>
              <select
                aria-label="Change selected timepiece"
                value={form.model}
                onChange={(event) => handleModelChange(event.target.value as ModelId)}
                className="min-h-11 w-full rounded-lg border border-white/15 bg-[#0c0e13] px-3 py-3 text-sm text-foreground outline-none transition focus:border-steel/70 focus:ring-2 focus:ring-steel/20"
              >
                {models.map((model) => <option key={model.id} value={model.id}>{model.name}</option>)}
              </select>
            </label>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="space-y-5 p-6 sm:p-8 md:p-10"
          >
            <div>
              <label htmlFor="waitlist-name" className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/70">Full name</label>
              <input id="waitlist-name" type="text" placeholder="Your name" autoComplete="name" required maxLength={100} value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="min-h-12 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-steel/70 focus:ring-2 focus:ring-steel/15" />
            </div>
            <div>
              <label htmlFor="waitlist-email" className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/70">Email address</label>
              <input id="waitlist-email" type="email" placeholder="you@example.com" autoComplete="email" required maxLength={255} value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="min-h-12 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-steel/70 focus:ring-2 focus:ring-steel/15" />
            </div>
            <div>
              <label htmlFor="waitlist-phone" className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/70">Phone number</label>
              <input id="waitlist-phone" type="tel" placeholder="+91 98765 43210" autoComplete="tel" required maxLength={30} value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className="min-h-12 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-steel/70 focus:ring-2 focus:ring-steel/15" />
            </div>

            <p className="text-xs leading-5 text-muted-foreground">No payment required. We’ll only use these details for AHEAD early-access updates.</p>
            <button type="submit" disabled={loading} className="group flex min-h-12 w-full items-center justify-between rounded-lg bg-gradient-steel px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-[0_12px_30px_-15px_rgba(200,190,165,0.6)] transition duration-300 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-steel disabled:cursor-not-allowed disabled:opacity-55">
              <span>{loading ? "Saving your place…" : "Secure my early access"}</span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">↗</span>
            </button>
            <p className="text-center text-[10px] text-muted-foreground/60">By joining, you agree to receive updates about AHEAD. No spam.</p>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default WaitlistSection;

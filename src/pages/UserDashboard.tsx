import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import GlassCard from "@/components/GlassCard";
import ScrollReveal from "@/components/ScrollReveal";
import aheadLogo from "@/assets/Ahead-Logo-Transparent.png";
import watch5am from "@/assets/watch-5am.jpg";
import watchFounder from "@/assets/watch-founder.jpg";
import watchMidnight from "@/assets/watch-midnight.jpg";

const API = import.meta.env.VITE_API_URL;
const watchImages: Record<string, string> = { "5am": watch5am, founder: watchFounder, midnight: watchMidnight };
const watchNames: Record<string, string> = { "5am": "5:00 AM Edition", founder: "Founder's Steel", midnight: "Midnight Discipline" };
const watchDescriptions: Record<string, string> = {
  "5am": "Matte black dial. Minimal. Disciplined. For early risers who outwork everyone.",
  founder: "Silver casing. White dial. Authority. The choice of a founder.",
  midnight: "Deep navy dial. Steel precision. For those who master the midnight hour.",
};
const watchPrices: Record<string, string> = { "5am": "₹4,999", founder: "₹5,999", midnight: "₹5,499" };
const watchSpecs: Record<string, string[]> = {
  "5am": ["42mm case diameter", "Japanese Quartz movement", "Matte black stainless steel", "5ATM water resistant", "Sapphire crystal glass"],
  founder: ["40mm case diameter", "Swiss Quartz movement", "316L surgical steel", "10ATM water resistant", "Anti-reflective coating"],
  midnight: ["44mm case diameter", "Japanese Quartz movement", "Navy PVD coating", "5ATM water resistant", "Luminous markers"],
};

type PreorderValue = "yes" | "maybe" | "no" | "not_asked";
interface WaitlistEntry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  model: string;
  preorder: PreorderValue;
  createdAt: string;
  position?: number;
  status?: "pending" | "fulfilled";
}
interface Account extends WaitlistEntry {
  entries: WaitlistEntry[];
}

const interestLabels: Record<PreorderValue, string> = {
  yes: "Interested in pre-order",
  maybe: "Still deciding",
  no: "Not interested right now",
  not_asked: "Not decided",
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function UserDashboard() {
  const [user, setUser] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingEntry, setSavingEntry] = useState<string | null>(null);
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [grievanceSubject, setGrievanceSubject] = useState("");
  const [grievanceMessage, setGrievanceMessage] = useState("");
  const [sendingGrievance, setSendingGrievance] = useState(false);
  const navigate = useNavigate();

  const authHeaders = () => ({
    Authorization: "Bearer " + localStorage.getItem("user_token"),
    "Content-Type": "application/json",
  });

  const loadAccount = async () => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      navigate("/login");
      return;
    }
    if (!API) {
      toast.error("The account service is not configured.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(API + "/api/user/me", { headers: authHeaders() });
      if (!response.ok) throw new Error("Your session has expired. Please log in again.");
      const data = await response.json();
      const entries: WaitlistEntry[] = Array.isArray(data.entries) ? data.entries : [data];
      const account: Account = { ...data, entries };
      setUser(account);
      setProfileName(account.name || "");
      setProfilePhone(account.phone || "");
    } catch (error) {
      localStorage.removeItem("user_token");
      localStorage.removeItem("user_email");
      toast.error(error instanceof Error ? error.message : "Could not load your account.");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAccount();
    // loadAccount is intentionally invoked once for the current login session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const handleProfileSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profileName.trim() || !profilePhone.trim()) {
      toast.error("Please enter your name and phone number.");
      return;
    }
    setSavingProfile(true);
    try {
      const response = await fetch(API + "/api/user/profile", {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ name: profileName.trim(), phone: profilePhone.trim() }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Profile could not be updated.");
      setUser((current) => current ? {
        ...current,
        name: profileName.trim(),
        phone: profilePhone.trim(),
        entries: current.entries.map((entry) => ({ ...entry, name: profileName.trim(), phone: profilePhone.trim() })),
      } : current);
      setProfileOpen(false);
      toast.success("Your profile has been updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update your profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newPassword.length < 12) {
      toast.error("Use at least 12 characters for your new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("The new passwords do not match.");
      return;
    }
    setSavingPassword(true);
    try {
      const response = await fetch(API + "/api/user/password", {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Could not change password.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordOpen(false);
      toast.success("Your password has been changed.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not change password.");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleEntryUpdate = async (
    entry: WaitlistEntry,
    updates: Partial<Pick<WaitlistEntry, "preorder" | "model">>,
  ) => {
    if (savingEntry) return;
    if (
      (updates.preorder === undefined || updates.preorder === entry.preorder) &&
      (updates.model === undefined || updates.model === entry.model)
    ) return;
    setSavingEntry(entry._id);
    try {
      const response = await fetch(API + "/api/user/waitlist/" + encodeURIComponent(entry._id), {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(updates),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Your waitlist changes could not be saved.");
      setUser((current) => current ? {
        ...current,
        entries: current.entries.map((item) => item._id === entry._id ? { ...item, ...updates } : item),
      } : current);
      toast.success("Your waitlist changes have been saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update your waitlist.");
    } finally {
      setSavingEntry(null);
    }
  };

  const handleGrievance = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!grievanceSubject.trim() || !grievanceMessage.trim()) {
      toast.error("Please fill in both the subject and message.");
      return;
    }
    setSendingGrievance(true);
    try {
      const response = await fetch(API + "/api/user/grievance", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ subject: grievanceSubject.trim(), message: grievanceMessage.trim() }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Failed to submit your message.");
      toast.success("Message submitted. The AHEAD team will review it.");
      setGrievanceSubject("");
      setGrievanceMessage("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Connection error.");
    } finally {
      setSendingGrievance(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_email");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-steel-light/50 animate-pulse tracking-[0.25em] uppercase text-sm">AHEAD · Loading your account</div>
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-6">
          <a href="/" className="flex items-center gap-3" aria-label="AHEAD home">
            <img src={aheadLogo} alt="AHEAD Watches" className="h-9 w-auto sm:h-10" />
          </a>
          <div className="flex items-center gap-3 sm:gap-5">
            <span className="hidden text-sm text-muted-foreground sm:block">{user.name}</span>
            <button onClick={handleLogout} className="rounded-sm border border-border px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition hover:border-steel/60 hover:text-foreground sm:px-4">
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <ScrollReveal>
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-steel-light/70">Your private AHEAD space</p>
              <h1 className="font-display text-3xl font-bold text-gradient-steel sm:text-4xl">Welcome, {user.name}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Every timepiece you have your eye on, together in one place. Your waitlist details stay tied to your account.</p>
            </div>
            <div className="flex flex-wrap gap-2 self-start sm:self-auto">
              <button onClick={() => setProfileOpen((open) => !open)} className="min-h-11 rounded-sm border border-border px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] transition hover:border-steel/60">
                {profileOpen ? "Close profile editor" : "Edit contact details"}
              </button>
              <button onClick={() => setPasswordOpen((open) => !open)} className="min-h-11 rounded-sm border border-border px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] transition hover:border-steel/60">
                {passwordOpen ? "Close password editor" : "Change password"}
              </button>
            </div>
          </motion.section>
        </ScrollReveal>

        {profileOpen && (
          <ScrollReveal>
            <GlassCard className="mb-8">
              <h2 className="mb-1 font-display text-xl font-semibold">Your contact details</h2>
              <p className="mb-5 text-sm text-muted-foreground">Changes apply to all watch models on this account.</p>
              <form onSubmit={handleProfileSave} className="grid gap-4 md:grid-cols-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">
                  Full name
                  <input value={profileName} onChange={(event) => setProfileName(event.target.value)} autoComplete="name" maxLength={100} required className="mt-2 min-h-12 w-full rounded-sm border border-border bg-input px-4 py-3 text-sm normal-case tracking-normal text-foreground outline-none focus:ring-1 focus:ring-ring" />
                </label>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">
                  Phone number
                  <input value={profilePhone} onChange={(event) => setProfilePhone(event.target.value)} autoComplete="tel" maxLength={30} required className="mt-2 min-h-12 w-full rounded-sm border border-border bg-input px-4 py-3 text-sm normal-case tracking-normal text-foreground outline-none focus:ring-1 focus:ring-ring" />
                </label>
                <div className="flex items-center justify-between gap-4 md:col-span-2">
                  <p className="text-xs text-muted-foreground">Email: {user.email} <span className="ml-1">(account identifier)</span></p>
                  <button type="submit" disabled={savingProfile} className="min-h-11 rounded-sm bg-gradient-steel px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground disabled:opacity-50">
                    {savingProfile ? "Saving…" : "Save details"}
                  </button>
                </div>
              </form>
            </GlassCard>
          </ScrollReveal>
        )}

        {passwordOpen && (
          <ScrollReveal>
            <GlassCard className="mb-8">
              <h2 className="mb-1 font-display text-xl font-semibold">Change your password</h2>
              <p className="mb-5 text-sm text-muted-foreground">Use at least 12 characters. Your new password applies to every watch on this account.</p>
              <form onSubmit={handlePasswordChange} className="grid gap-4 md:grid-cols-3">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">
                  Current password
                  <input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoComplete="current-password" required className="mt-2 min-h-12 w-full rounded-sm border border-border bg-input px-4 py-3 text-sm normal-case tracking-normal text-foreground outline-none focus:ring-1 focus:ring-ring" />
                </label>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">
                  New password
                  <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" minLength={12} maxLength={128} required className="mt-2 min-h-12 w-full rounded-sm border border-border bg-input px-4 py-3 text-sm normal-case tracking-normal text-foreground outline-none focus:ring-1 focus:ring-ring" />
                </label>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">
                  Confirm new password
                  <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={12} maxLength={128} required className="mt-2 min-h-12 w-full rounded-sm border border-border bg-input px-4 py-3 text-sm normal-case tracking-normal text-foreground outline-none focus:ring-1 focus:ring-ring" />
                </label>
                <div className="md:col-span-3">
                  <button type="submit" disabled={savingPassword} className="min-h-11 rounded-sm bg-gradient-steel px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground disabled:opacity-50">
                    {savingPassword ? "Updating…" : "Update password"}
                  </button>
                </div>
              </form>
            </GlassCard>
          </ScrollReveal>
        )}

        <section className="mb-10 grid gap-4 sm:grid-cols-3">
          <GlassCard>
            <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Models on your list</p>
            <p className="font-display text-3xl font-bold">{user.entries.length.toString().padStart(2, "0")}</p>
          </GlassCard>
          <GlassCard>
            <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Account email</p>
            <p className="break-all text-sm font-medium">{user.email}</p>
          </GlassCard>
          <GlassCard>
            <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Account created</p>
            <p className="font-display text-xl font-semibold">{formatDate(user.createdAt)}</p>
          </GlassCard>
        </section>

        <section className="mb-12">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-steel-light/70">Your selections</p>
              <h2 className="font-display text-2xl font-semibold sm:text-3xl">Your waitlist</h2>
            </div>
            <a href="/#waitlist" className="text-xs text-muted-foreground underline decoration-border underline-offset-4 transition hover:text-foreground">Explore more models</a>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {user.entries.map((entry) => (
              <ScrollReveal key={entry._id}>
                <GlassCard className="h-full overflow-hidden !p-0">
                  <div className="grid sm:grid-cols-[0.85fr_1.15fr]">
                    <div className="relative min-h-64 bg-background sm:min-h-full">
                      <img src={watchImages[entry.model] || watchImages["5am"]} alt={watchNames[entry.model] || "AHEAD timepiece"} className="absolute inset-0 h-full w-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                        <p className="text-[9px] uppercase tracking-[0.22em] text-white/60">Selected timepiece</p>
                        <h3 className="mt-1 font-display text-xl font-semibold text-white">{watchNames[entry.model] || entry.model}</h3>
                      </div>
                    </div>
                    <div className="p-5 sm:p-6">
                      <div className="mb-5 flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Waitlist position</p>
                          <p className="mt-1 font-display text-2xl font-bold">#{entry.position || "—"}</p>
                        </div>
                        <span className="rounded-full border border-steel/30 px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-steel-light">{entry.status === "fulfilled" ? "Fulfilled" : "Pending"}</span>
                      </div>
                      <p className="mb-2 text-sm leading-6 text-muted-foreground">{watchDescriptions[entry.model] || "Your selected AHEAD timepiece."}</p>
                      <p className="mb-4 text-sm font-semibold">{watchPrices[entry.model] || "Price announced at launch"}</p>
                      <div className="mb-5 border-t border-border pt-4">
                        <p className="mb-3 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Specifications</p>
                        <ul className="space-y-2">
                          {(watchSpecs[entry.model] || []).map((spec) => (
                            <li key={spec} className="flex items-start gap-2 text-xs text-muted-foreground"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-steel" />{spec}</li>
                          ))}
                        </ul>
                      </div>
                      <label className="mb-4 block text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                        Selected model · editable
                        <select value={entry.model} onChange={(event) => void handleEntryUpdate(entry, { model: event.target.value })} disabled={savingEntry !== null} className="mt-2 min-h-11 w-full rounded-sm border border-border bg-input px-3 py-2 text-sm normal-case tracking-normal text-foreground outline-none focus:ring-1 focus:ring-ring disabled:opacity-60">
                          <option value="5am">5:00 AM Edition</option>
                          <option value="founder">Founder’s Steel</option>
                          <option value="midnight">Midnight Discipline</option>
                        </select>
                      </label>
                      <label className="block text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                        Your pre-order interest
                        <select value={entry.preorder} onChange={(event) => void handleEntryUpdate(entry, { preorder: event.target.value as PreorderValue })} disabled={savingEntry !== null} className="mt-2 min-h-11 w-full rounded-sm border border-border bg-input px-3 py-2 text-sm normal-case tracking-normal text-foreground outline-none focus:ring-1 focus:ring-ring disabled:opacity-60">
                          <option value="not_asked">Not decided</option>
                          <option value="yes">Interested in pre-order</option>
                          <option value="maybe">Still deciding</option>
                          <option value="no">Not interested right now</option>
                        </select>
                      </label>
                      <p className="mt-3 text-[10px] text-muted-foreground/70">Joined {formatDate(entry.createdAt)} · {interestLabels[entry.preorder]}</p>
                    </div>
                  </div>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <GlassCard>
            <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-steel-light/70">We're here to help</p>
            <h2 className="mb-3 font-display text-2xl font-semibold">Need a hand?</h2>
            <p className="text-sm leading-6 text-muted-foreground">Send a message to the AHEAD team about your account or waitlist. We’ll route it to the team for review.</p>
          </GlassCard>
          <GlassCard>
            <h2 className="mb-5 font-display text-xl font-semibold">Contact the AHEAD team</h2>
            <form onSubmit={handleGrievance} className="space-y-4">
              <label className="block text-xs text-muted-foreground">
                Subject
                <input type="text" placeholder="What can we help with?" value={grievanceSubject} onChange={(event) => setGrievanceSubject(event.target.value)} maxLength={200} required className="mt-2 min-h-11 w-full rounded-sm border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
              </label>
              <label className="block text-xs text-muted-foreground">
                Message
                <textarea placeholder="Tell us a little more…" value={grievanceMessage} onChange={(event) => setGrievanceMessage(event.target.value)} maxLength={1000} rows={4} required className="mt-2 w-full resize-y rounded-sm border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
              </label>
              <button type="submit" disabled={sendingGrievance} className="min-h-11 rounded-sm bg-gradient-steel px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground disabled:opacity-50">
                {sendingGrievance ? "Sending…" : "Send message"}
              </button>
            </form>
          </GlassCard>
        </section>
      </main>
      <footer className="border-t border-border px-4 py-6 text-center text-[9px] uppercase tracking-[0.22em] text-muted-foreground/60">AHEAD Watches · Be Ahead Of Time</footer>
    </div>
  );
}

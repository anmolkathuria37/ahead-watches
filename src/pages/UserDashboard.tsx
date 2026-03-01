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

interface UserData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  model: string;
  preorder: string;
  createdAt: string;
  position?: number;
  status?: string;
}

export default function UserDashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [grievanceSubject, setGrievanceSubject] = useState("");
  const [grievanceMessage, setGrievanceMessage] = useState("");
  const [sendingGrievance, setSendingGrievance] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetch(API + "/api/user/me", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("user_token");
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleGrievance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceSubject.trim() || !grievanceMessage.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    setSendingGrievance(true);
    try {
      const res = await fetch(API + "/api/user/grievance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("user_token"),
        },
        body: JSON.stringify({ subject: grievanceSubject, message: grievanceMessage }),
      });
      if (res.ok) {
        toast.success("Grievance submitted. We'll get back to you soon.");
        setGrievanceSubject("");
        setGrievanceMessage("");
      } else {
        toast.error("Failed to submit grievance");
      }
    } catch {
      toast.error("Connection error");
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
        <div className="text-steel-light/50 animate-pulse tracking-widest uppercase text-sm">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const statusColor = {
    interested: "text-emerald-400",
    maybe: "text-amber-400",
    "not interested": "text-red-400",
    fulfilled: "text-blue-400",
  };

  const interestStatus = user.preorder === "yes" ? "interested" : user.preorder === "maybe" ? "maybe" : "not interested";
  const displayStatus = user.status || interestStatus;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-3">
            <img src={aheadLogo} alt="AHEAD" className="h-10 w-auto" />
          </a>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">{user.name}</span>
            <button
              onClick={handleLogout}
              className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors border border-border px-4 py-2 rounded-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-10 max-w-5xl">
        {/* Welcome */}
        <ScrollReveal>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-10"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gradient-steel mb-2">
              Welcome, {user.name}
            </h1>
            <p className="text-muted-foreground">Your AHEAD dashboard — everything about your waitlist status.</p>
          </motion.div>
        </ScrollReveal>

        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <ScrollReveal delay={0}>
            <GlassCard>
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">Waitlist Status</p>
              <p className={`text-xl font-display font-bold capitalize ${statusColor[displayStatus as keyof typeof statusColor] || "text-foreground"}`}>
                {displayStatus}
              </p>
            </GlassCard>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <GlassCard>
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">Queue Position</p>
              <p className="text-xl font-display font-bold text-foreground">
                #{user.position || "—"}
              </p>
            </GlassCard>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <GlassCard>
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">Joined On</p>
              <p className="text-xl font-display font-bold text-foreground">
                {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </GlassCard>
          </ScrollReveal>
        </div>

        {/* Selected Watch */}
        <ScrollReveal delay={0.1}>
          <GlassCard className="mb-10">
            <h2 className="font-display text-xl font-bold text-foreground mb-6">Your Selected Watch</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square rounded-lg overflow-hidden bg-background">
                <img
                  src={watchImages[user.model]}
                  alt={watchNames[user.model]}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="font-display text-2xl font-bold text-gradient-steel mb-2">
                  {watchNames[user.model]}
                </h3>
                <p className="text-muted-foreground mb-4">{watchDescriptions[user.model]}</p>
                <p className="text-steel-light text-lg font-semibold mb-6">
                  Expected Price: {watchPrices[user.model]}
                </p>
                <div>
                  <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">Specifications</p>
                  <ul className="space-y-2">
                    {watchSpecs[user.model]?.map((spec) => (
                      <li key={spec} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-steel" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </GlassCard>
        </ScrollReveal>

        {/* Grievance Form */}
        <ScrollReveal delay={0.15}>
          <GlassCard>
            <h2 className="font-display text-xl font-bold text-foreground mb-6">Raise a Grievance</h2>
            <form onSubmit={handleGrievance} className="space-y-4">
              <input
                type="text"
                placeholder="Subject"
                value={grievanceSubject}
                onChange={(e) => setGrievanceSubject(e.target.value)}
                maxLength={200}
                className="w-full bg-input border border-border rounded-sm px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
              />
              <textarea
                placeholder="Describe your issue..."
                value={grievanceMessage}
                onChange={(e) => setGrievanceMessage(e.target.value)}
                maxLength={1000}
                rows={4}
                className="w-full bg-input border border-border rounded-sm px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all resize-none"
              />
              <button
                type="submit"
                disabled={sendingGrievance}
                className="bg-gradient-steel text-primary-foreground px-8 py-3 text-sm font-semibold tracking-widest uppercase rounded-sm transition-all duration-300 disabled:opacity-50"
              >
                {sendingGrievance ? "Submitting..." : "Submit Grievance"}
              </button>
            </form>
          </GlassCard>
        </ScrollReveal>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import aheadLogo from "@/assets/Ahead-Logo-Transparent.png";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + "/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user_token", data.token);
        localStorage.setItem("user_email", email);
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Enter your waitlist email first.");
      return;
    }
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      toast.error("The account service is not configured.");
      return;
    }
    setRecoveryLoading(true);
    try {
      const response = await fetch(apiUrl + "/api/user/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Could not request login details.");
      toast.success(data.message || "If your account exists, login details will be emailed shortly.");
      setRecoveryMode(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not request login details.");
    } finally {
      setRecoveryLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <img src={aheadLogo} alt="AHEAD" className="h-16 mx-auto mb-4 opacity-80" />
          <h1 className="font-display text-2xl font-bold text-foreground">{recoveryMode ? "Recover Your Access" : "Welcome Back"}</h1>
          <p className="text-muted-foreground text-sm mt-1">{recoveryMode ? "We’ll email fresh login details if this address has a waitlist account." : "Login with your waitlist email"}</p>
        </div>

        <div className="relative rounded-lg border border-border/50 bg-card/40 backdrop-blur-xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-steel-light/5 via-transparent to-transparent pointer-events-none" />
          <form onSubmit={recoveryMode ? handleRecovery : handleLogin} className="relative z-10 space-y-5">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-input border border-border rounded-sm px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
                placeholder="your@email.com"
              />
            </div>
            {!recoveryMode && (
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required={!recoveryMode}
                  className="w-full bg-input border border-border rounded-sm px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
                  placeholder="Your password"
                />
              </div>
            )}
            <button
              type="submit"
              disabled={recoveryMode ? recoveryLoading : loading}
              className="w-full bg-gradient-steel text-primary-foreground py-3.5 text-sm font-semibold tracking-widest uppercase rounded-sm transition-all duration-300 disabled:opacity-50"
            >
              {recoveryMode ? (recoveryLoading ? "Sending…" : "Email login details") : (loading ? "Authenticating..." : "Login")}
            </button>
            <button type="button" onClick={() => setRecoveryMode((mode) => !mode)} className="w-full text-xs text-muted-foreground underline underline-offset-4 transition hover:text-foreground">
              {recoveryMode ? "Back to login" : "Forgot your password?"}
            </button>
          </form>
        </div>

        <p className="text-center text-muted-foreground/60 text-xs mt-6">
          {recoveryMode ? "For your security, we never reveal whether an email is registered." : "Your login details are sent to your email when you join the waitlist."}
        </p>
      </motion.div>
    </div>
  );
}

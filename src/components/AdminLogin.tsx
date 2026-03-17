import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import aheadLogo from "@/assets/Ahead-Logo-Transparent.png";

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        import.meta.env.VITE_API_URL + "/api/admin/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("admin_token", data.token);
        onLogin();
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
      setLoading(false);
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
          <h1 className="font-display text-2xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground text-sm mt-1">Authorized access only</p>
        </div>

        <div className="relative rounded-lg border border-border/50 bg-card/40 backdrop-blur-xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-steel-light/5 via-transparent to-transparent pointer-events-none" />
          <form onSubmit={login} className="relative z-10 space-y-5">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-input border border-border rounded-sm px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
                placeholder="admin@aheadwatches.com"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-input border border-border rounded-sm px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
                placeholder="Enter password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-steel text-primary-foreground py-3.5 text-sm font-semibold tracking-widest uppercase rounded-sm transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Access Dashboard"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

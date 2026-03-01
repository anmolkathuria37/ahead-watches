import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import aheadLogo from "@/assets/Ahead-Logo-Transparent.png";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLoginOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-3">
          <img src={aheadLogo} alt="AHEAD" className="h-16 md:h-15 w-auto" />
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {["Philosophy", "Collection", "Waitlist"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Login Button */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setLoginOpen(!loginOpen)}
              className="border border-border text-foreground px-4 py-2 text-xs font-semibold tracking-widest uppercase rounded-sm hover:bg-secondary transition-all duration-300"
            >
              Login
            </button>

            <AnimatePresence>
              {loginOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border/50 bg-card/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden"
                >
                  <Link
                    to="/login"
                    onClick={() => setLoginOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors border-b border-border/30"
                  >
                    <span className="text-base">👤</span>
                    <div>
                      <p className="font-medium text-xs tracking-wider uppercase">User</p>
                      <p className="text-[10px] text-muted-foreground">Waitlist member</p>
                    </div>
                  </Link>
                  <Link
                    to="/admin"
                    onClick={() => setLoginOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors"
                  >
                    <span className="text-base">👑</span>
                    <div>
                      <p className="font-medium text-xs tracking-wider uppercase">Admin</p>
                      <p className="text-[10px] text-muted-foreground">Dashboard access</p>
                    </div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a
            href="#waitlist"
            className="bg-gradient-steel text-primary-foreground px-5 py-2 text-xs font-semibold tracking-widest uppercase rounded-sm hover:opacity-90 transition-opacity"
          >
            Join Waitlist
          </a>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;

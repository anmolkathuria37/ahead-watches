import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import aheadLogo from "@/assets/Ahead-Logo-Transparent.png";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
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

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navItems = ["Philosophy", "Collection", "Waitlist"];

  return (
    <>
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
          <a href="#" className="flex items-center gap-3 relative z-50">
            <img src={aheadLogo} alt="AHEAD Watches" className="h-14 md:h-16 w-auto" />
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-steel-light group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Login dropdown */}
            <div className="relative hidden md:block" ref={dropdownRef}>
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
              className="hidden md:inline-block bg-gradient-steel text-primary-foreground px-5 py-2 text-xs font-semibold tracking-widest uppercase rounded-sm hover:opacity-90 transition-opacity"
            >
              Join Waitlist
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden relative z-50 w-8 h-8 flex flex-col items-center justify-center gap-1.5"
              aria-label="Toggle menu"
            >
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="block w-6 h-px bg-foreground origin-center"
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block w-6 h-px bg-foreground"
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="block w-6 h-px bg-foreground origin-center"
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/98 backdrop-blur-2xl flex flex-col items-center justify-center gap-8"
          >
            {navItems.map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                onClick={() => setMobileOpen(false)}
                className="font-display text-2xl tracking-[0.3em] uppercase text-foreground/80 hover:text-foreground transition-colors"
              >
                {item}
              </motion.a>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col gap-4 mt-4"
            >
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="text-center border border-border text-foreground px-8 py-3 text-xs font-semibold tracking-widest uppercase rounded-sm"
              >
                User Login
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="text-center border border-border text-foreground px-8 py-3 text-xs font-semibold tracking-widest uppercase rounded-sm"
              >
                Admin Login
              </Link>
              <a
                href="#waitlist"
                onClick={() => setMobileOpen(false)}
                className="text-center bg-gradient-steel text-primary-foreground px-8 py-3 text-xs font-semibold tracking-widest uppercase rounded-sm"
              >
                Join Waitlist
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;

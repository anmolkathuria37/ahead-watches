import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import aheadLogo from "@/assets/Ahead-Logo-Transparent.png";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
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
      <div className="container mx-auto flex items-center justify-between px-6 py-4 ">
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
        <a
          href="#waitlist"
          className="bg-gradient-steel text-primary-foreground px-5 py-2 text-xs font-semibold tracking-widest uppercase rounded-sm hover:opacity-90 transition-opacity"
        >
          Join Waitlist
        </a>
      </div>
    </motion.header>
  );
};

export default Header;

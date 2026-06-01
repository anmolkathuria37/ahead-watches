import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = "404 — AHEAD";
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden px-6">
      {/* Ambient gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center max-w-md"
      >
        <div className="font-display text-[8rem] sm:text-[10rem] leading-none tracking-tight bg-gradient-to-b from-foreground via-foreground/70 to-foreground/20 bg-clip-text text-transparent">
          404
        </div>
        <div className="mt-2 text-xs tracking-[0.4em] uppercase text-muted-foreground">
          Out of Time
        </div>
        <h1 className="mt-6 font-display text-2xl sm:text-3xl text-foreground">
          This page is ahead of us.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <Link
          to="/"
          className="group mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium tracking-wider uppercase hover:scale-[1.03] transition-transform"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Return Home
        </Link>
      </motion.div>
    </main>
  );
};

export default NotFound;

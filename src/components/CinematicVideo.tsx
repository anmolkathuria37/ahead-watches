import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import aheadVideo from "@/assets/AHead-Video.mp4";

export default function CinematicVideo() {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { margin: "-20%" });

  useEffect(() => {
    if (!videoRef.current) return;
    if (inView) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [inView]);

  return (
    <section ref={ref} className="relative py-0 overflow-hidden">
      {/* Video */}
      <div className="relative h-[60vh] md:h-[80vh]">
        <video
          ref={videoRef}
          src={aheadVideo}
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover opacity-10 transition-opacity duration-1000"
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        <div className="absolute inset-0 bg-background/30" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-center px-6"
          >
            <p className="text-steel-dark text-sm tracking-[0.3em] uppercase mb-4 font-medium">
              The Vision
            </p>
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-gradient-steel tracking-tight mb-4">
              Precision Meets Purpose
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl font-light max-w-lg mx-auto">
              Every detail engineered for those who refuse to follow.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

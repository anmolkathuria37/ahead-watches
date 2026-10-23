import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import aheadVideo from "@/assets/AHead-Video.mp4";

export default function CinematicVideo() {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { margin: "-20%" });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (inView) {
      void video.play().catch(() => {
        // Autoplay can be blocked by browser or device settings.
      });
    } else {
      video.pause();
    }

    return () => video.pause();
  }, [inView]);

  return (
    <section ref={ref} aria-labelledby="vision-heading" className="relative overflow-hidden border-y border-white/[0.06]">
      <div className="relative h-[54vh] min-h-[380px] max-h-[760px] md:h-[76vh]">
        <video
          ref={videoRef}
          src={aheadVideo}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/35 to-background/65" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-background/55 via-transparent to-background/80" />

        <div className="relative z-10 flex h-full items-center px-6 sm:px-10 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
            className="mx-auto w-full max-w-7xl"
          >
            <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.32em] text-steel-light/80">
              <span className="h-px w-8 bg-steel-light/70" />
              The AHEAD philosophy
            </p>
            <h2 id="vision-heading" className="max-w-3xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-7xl">
              Precision for the life <span className="text-gradient-steel">you’re building.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-foreground/75 sm:text-lg sm:leading-8">
              Thoughtful details. Intentional design. A daily reminder to move with purpose.
            </p>
          </motion.div>
        </div>
        <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </div>
    </section>
  );
}

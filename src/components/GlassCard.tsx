import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg border border-border/50 bg-card/40 backdrop-blur-xl p-6",
        "shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
        hover && "transition-all duration-500 hover:border-steel/30 hover:shadow-[0_8px_40px_rgba(100,110,140,0.15)] hover:-translate-y-1",
        className
      )}
    >
      {/* Glass shimmer */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-steel-light/5 via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

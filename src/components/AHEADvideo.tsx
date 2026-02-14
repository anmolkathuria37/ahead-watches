import React from 'react'
import aheadVideo from "@/assets/ahead-video.mp4";
import { motion } from "framer-motion";

const AHEADvideo = () => {
  return (
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 1.2, ease: "easeOut" }}
  className="flex justify-center items-center my-10"
>
  <div
    className="
      relative
      w-[50%] h-auto
      rounded-3xl
      overflow-hidden

      border border-white/20
      bg-white/5
      backdrop-blur-xl

      shadow-[0_0_40px_10px_rgba(255,255,255,0.08)]
    "
  >
    <video
      src={aheadVideo}
      autoPlay
      muted
      loop
      playsInline
      className="w-full h-full object-cover"
    />
  </div>
</motion.div>

  )
}

export default AHEADvideo

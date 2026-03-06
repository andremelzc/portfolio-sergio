"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Hook para navegación
import { GalleryItem } from "@/types/gallery";

// --- COMPONENTE PARA SYSTEM CARDS (About / Contact) ---
function SystemCard({
  item,
  index,
  onTap,
  masonry = false,
  repositioning = false,
}: {
  item: GalleryItem;
  index: number;
  onTap?: () => void;
  masonry?: boolean;
  repositioning?: boolean;
}) {
  const controls = useAnimation();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    // Reduce initial stagger so flips happen sooner, and cap maximum delay
    const delay = Math.min(index * 0.3, 2);
    const loop = async () => {
      await new Promise((r) => setTimeout(r, delay * 1000));
      while (mounted) {
        // if a repositioning is in progress, wait and keep the front visible
        if (repositioning) {
          if (!mounted) break;
          await controls.start({ rotateY: 0, transition: { duration: 0 } });
          if (!mounted) break;
          await new Promise((r) => setTimeout(r, 500));
          continue;
        }
        // Wait a shorter time before starting the flip so it finishes before reshuffle
        await new Promise((r) => setTimeout(r, 2000));
        if (!mounted) break;
        await controls.start({
          rotateY: 180,
          transition: { duration: 0.5, ease: "easeInOut" },
        });
        // Short pause between front and back so the effect is noticeable but fast
        await new Promise((r) => setTimeout(r, 1000));
        if (!mounted) break;
        await controls.start({
          rotateY: 360,
          transition: { duration: 0.5, ease: "easeInOut" },
        });
        if (!mounted) break;
        // Reset via an explicit animation so the transform state is consistent
        await controls.start({ rotateY: 0, transition: { duration: 0 } });
      }
    };
    loop();
    return () => {
      mounted = false;
      controls.stop();
    };
  }, [controls, index, repositioning]);

  const containerClass = `relative w-full ${masonry ? "h-auto" : "h-full"} z-50 cursor-pointer group`;
  const faceClass = masonry ? "w-full" : "absolute inset-0 w-full h-full";
  const backFaceClass = masonry
    ? "w-full bg-black p-4 flex items-center justify-center"
    : "absolute inset-0 w-full h-full bg-black p-4 flex items-center justify-center";

  return (
    <motion.div
      className={containerClass}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.1 }}
      onClick={() => (onTap ? onTap() : router.push(`/${item.specialType}`))}
      whileHover={{
        scale: 1.05,
        filter: "invert(1) hue-rotate(180deg)",
        transition: { duration: 0.4 },
      }}
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
    >
      <motion.div
        animate={controls}
        initial={{ rotateY: 0 }}
        className={`${masonry ? "w-full" : "w-full h-full relative"}`}
        style={{ transformStyle: "preserve-3d", WebkitTransformStyle: "preserve-3d", willChange: "transform", transform: "translateZ(0)" }}
      >
        {/* FRENTE */}
        <div
          className={faceClass}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            WebkitTransformStyle: "preserve-3d",
          }}
        >
          <img
            src={item.src}
            alt={item.title}
            className={`block w-full ${masonry ? "h-auto" : "h-full"} object-cover`}
            style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "translateZ(0)" }}
          />
          {/* Título en hover — SystemCard */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-0 bg-black/40" />
            <h3
              className="relative font-light italic text-white text-center leading-tight break-words w-full px-3"
              style={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "clamp(16px, 25%, 38px)",
                letterSpacing: "0.3em",
              }}
            >
              {item.title}
            </h3>
          </div>
        </div>

        {/* REVERSO */}
        <div
          className={backFaceClass}
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <h3
            className="text-white italic text-center leading-tight"
            style={{
              fontFamily: "Roboto, sans-serif",
              fontSize: "clamp(14px, 18%, 28px)",
              letterSpacing: "0.3em",
              fontWeight: 300,
            }}
          >
            {item.title}
          </h3>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- COMPONENTE PRINCIPAL ---
export default function GalleryCard({
  item,
  index,
  onTap,
  masonry = false,
  repositioning = false,
}: {
  item: GalleryItem;
  index: number;
  onTap?: () => void;
  masonry?: boolean;
  repositioning?: boolean;
}) {
  const router = useRouter();

  if (item.specialType === "about" || item.specialType === "contact") {
    return (
      <SystemCard
        item={item}
        index={index}
        onTap={onTap}
        masonry={masonry}
        repositioning={repositioning}
      />
    );
  }

  if (item.specialType === "project") {
    return (
      <motion.div
        className={`relative w-full ${masonry ? "h-auto" : "h-full"} z-50 cursor-pointer overflow-hidden group bg-black`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() =>
          onTap ? onTap() : router.push(`/project/${item.slug || ""}`)
        }
        whileHover={{
          scale: 1.05,
          zIndex: 60,
          filter: "invert(1) hue-rotate(180deg)",
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <img
          src={item.src}
          alt={item.title}
          className={`w-full ${masonry ? "h-auto" : "h-full"} object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500`}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
          <div className="absolute inset-0 bg-black/40" />
          <h3
            className="relative font-medium italic text-white text-center leading-tight break-words w-full px-3"
            style={{
              fontFamily: "Roboto, sans-serif",
              fontSize: "clamp(11px, 15%, 22px)",
              letterSpacing: "0.1em",
            }}
          >
            {item.title}
          </h3>
        </div>
      </motion.div>
    );
  }
  return (
    <motion.div
      className={`relative w-full ${masonry ? "h-auto" : "h-full"} overflow-hidden bg-black`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: Math.random() * 0.5 }}
      onClick={onTap}
      whileHover={{
        scale: 1.02,
        zIndex: 40,
        filter: "invert(1) hue-rotate(180deg)",
      }}
    >
      <img
        src={item.src}
        alt="Atmosphere"
        className={`w-full ${masonry ? "h-auto" : "h-full"} object-cover transition-all duration-500 grayscale`}
      />
    </motion.div>
  );
}

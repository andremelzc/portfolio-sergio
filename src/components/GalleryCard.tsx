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
}: {
  item: GalleryItem;
  index: number;
  onTap?: () => void;
}) {
  const controls = useAnimation();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const delay = index * 2;
    const loop = async () => {
      await new Promise((r) => setTimeout(r, delay * 1000));
      while (mounted) {
        await new Promise((r) => setTimeout(r, 5000));
        if (!mounted) break;
        await controls.start({
          rotateY: 180,
          transition: { duration: 0.8, ease: "easeInOut" },
        });
        await new Promise((r) => setTimeout(r, 3000));
        if (!mounted) break;
        await controls.start({
          rotateY: 360,
          transition: { duration: 0.8, ease: "easeInOut" },
        });
        if (!mounted) break;
        controls.set({ rotateY: 0 });
      }
    };
    loop();
    return () => {
      mounted = false;
    };
  }, [controls, index]);

  return (
    <motion.div
      className="relative w-full h-full z-50 cursor-pointer group"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.1 }}
      onClick={() => (onTap ? onTap() : router.push(`/${item.specialType}`))}
      whileHover={{
        scale: 1.05,
        filter: "invert(1) hue-rotate(180deg)",
        transition: { duration: 0.4 },
      }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <motion.div
        animate={controls}
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* FRENTE */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <img
            src={item.src}
            alt={item.title}
            className="w-full h-full object-cover"
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
          className="absolute inset-0 w-full h-full bg-black flex items-center justify-center p-4"
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
}: {
  item: GalleryItem;
  index: number;
  onTap?: () => void;
}) {
  const router = useRouter();

  if (item.specialType === "about" || item.specialType === "contact") {
    return <SystemCard item={item} index={index} onTap={onTap} />;
  }

  if (item.specialType === "project") {
    return (
      <motion.div
        className="relative w-full h-full z-50 cursor-pointer overflow-hidden group bg-black"
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
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
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
      className="relative w-full h-full overflow-hidden bg-black"
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
        className="w-full h-full object-cover transition-all duration-500 grayscale"
      />
    </motion.div>
  );
}

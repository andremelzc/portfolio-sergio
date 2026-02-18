// components/GalleryCard.tsx
"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { GalleryItem } from "@/utils/galleryData";

function SpecialCard({ item, index }: { item: GalleryItem; index: number }) {
  const controls = useAnimation();

  useEffect(() => {
    // Delay escalonado para que no todas giren a la vez
    const delay = index * 1.2;

    const loop = async () => {
      await new Promise((r) => setTimeout(r, delay * 1000));
      while (true) {
        // Pausa mostrando el frente
        await new Promise((r) => setTimeout(r, 3000));
        // Gira hacia atrás (0 → 180)
        await controls.start({
          rotateY: 180,
          transition: { duration: 0.8, ease: "easeInOut" },
        });
        // Pausa mostrando el reverso
        await new Promise((r) => setTimeout(r, 3000));
        // Vuelve al frente (180 → 360/0)
        await controls.start({
          rotateY: 360,
          transition: { duration: 0.8, ease: "easeInOut" },
        });
        // Reset silencioso para que el loop sea infinito sin acumular grados
        controls.set({ rotateY: 0 });
      }
    };

    loop();
  }, []);

  return (
    <motion.div
      className="relative w-full h-full z-50 cursor-pointer"
      style={{ perspective: 800 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      {/* Contenedor que rota */}
      <motion.div
        animate={controls}
        style={{
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          position: "relative",
        }}
      >
        {/* FRENTE — imagen */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            position: "absolute",
            inset: 0,
          }}
        >
          <img
            src={item.src}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          {/* Overlay sutil para que no sea demasiado cruda */}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* REVERSO — información */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            position: "absolute",
            inset: 0,
          }}
          className="bg-white flex flex-col items-center justify-center p-6 text-center shadow-[0_0_30px_rgba(255,255,255,0.1)]"
        >
          <div className="border-2 border-black px-4 py-2 mb-2">
            <h3 className="text-xl font-bold uppercase tracking-widest text-black">
              {item.title}
            </h3>
          </div>
          <p className="text-xs text-gray-500 font-mono">{item.description}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function GalleryCard({
  item,
  index,
}: {
  item: GalleryItem;
  index: number;
}) {
  if (item.type === "special") {
    return <SpecialCard item={item} index={index} />;
  }

  return (
    <motion.div
      className="relative w-full h-full cursor-pointer overflow-hidden bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: Math.random() * 0.5 }}
      whileHover={{ scale: 1.05, zIndex: 40 }}
    >
      <img
        src={item.src}
        alt={`Gallery item ${item.id}`}
        className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
      />
      <div className="absolute inset-0 border border-white/10 pointer-events-none" />
    </motion.div>
  );
}

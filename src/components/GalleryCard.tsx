"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import Link from "next/link"; // NUEVO: Importamos Link de Next.js
import { GalleryItem } from "@/types/gallery";

// --- COMPONENTE PARA SYSTEM CARDS (About / Contact) ---
function SystemCard({ item, index }: { item: GalleryItem; index: number }) {
  const controls = useAnimation();

  useEffect(() => {
    // ... tu lógica de animación intacta ...
    const delay = index * 2;
    const loop = async () => {
      await new Promise((r) => setTimeout(r, delay * 1000));
      while (true) {
        await new Promise((r) => setTimeout(r, 5000));
        await controls.start({
          rotateY: 180,
          transition: { duration: 0.8, ease: "easeInOut" },
        });
        await new Promise((r) => setTimeout(r, 3000));
        await controls.start({
          rotateY: 360,
          transition: { duration: 0.8, ease: "easeInOut" },
        });
        controls.set({ rotateY: 0 });
      }
    };
    loop();
  }, [controls, index]);

  // NUEVO: Envolvemos todo en un Link dinámico
  // Si specialType es "about", el link será "/about"
  return (
    <Link
      href={`/${item.specialType}`}
      className="block w-full h-full relative z-50"
    >
      <motion.div
        className="relative w-full h-full cursor-pointer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        whileHover={{
          scale: 1.05,
          filter: "invert(1) hue-rotate(180deg)",
          transition: { duration: 0.4 },
        }}
      >
        <motion.div
          animate={controls}
          className="w-full h-full relative preserve-3d"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* FRENTE */}
          <div className="absolute inset-0 backface-hidden">
            <img src={item.src} className="w-full h-full object-cover" />
          </div>

          {/* REVERSO */}
          <div
            className="absolute inset-0 backface-hidden bg-black flex flex-col items-center justify-center p-4"
            style={{ transform: "rotateY(180deg)" }}
          >
            <h3
              className="text-3xl font-medium italic tracking-[0.2em] text-white text-center"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              {item.title}
            </h3>
            <p className="text-xs text-gray-500 mt-4 tracking-widest uppercase">
              {item.description}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </Link>
  );
}

// --- COMPONENTE PRINCIPAL ---
export default function GalleryCard({
  item,
  index,
}: {
  item: GalleryItem;
  index: number;
}) {
  // 1. SYSTEM CARDS
  if (item.specialType === "about" || item.specialType === "contact") {
    return <SystemCard item={item} index={index} />;
  }

  // 2. PROJECT CARDS (Nuevos trabajos) -> Estilo Experimental
  if (item.specialType === "project") {
    // NUEVO: Envolvemos en un Link hacia la ruta dinámica del proyecto
    // Usamos item.slug que agregamos en la refactorización anterior
    return (
      <Link
        href={`/project/${item.slug || ""}`}
        className="block w-full h-full relative z-50"
      >
        <motion.div
          className="relative w-full h-full cursor-pointer overflow-hidden group bg-black"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{
            scale: 1.05,
            zIndex: 60,
            filter: "invert(1) hue-rotate(180deg)",
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <img
            src={item.src}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
            <h3
              className="text-2xl font-medium italic tracking-[0.2em] text-white mix-blend-difference text-center px-2"
              style={{
                fontFamily: "Roboto, sans-serif",
                filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))",
              }}
            >
              {item.title}
            </h3>
          </div>
        </motion.div>
      </Link>
    );
  }

  // 3. RELLENO (Filler) -> Sigue siendo solo un motion.div (no es clickeable hacia otra página)
  return (
    <motion.div
      className="relative w-full h-full overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: Math.random() * 0.5 }}
      whileHover={{
        scale: 1.02,
        zIndex: 40,
        filter: "invert(1) hue-rotate(180deg)",
      }}
    >
      <img
        src={item.src}
        className="w-full h-full object-cover opacity-40 hover:opacity-80 transition-all duration-500 grayscale"
      />
    </motion.div>
  );
}

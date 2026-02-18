"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { GalleryItem } from "@/utils/galleryData";

// --- COMPONENTE PARA SYSTEM CARDS (About / Contact) ---
// Siguen rotando para llamar la atención
function SystemCard({ item, index }: { item: GalleryItem; index: number }) {
  const controls = useAnimation();

  useEffect(() => {
    const delay = index * 2; // Retraso para que no giren a la vez
    const loop = async () => {
      await new Promise((r) => setTimeout(r, delay * 1000));
      while (true) {
        await new Promise((r) => setTimeout(r, 5000)); // Giran cada 5s
        await controls.start({ rotateY: 180, transition: { duration: 0.8 } });
        await new Promise((r) => setTimeout(r, 3000));
        await controls.start({ rotateY: 360, transition: { duration: 0.8 } });
        controls.set({ rotateY: 0 });
      }
    };
    loop();
  }, []);

  return (
    <motion.div
      className="relative w-full h-full z-50 cursor-pointer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.1 }}
    >
      <motion.div
        animate={controls}
        className="w-full h-full relative preserve-3d"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* FRENTE: Foto limpia */}
        <div className="absolute inset-0 backface-hidden">
          <img
            src={item.src}
            className="w-full h-full object-cover border-2 border-white/20"
          />
        </div>
        {/* REVERSO: Info Negra con texto blanco */}
        <div
          className="absolute inset-0 backface-hidden bg-black flex flex-col items-center justify-center p-4 border-2 border-white"
          style={{ transform: "rotateY(180deg)" }}
        >
          <h3 className="text-xl font-bold uppercase tracking-widest text-white">
            {item.title}
          </h3>
          <p className="text-xs text-gray-400 mt-2">{item.description}</p>
        </div>
      </motion.div>
    </motion.div>
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
  // 1. SYSTEM CARDS (About, Contact) -> Componente especial que rota
  if (
    item.specialType === "about" ||
    item.specialType === "contact" ||
    item.specialType === "info"
  ) {
    return <SystemCard item={item} index={index} />;
  }

  // 2. PROJECT CARDS (Nuevos trabajos) -> Estilo "Polaroid Oscura" con Título
  if (item.specialType === "project") {
    return (
      <motion.div
        className="relative w-full h-full cursor-pointer overflow-hidden group bg-gray-900 border border-gray-700 shadow-xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1, zIndex: 60, borderColor: "#fff" }}
        transition={{ duration: 0.4 }}
      >
        <img
          src={item.src}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
        />

        {/* Etiqueta de Proyecto que aparece al Hover */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/90 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-white text-xs font-bold uppercase tracking-widest text-center">
            {item.title}
          </p>
          <p className="text-[10px] text-gray-400 text-center">
            {item.description}
          </p>
        </div>

        {/* Pequeño punto indicador de "Interactivo" */}
        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full opacity-50" />
      </motion.div>
    );
  }

  // 3. RELLENO (Filler) -> Fotos simples, más oscuras
  return (
    <motion.div
      className="relative w-full h-full overflow-hidden bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: Math.random() * 0.5 }}
      whileHover={{ scale: 1.05, zIndex: 40, filter: "brightness(1.2)" }}
    >
      <img
        src={item.src}
        className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-all duration-500 grayscale hover:grayscale-0"
      />
    </motion.div>
  );
}

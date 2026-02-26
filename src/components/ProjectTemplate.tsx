"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import { Project } from "@/types/gallery";
import { PortableText } from "@portabletext/react";

export default function ProjectTemplate({ project }: { project: Project }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const images = (project.galleryUrls || []).map(
    (url: string) => `${url}?w=1200&q=80&auto=format&fit=max`,
  );

  const nextImage = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <main className="bg-night text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-48">
        {/* ── Bloque viewport: título + carrusel siempre en 100svh ── */}
        <div className="h-svh flex flex-col px-4 md:px-12 py-8 md:py-12 gap-4 md:gap-6">
          {/* Título */}
          <h1 className="shrink-0 text-[10px] md:text-[11px] uppercase tracking-[0.5em] text-white/30 italic text-center mt-10 md:mt-0">
            {project.title}
          </h1>

          {/* Carrusel — ocupa todo el espacio restante del viewport */}
          <div className="flex-1 flex flex-col min-h-0">
            <div
              className="relative flex-1 min-h-0 overflow-hidden"
              onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
              onTouchEnd={(e) => {
                if (touchStart === null) return;
                const delta = touchStart - e.changedTouches[0].clientX;
                if (Math.abs(delta) > 50) delta > 0 ? nextImage() : prevImage();
                setTouchStart(null);
              }}
            >
              {/* Zonas de click */}
              <div className="absolute inset-0 z-20 flex">
                <div
                  className="w-1/2 h-full cursor-w-resize"
                  onClick={prevImage}
                />
                <div
                  className="w-1/2 h-full cursor-e-resize"
                  onClick={nextImage}
                />
              </div>

              <AnimatePresence custom={direction} mode="wait">
                <motion.img
                  key={index}
                  src={images[index]}
                  custom={direction}
                  variants={{
                    enter: (dir: number) => ({
                      x: dir > 0 ? "100%" : "-100%",
                      opacity: 0,
                    }),
                    center: { x: 0, opacity: 1 },
                    exit: (dir: number) => ({
                      x: dir > 0 ? "-100%" : "100%",
                      opacity: 0,
                    }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-contain grayscale"
                />
              </AnimatePresence>
            </div>

            {/* Contador */}
            <p className="shrink-0 mt-3 text-[10px] tracking-[0.4em] text-white/40 italic text-center">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(images.length).padStart(2, "0")}
            </p>
          </div>
        </div>

        {/* ── Texto: fuera del viewport, scrolleable ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="px-4 md:px-12 py-8 md:py-12 max-w-7xl self-center w-full"
        >
          <div className="text-sm md:text-xl font-extralight text-white italic leading-relaxed mx-auto">
            {typeof project.description === "string" ? (
              <p>{project.description}</p>
            ) : (
              <PortableText value={project.description as any} />
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import { Project } from "@/types/gallery";
import { PortableText } from "@portabletext/react";

export default function ProjectTemplate({ project }: { project: Project }) {
  const [index, setIndex] = useState(0);
  const images = project.galleryUrls || [];

  const nextImage = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <main className="min-h-screen bg-night text-white flex overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* SECCIÓN 1: Texto Centrado (Alineado a la izq) */}
        <section className="h-[50vh] flex items-center justify-center ml-24 md:ml-32 p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl w-full"
          >
            <h1 className="text-[10px] uppercase tracking-[0.5em] text-white/30 italic mb-8">
              {project.title}
            </h1>

            <div className="text-lg md:text-xl font-extralight text-white italic text-left leading-relaxed">
              {typeof project.description === "string" ? (
                <p>{project.description}</p>
              ) : (
                <PortableText value={project.description as any} />
              )}
            </div>
          </motion.div>
        </section>

        {/* SECCIÓN 2: Carrusel de Sustitución Directa */}
        <section className="h-[50vh] relative ml-24 md:ml-32 flex flex-col items-center justify-start group">
          <div className="relative w-full max-w-4xl h-[80%] overflow-hidden px-12">
            <AnimatePresence mode="wait">
              <motion.img
                key={index}
                src={images[index]}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full h-full object-contain grayscale"
              />
            </AnimatePresence>

            {/* Áreas de click invisibles para navegar (Experimental) */}
            <div
              className="absolute left-0 top-0 w-1/2 h-full cursor-w-resize z-10"
              onClick={prevImage}
            />
            <div
              className="absolute right-0 top-0 w-1/2 h-full cursor-e-resize z-10"
              onClick={nextImage}
            />
          </div>

          {/* Contador/Indicador minimalista */}
          <div className="mt-8 flex flex-col items-center">
            <p className="text-[10px] tracking-[0.4em] text-white/40 italic">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(images.length).padStart(2, "0")}
            </p>
            <div className="flex gap-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <button
                onClick={prevImage}
                className="text-[9px] uppercase tracking-widest hover:text-white text-white/20 transition-colors"
              >
                Prev
              </button>
              <span className="text-white/10">|</span>
              <button
                onClick={nextImage}
                className="text-[9px] uppercase tracking-widest hover:text-white text-white/20 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

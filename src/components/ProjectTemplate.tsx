"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import { Project } from "@/types/gallery";
import { PortableText } from "@portabletext/react";

export default function ProjectTemplate({ project }: { project: Project }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const images = project.galleryUrls || [];

  const nextImage = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <main className="h-svh bg-night text-white flex overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-48 overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center gap-10 px-4 md:px-12 py-8">
          {/* Texto */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl w-full"
          >
            <h1 className="text-[11px] uppercase tracking-[0.5em] text-white/30 italic mb-10">
              {project.title}
            </h1>
            <div className="text-base md:text-xl font-extralight text-white italic text-left leading-relaxed">
              {typeof project.description === "string" ? (
                <p>{project.description}</p>
              ) : (
                <PortableText value={project.description as any} />
              )}
            </div>
          </motion.div>

          {/* Carrusel */}
          <div className="max-w-xl w-full flex flex-col">
            <div
              className="relative w-full h-[38vh] overflow-hidden"
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
            <p className="mt-4 text-[10px] tracking-[0.4em] text-white/40 italic text-center">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(images.length).padStart(2, "0")}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

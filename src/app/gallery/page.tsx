"use client";

import GalleryCard from "@/components/GalleryCard";
import { generateGalleryItems } from "@/utils/galleryData";
import { generateLayout, Position } from "@/utils/layoutGenerator";
import { GalleryItem } from "@/types/gallery";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";

export default function GalleryPage() {
  const [positions, setPositions] = useState<(Position | null)[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const items = await generateGalleryItems();
        const layout = generateLayout(items.length, items);
        setGalleryItems(items);
        setPositions(layout);
      } catch (error) {
        console.error("Error cargando fotos de Sanity:", error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const goNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % galleryItems.length);
  };

  const goPrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) =>
      prev === 0 ? galleryItems.length - 1 : prev - 1,
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const delta = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      delta > 0 ? goNext() : goPrev();
    }
    setTouchStart(null);
  };

  if (isLoading) {
    return (
      <div className="h-svh w-screen bg-night flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-lg font-extralight text-white/20 italic"
        >
          .
        </motion.div>
      </div>
    );
  }

  // --- MOBILE: carrusel ---
  if (isMobile) {
    const variants = {
      enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
      center: { x: 0, opacity: 1 },
      exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
    };

    const item = galleryItems[currentIndex];
    const hasNaturalDims = item?.naturalWidth && item?.naturalHeight;
    const aspectRatio = hasNaturalDims
      ? item.naturalWidth! / item.naturalHeight!
      : 3 / 4;

    return (
      <div
        className="relative h-svh w-screen bg-night overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Sidebar />
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center p-8"
          >
            {/*
              Contenedor que respeta el aspect ratio de la imagen.
              max-w y max-h aseguran que nunca se salga de la pantalla con el padding.
            */}
            <div
              style={{ aspectRatio }}
              className="w-full max-w-full max-h-full"
            >
              <GalleryCard item={item} index={currentIndex} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // --- DESKTOP: scatter layout ---
  return (
    <div className="relative h-screen w-screen bg-night overflow-hidden">
      <div className="relative w-full h-full">
        {galleryItems.map((item, index) => {
          const pos = positions[index];
          if (!pos) return null;

          return (
            <div
              key={item.id}
              className="absolute"
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                width: `${pos.width}px`,
                height: `${pos.height}px`,
                transform: `rotate(${pos.rotation}deg)`,
                perspective: "1000px",
                transition: "top 0.5s ease, left 0.5s ease",
              }}
            >
              <GalleryCard item={item} index={index} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import GalleryCard from "@/components/GalleryCard";
import {
  fetchGalleryPool,
  pickGalleryItems,
  GalleryPool,
} from "@/utils/galleryData";
import { generateLayout, Position } from "@/utils/layoutGenerator";
import { GalleryItem } from "@/types/gallery";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";

const REFRESH_INTERVAL = 10000;

export default function GalleryPage() {
  const poolRef = useRef<GalleryPool | null>(null);
  const [dpr, setDpr] = useState(1);
  const [positions, setPositions] = useState<(Position | null)[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [overlayItem, setOverlayItem] = useState<GalleryItem | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Carga inicial — una sola llamada a Sanity
  useEffect(() => {
    const init = async () => {
      try {
        const pool = await fetchGalleryPool();
        poolRef.current = pool;
        const items = pickGalleryItems(pool);
        const devicePR = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
        setDpr(devicePR);
        const layout = generateLayout(items.length, items, devicePR);
        setGalleryItems(items);
        setPositions(layout);
      } catch (error) {
        console.error("Error cargando galería:", error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  // Refresco cada 10s — solo desktop, solo en memoria
  useEffect(() => {
    if (isMobile || isLoading) return;

    const interval = setInterval(() => {
      if (!poolRef.current) return;
      const items = pickGalleryItems(poolRef.current);
      const layout = generateLayout(items.length, items, dpr);
      // Flag that a reshuffle is happening so cards can pause animations
      setIsShuffling(true);
      setGalleryItems(items);
      setPositions(layout);
      // Allow CSS transitions to complete, then clear shuffling flag
      setTimeout(() => setIsShuffling(false), 600);
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [isMobile, isLoading]);

  // Recompute layout on resize / DPR changes so higher scaling fits more items
  useEffect(() => {
    if (isMobile) return;
    const handleResize = () => {
      const devicePR = window.devicePixelRatio || 1;
      setDpr(devicePR);
      if (!galleryItems || galleryItems.length === 0) return;
      const layout = generateLayout(galleryItems.length, galleryItems, devicePR);
      setIsShuffling(true);
      setPositions(layout);
      setTimeout(() => setIsShuffling(false), 600);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile, galleryItems]);

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
    if (Math.abs(delta) > 50) delta > 0 ? goNext() : goPrev();
    setTouchStart(null);
  };

  useEffect(() => {
    if (!isMobile || overlayItem) return;
    const timer = setInterval(goNext, 4000);
    return () => clearInterval(timer);
  }, [isMobile, currentIndex, overlayItem]);

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

  // --- MOBILE ---
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
        <div className="absolute inset-0 z-20 flex pointer-events-none">
          <div className="w-1/2 h-full pointer-events-auto" onClick={goPrev} />
          <div className="w-1/2 h-full pointer-events-auto" onClick={goNext} />
        </div>

        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center p-8 z-10"
          >
            <div
              style={{ aspectRatio }}
              className="w-full max-w-full max-h-full"
            >
              <GalleryCard
                item={{
                  ...item,
                  src: item.isFallback
                    ? item.src
                    : `${item.src}?w=800&q=75&auto=format`,
                }}
                index={currentIndex}
                onTap={() => setOverlayItem(item)}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {overlayItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-6"
              onClick={() => setOverlayItem(null)}
            >
              <motion.img
                src={
                  overlayItem.isFallback
                    ? overlayItem.src
                    : `${overlayItem.src}?w=1200&q=90&auto=format`
                }
                alt={overlayItem.title || ""}
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // --- DESKTOP ---
  return (
    <div className="relative h-svh w-screen bg-night overflow-hidden">
      <div className="relative w-full h-full overflow-hidden">
        {galleryItems.map((item, index) => {
          const pos = positions[index];
          if (!pos) return null;
          const reqWidth = Math.max(200, Math.round(pos.width * dpr));
          return (
            <div
              key={`${item.id}-${index}`}
              className="absolute"
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                width: `${pos.width}px`,
                height: `${pos.height}px`,
                perspective: "1000px",
                transition: "top 0.5s ease, left 0.5s ease",
              }}
            >
              <GalleryCard
                item={{
                  ...item,
                  src: item.isFallback
                    ? item.src
                    : `${item.src}?w=${reqWidth}&q=75&auto=format`,
                }}
                index={index}
                repositioning={isShuffling}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

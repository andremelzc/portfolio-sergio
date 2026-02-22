"use client";

import GalleryCard from "@/components/GalleryCard";
import { generateGalleryItems } from "@/utils/galleryData";
import { generateLayout, Position } from "@/utils/layoutGenerator";
import { GalleryItem } from "@/types/gallery";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function GalleryPage() {
  const [positions, setPositions] = useState<(Position | null)[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const items = await generateGalleryItems();
        setGalleryItems(items);
      } catch (error) {
        console.error("Error cargando fotos de Sanity:", error);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    if (galleryItems.length > 0) {
      const layout = generateLayout(galleryItems.length, galleryItems);
      setPositions(layout);
      setIsLoading(false);
    }
  }, [galleryItems]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-night flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-lg font-extralight text-white/20 italic"
        >
          {/* Opción A: Solo un punto o tu nombre muy tenue */}.
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen bg-night overflow-hidden">
      <div className="relative w-full h-full">
        {galleryItems.map((item, index) => {
          const pos = positions[index];

          if (!pos) {
            if (
              item.specialType === "about" ||
              item.specialType === "contact"
            ) {
              console.error(
                `CRÍTICO: System Card ${item.title} no tiene posición!`,
              );
            }
            return null;
          }

          return (
            <div
              key={item.id}
              className="absolute"
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                width: `${pos.width}px`,
                height: `${pos.height}px`,
                transform: `rotate(${pos.rotation}deg)`, // ✅ rotación aplicada
                perspective: "1000px", // ✅ perspectiva para el 3D flip
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

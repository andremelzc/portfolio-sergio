"use client";

import GalleryCard from "@/components/GalleryCard";
import { generateGalleryItems } from "@/utils/galleryData";
import { generateLayout, Position } from "@/utils/layoutGenerator";
import { useEffect, useState } from "react";

export default function GalleryPage() {
  const [positions, setPositions] = useState<(Position | null)[]>([]);
  const galleryItems = generateGalleryItems();

  useEffect(() => {
    // Identificar índices de items especiales
    const specialIndices = galleryItems
      .map((item, index) => (item.type === "special" ? index : -1))
      .filter((index) => index !== -1);

    const layout = generateLayout(galleryItems.length, specialIndices);
    setPositions(layout);
  }, [galleryItems.length]);

  if (positions.length === 0) {
    return (
      <div className="h-screen bg-whitesmoke flex items-center justify-center">
        <div className="text-sm text-dim-gray tracking-wider">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen bg-night overflow-hidden">
      <div className="relative w-full h-full">
        {galleryItems.map((item, index) => {
          const pos = positions[index];

          // Validación extra: las especiales SIEMPRE deben tener posición
          if (!pos) {
            if (item.type === "special") {
              console.error(
                `CRÍTICO: Card especial ${item.title} no tiene posición!`,
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

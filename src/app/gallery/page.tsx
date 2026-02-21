"use client";

import GalleryCard from "@/components/GalleryCard";
import { generateGalleryItems } from "@/utils/galleryData";
import { generateLayout, Position } from "@/utils/layoutGenerator";
import { GalleryItem } from "@/types/gallery"; // Importamos la interfaz que movimos
import { useEffect, useState } from "react";

export default function GalleryPage() {
  const [positions, setPositions] = useState<(Position | null)[]>([]);
  // 1. Iniciamos los items como un array vacío
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  // 2. Añadimos un estado de carga explícito
  const [isLoading, setIsLoading] = useState(true);

  // EFECTO 1: Traer los datos de Sanity
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

  // EFECTO 2: Calcular el layout SOLO cuando ya tenemos las fotos
  useEffect(() => {
    // Verificamos que ya llegaron los items
    if (galleryItems.length > 0) {
      const layout = generateLayout(galleryItems.length, galleryItems);
      setPositions(layout);
      setIsLoading(false); // Terminamos de cargar
    }
  }, [galleryItems]);

  // Si está cargando datos de internet o calculando posiciones, mostramos Loading
  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-night flex items-center justify-center">
        <div className="text-sm text-dim-gray tracking-wider animate-pulse">
          Cargando galería...
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen bg-night overflow-hidden">
      <div className="relative w-full h-full">
        {galleryItems.map((item, index) => {
          const pos = positions[index];

          // Si la posición es null (significa que no cupo en la pantalla), no renderizamos nada
          if (!pos) {
            // Solo lanzamos error si es una carta DE SISTEMA (About/Contact)
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
                // Añadimos una transición suave por si redimensionas la ventana
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

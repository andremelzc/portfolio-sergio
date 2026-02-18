"use client";

import GalleryCard from "@/components/GalleryCard";
import { generateGalleryItems } from "@/utils/galleryData";
import { generateLayout, Position } from "@/utils/layoutGenerator";
import { useEffect, useState } from "react";

export default function GalleryPage() {
  const [positions, setPositions] = useState<(Position | null)[]>([]);

  // OPTIMIZACIÓN: Generamos los items UNA sola vez al cargar la página.
  // Esto evita que se "re-barajen" las fotos si el componente se renderiza de nuevo.
  const [galleryItems] = useState(() => generateGalleryItems());

  useEffect(() => {
    // CAMBIO CLAVE AQUÍ:
    // Ya no calculamos 'specialIndices'.
    // Pasamos el array completo 'galleryItems' para que el generador sepa
    // qué es un Proyecto, qué es About y qué es Relleno.
    const layout = generateLayout(galleryItems.length, galleryItems);

    setPositions(layout);
  }, [galleryItems]);

  // Si no hay posiciones calculadas todavía, mostramos Loading
  if (positions.length === 0) {
    return (
      <div className="h-screen w-screen bg-night flex items-center justify-center">
        <div className="text-sm text-dim-gray tracking-wider animate-pulse">
          Loading gallery...
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
            // Solo lanzamos error si es una carta DE SISTEMA (About/Contact),
            // ya que esas son obligatorias. Los proyectos o relleno pueden faltar sin problema.
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

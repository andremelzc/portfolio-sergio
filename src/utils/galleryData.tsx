// utils/galleryData.ts

export interface GalleryItem {
  id: number;
  type: "image" | "special";
  src: string;
  specialType?: string;
  title?: string;
  description?: string;
}

export const generateGalleryItems = (): GalleryItem[] => {
  const items: GalleryItem[] = [];
  // Aumentamos a 50 para llenar los huecos en la pantalla
  const totalItems = 50;

  // --- CARDS ESPECIALES (About, Contact, Info) ---
  // Las definimos manualmente para que tengan sus títulos
  items.push({
    id: 100, // ID alto para diferenciar
    type: "special",
    specialType: "about",
    src: "/gallery/about.jpg", // Asegúrate de tener esta imagen o cambiarla
    title: "About",
    description: "Who I am",
  });

  items.push({
    id: 101,
    type: "special",
    specialType: "contact",
    src: "/gallery/contact.jpg",
    title: "Contact",
    description: "Get in touch",
  });

  items.push({
    id: 102,
    type: "special",
    specialType: "info",
    src: "/gallery/info.jpg",
    title: "Info",
    description: "Details",
  });

  // --- IMÁGENES DE RELLENO (FOTOS) ---
  // Rellenamos el resto con fotos normales
  // NOTA: Asumo que tienes imágenes tipo "1.jpg", "2.jpg" en public/gallery/
  // Si no las tienes, repetirán la misma para probar.
  const specialCount = 3;
  for (let i = 1; i <= totalItems - specialCount; i++) {
    items.push({
      id: i,
      type: "image",
      // Truco: Usamos (i % 5) + 1 para rotar entre 5 imágenes de ejemplo si no tienes 50
      // Si tienes 50 fotos reales, usa: `/gallery/${i}.jpg`
      src: `/gallery/${(i % 5) + 1}.jpg`,
    });
  }

  return items.sort((a, b) => a.id - b.id);
};

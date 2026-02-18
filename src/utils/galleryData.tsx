export interface GalleryItem {
  id: number;
  type: "image" | "special";
  src: string;
  // Añadimos 'project' como tipo válido
  specialType?: "about" | "contact" | "info" | "project";
  title?: string;
  description?: string;
}

export const generateGalleryItems = (): GalleryItem[] => {
  const items: GalleryItem[] = [];
  const totalItems = 50;

  // --- NIVEL 1: SYSTEM CARDS (Fijas) ---
  items.push({
    id: 100,
    type: "special",
    specialType: "about",
    src: "/gallery/about.jpg",
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

  // --- NIVEL 2: PROYECTOS (Simulados - El fotógrafo añadiría estos) ---
  items.push({
    id: 200,
    type: "special",
    specialType: "project",
    src: "/gallery/1.jpg",
    title: "Neon Nights",
    description: "Tokyo 2024",
  });
  items.push({
    id: 201,
    type: "special",
    specialType: "project",
    src: "/gallery/2.jpg",
    title: "Desert Dust",
    description: "Editorial",
  });
  items.push({
    id: 202,
    type: "special",
    specialType: "project",
    src: "/gallery/3.jpg",
    title: "Studio 54",
    description: "Portrait",
  });

  // --- NIVEL 3: RELLENO (Fotos decorativas) ---
  // Restamos los 5 items especiales que ya creamos
  for (let i = 1; i <= totalItems - 5; i++) {
    items.push({
      id: i,
      type: "image",
      src: `/gallery/${(i % 5) + 1}.jpg`,
    });
  }

  // Mezclamos un poco, pero mantenemos cierto orden para que las System no queden enterradas
  return items
    .sort((a, b) => (a.type === "special" ? -1 : 1))
    .sort(() => Math.random() - 0.5);
};

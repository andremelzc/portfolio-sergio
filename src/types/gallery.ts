export interface GalleryItem {
  id: number | string; // Lo cambiamos a string | number porque Sanity usa IDs de texto
  type: "image" | "special";
  src: string;
  specialType?: "about" | "contact" | "info" | "project";
  title?: string;
  description?: string;
  slug?: string; // Nuevo campo para proyectos
}

export interface GalleryItem {
  id: number | string; // Lo cambiamos a string | number porque Sanity usa IDs de texto
  type: "image" | "special";
  src: string;
  specialType?: "about" | "contact" | "info" | "project";
  title?: string;
  description?: string;
  slug?: string; // Nuevo campo para proyectos
  naturalWidth?: number; // Ancho original de la imagen
  naturalHeight?: number; // Alto original de la imagen
  isFallback?: boolean; // Para marcar items que no se cargaron bien
}

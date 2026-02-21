// utils/galleryData.ts
import { GalleryItem } from "@/types/gallery";
import { getGalleryData } from "@/sanity/lib/api";

export const generateGalleryItems = async (): Promise<GalleryItem[]> => {
  const items: GalleryItem[] = [];
  const totalItems = 50;
  let allFillerUrls: string[] = [];

  // 1. Llamamos a nuestra nueva capa de API
  const data = await getGalleryData();

  // 2. Extraemos la data (con fallback en caso de error)
  const settings = data?.settings;
  const projects = data?.projects;

  // --- 3. CARTAS DE SISTEMA ---
  items.push({
    id: "about-card",
    type: "special",
    specialType: "about",
    src: settings?.aboutUrl || "/gallery/about.jpg",
    title: "About",
    description: "Who I am",
    slug: "about", // Agregamos slug para navegación
  });

  items.push({
    id: "contact-card",
    type: "special",
    specialType: "contact",
    src: settings?.contactUrl || "/gallery/contact.jpg",
    title: "Contact",
    description: "Get in touch",
    slug: "contact", // Agregamos slug para navegación
  });

  // --- 4. PROYECTOS Y RELLENO ---
  if (projects && projects.length > 0) {
    projects.forEach((proj: any) => {
      if (proj.coverUrl) {
        items.push({
          id: proj._id,
          type: "special",
          specialType: "project",
          src: proj.coverUrl,
          title: proj.title || "Untitled",
          description: "View Project",
          slug: proj.slug,
        });
      }
      if (proj.galleryUrls?.length > 0) {
        allFillerUrls.push(...proj.galleryUrls);
      }
    });
    allFillerUrls = allFillerUrls.sort(() => Math.random() - 0.5);
  } else {
    items.push({
      id: 200,
      type: "special",
      specialType: "project",
      src: "/gallery/1.jpg",
      slug: "default-project",
      title: "Neon Nights",
    });
  }

  // --- 5. RELLENO ---
  const currentItemsCount = items.length;
  for (let i = 1; i <= totalItems - currentItemsCount; i++) {
    let fillerSrc = `/gallery/${(i % 5) + 1}.jpg`;
    if (allFillerUrls.length > 0) {
      fillerSrc = allFillerUrls[i % allFillerUrls.length];
    }
    items.push({ id: `filler-${i}`, type: "image", src: fillerSrc });
  }

  return items
    .sort((a, b) => (a.type === "special" ? -1 : 1))
    .sort(() => Math.random() - 0.5);
};

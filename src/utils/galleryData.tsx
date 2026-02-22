import { GalleryItem } from "@/types/gallery";
import { getGalleryData } from "@/sanity/lib/api";

// Carga las dimensiones naturales de una imagen desde su URL
const getImageDimensions = (
  src: string,
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () =>
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 300, height: 300 }); // fallback seguro
    img.src = src;
  });
};

export const generateGalleryItems = async (): Promise<GalleryItem[]> => {
  const items: GalleryItem[] = [];
  const totalItems = 50;
  let allFillerUrls: string[] = [];

  const data = await getGalleryData();
  const settings = data?.settings;
  const projects = data?.projects;

  // --- CARTAS DE SISTEMA ---
  const aboutSrc = settings?.aboutUrl || "/gallery/about.jpg";
  const contactSrc = settings?.contactUrl || "/gallery/contact.jpg";

  items.push({
    id: "about-card",
    type: "special",
    specialType: "about",
    src: aboutSrc,
    title: "About",
    description: "Who I am",
    slug: "about",
    isFallback: !settings?.aboutUrl, // ✅ es fallback si no viene de Sanity
  });

  items.push({
    id: "contact-card",
    type: "special",
    specialType: "contact",
    src: contactSrc,
    title: "Contact",
    description: "Get in touch",
    slug: "contact",
    isFallback: !settings?.contactUrl,
  });

  // --- PROYECTOS Y RELLENO ---
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
          isFallback: false,
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
      isFallback: true, // ✅ este sí es fallback
    });
  }

  // --- RELLENO ---
  const currentItemsCount = items.length;
  for (let i = 1; i <= totalItems - currentItemsCount; i++) {
    const hasSanityFiller = allFillerUrls.length > 0;
    const fillerSrc = hasSanityFiller
      ? allFillerUrls[i % allFillerUrls.length]
      : `/gallery/${(i % 5) + 1}.jpg`;

    items.push({
      id: `filler-${i}`,
      type: "image",
      src: fillerSrc,
      isFallback: !hasSanityFiller, // ✅ fallback si son las locales
    });
  }

  // Pre-cargamos dimensiones SOLO de las imágenes reales (no fallbacks)
  await Promise.all(
    items.map(async (item) => {
      if (!item.isFallback) {
        const dims = await getImageDimensions(item.src);
        item.naturalWidth = dims.width;
        item.naturalHeight = dims.height;
      }
    }),
  );

  return items.sort(() => Math.random() - 0.5);
};

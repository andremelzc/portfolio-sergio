import { GalleryItem } from "@/types/gallery";
import { getHomeData } from "@/sanity/lib/api";

export const generateGalleryItems = async (): Promise<GalleryItem[]> => {
  const items: GalleryItem[] = [];
  const totalItems = 50;

  // 1. Obtenemos los datos (Asegúrate que tu query incluya el campo 'metadata')
  const data = await getHomeData();
  const settings = data?.settings;
  const portfolio = data?.portfolio || [];

  // --- 2. CARTAS DE SISTEMA (About & Contact) ---
  // Para estas usamos un tamaño base ya que suelen ser fijas o similares
  const aboutSrc = settings?.about || "/gallery/about.jpg";
  const contactSrc = settings?.contact || "/gallery/contact.jpg";

  items.push({
    id: "about-card",
    type: "special",
    specialType: "about",
    src: aboutSrc,
    title: "About",
    description: "Who I am",
    slug: "about",
    isFallback: !settings?.about,
    naturalWidth: 800,
    naturalHeight: 1000,
  });

  items.push({
    id: "contact-card",
    type: "special",
    specialType: "contact",
    src: contactSrc,
    title: "Contact",
    description: "Get in touch",
    slug: "contact",
    isFallback: !settings?.contact,
    naturalWidth: 800,
    naturalHeight: 1000,
  });

  // --- 3. CONTENIDO DE PORTFOLIO (Proyectos y Galería suelta) ---
  portfolio.forEach((item: any) => {
    // Usamos las dimensiones que vienen de Sanity metadata
    const width = item.metadata?.dimensions?.width || 800;
    const height = item.metadata?.dimensions?.height || 1000;

    if (item.type === "project") {
      items.push({
        id: item.id,
        type: "special",
        specialType: "project",
        src: item.url,
        title: item.title || "Untitled Project",
        description: "View Project",
        slug: item.slug,
        isFallback: false,
        naturalWidth: width,
        naturalHeight: height,
      });
    } else {
      items.push({
        id: item.id,
        type: "image",
        src: item.url,
        isFallback: false,
        naturalWidth: width,
        naturalHeight: height,
      });
    }
  });

  // --- 4. RELLENO (Fallbacks locales) ---
  const currentCount = items.length;
  if (currentCount < totalItems) {
    for (let i = 1; i <= totalItems - currentCount; i++) {
      items.push({
        id: `fallback-filler-${i}`,
        type: "image",
        src: `/gallery/${(i % 5) + 1}.jpg`,
        isFallback: true,
        naturalWidth: 600, // Tamaño estimado para relleno local
        naturalHeight: 800,
      });
    }
  }

  // --- 5. MEZCLA FINAL ---
  // Ya no hay "await Promise.all", el retorno es inmediato tras la query
  return items.sort(() => Math.random() - 0.5);
};

import { GalleryItem } from "@/types/gallery";
import { getHomeData } from "@/sanity/lib/api";

export interface GalleryPool {
  mandatory: GalleryItem[];
  optional: GalleryItem[];
}

const TOTAL_ITEMS = 50;

export const fetchGalleryPool = async (): Promise<GalleryPool> => {
  const data = await getHomeData();
  const settings = data?.settings;
  const projects = data?.projects || [];
  const gallery = data?.gallery || [];

  const mandatory: GalleryItem[] = [];
  const optional: GalleryItem[] = [];

  mandatory.push({
    id: "about-card",
    type: "special",
    specialType: "about",
    src: settings?.about || "/gallery/about.jpg",
    title: "Sobre mí",
    description: "Who I am",
    slug: "about",
    isFallback: !settings?.about,
    naturalWidth: 800,
    naturalHeight: 1000,
  });

  mandatory.push({
    id: "contact-card",
    type: "special",
    specialType: "contact",
    src: settings?.contact || "/gallery/contact.jpg",
    title: "Contacto",
    description: "Get in touch",
    slug: "contact",
    isFallback: !settings?.contact,
    naturalWidth: 800,
    naturalHeight: 1000,
  });

  projects.forEach((item: any) => {
    mandatory.push({
      id: item.id,
      type: "special",
      specialType: "project",
      src: item.url,
      title: item.title || "Untitled Project",
      description: "View Project",
      slug: item.slug,
      isFallback: false,
      naturalWidth: item.metadata?.dimensions?.width || 800,
      naturalHeight: item.metadata?.dimensions?.height || 1000,
    });
  });

  gallery.forEach((item: any) => {
    optional.push({
      id: item.id,
      type: "image",
      src: item.url,
      isFallback: false,
      naturalWidth: item.metadata?.dimensions?.width || 800,
      naturalHeight: item.metadata?.dimensions?.height || 1000,
    });
  });

  return { mandatory, optional };
};

export const pickGalleryItems = (pool: GalleryPool): GalleryItem[] => {
  const { mandatory, optional } = pool;
  const spotsLeft = Math.max(0, TOTAL_ITEMS - mandatory.length);

  const shuffled = [...optional];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const combined = [...mandatory, ...shuffled.slice(0, spotsLeft)];
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  return combined;
};

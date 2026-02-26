import { client } from "./client";
import {
  allProjectSlugsQuery,
  galleryQuery,
  homeDataQuery,
  homeImagesQuery,
  projectBySlugQuery,
} from "./queries";

// Obtener datos para el home
export async function getHomeImages() {
  try {
    return await client.fetch(homeImagesQuery);
  } catch (error) {
    console.error("Error fetching home images:", error);
    return null;
  }
}

// Obtener datos para la Galería
export async function getGalleryData() {
  try {
    // Retorna { settings: {...}, projects: [...] }
    return await client.fetch(galleryQuery);
  } catch (error) {
    console.error("Error fetching gallery data:", error);
    return null;
  }
}

// Obtener un solo proyecto por su slug
export async function getProjectBySlug(slug: string) {
  try {
    return await client.fetch(projectBySlugQuery, { slug });
  } catch (error) {
    console.error(`Error fetching project with slug ${slug}:`, error);
    return null;
  }
}

// Obtener todos los proyectos
export async function getAllProjectSlugs() {
  try {
    return await client.fetch(allProjectSlugsQuery);
  } catch (error) {
    console.error("Error fetching project slugs:", error);
    return null;
  }
}

// Obtener las imágenes de la galería
export async function getHomeData() {
  const data = await client.fetch(homeDataQuery);

  return {
    settings: data.settings,
    // Desordenamos solo el portfolio para que el orden sea al azar
    portfolio: data.portfolio.sort(() => Math.random() - 0.5)
  };
}
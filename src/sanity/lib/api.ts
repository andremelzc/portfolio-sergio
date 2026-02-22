import { client } from "./client";
import {
  allProjectSlugsQuery,
  galleryQuery,
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

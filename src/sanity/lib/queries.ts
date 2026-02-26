import { groq } from "next-sanity";

// Query para las imágenes del home
export const homeImagesQuery = groq`
  *[_type == "settings"][0]{
    "image1": principalImage1.asset-> {
      "url": url,
      "metadata": metadata { dimensions }
    },
    "image2": principalImage2.asset-> {
      "url": url,
      "metadata": metadata { dimensions }
    }
  }
`;

// Query para la galería principal
export const galleryQuery = groq`{
  "settings": *[_type == "settings"][0]{
    "aboutUrl": aboutImage.asset->url,
    "contactUrl": contactImage.asset->url
  },
  "projects": *[_type == "project"]{
    _id,
    title,
    "slug": slug.current,
    "coverUrl": coverImage.asset->url,
    "galleryUrls": gallery[].asset->url
  }
}`;

// Query para la gallery
export const homeDataQuery = groq`{
  "settings": *[_type == "settings"][0] {
    "about": aboutImage.asset->url,
    "contact": contactImage.asset->url
  },
  "portfolio": (
    // Traemos las imágenes del Array de Gallery y las convertimos en una lista plana
    *[_type == "gallery"][0].images[] {
      "id": _key, // Las imágenes en arrays usan _key como ID
      "type": "gallery",
      "url": asset->url,
      "metadata": asset->metadata { dimensions }
    } + 
    // Las sumamos a los proyectos
    *[_type == "project"] {
      "id": _id,
      "type": "project",
      "title": title,
      "url": coverImage.asset->url,
      "slug": slug.current,
      "metadata": coverImage.asset->metadata { dimensions }
    }
  ) [0...39]
}`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    description,
    "galleryUrls": gallery[].asset->url,
    date
  }
`;

// Query para obtener solo los slugs de los proyectos
export const allProjectSlugsQuery = groq`
  *[_type == "project"]{
    title,
    "slug": slug.current
  }
`;

import { groq } from "next-sanity";

// Query para las imágenes del home
export const homeImagesQuery = groq`
  *[_type == "settings"][0]{
    "image1": principalImage1.asset->url,
    "image2": principalImage2.asset->url
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

// Query para un proyecto individual (Lo usaremos después)
export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    description,
    "coverUrl": coverImage.asset->url,
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

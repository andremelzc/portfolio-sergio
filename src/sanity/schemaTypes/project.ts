import { defineField, defineType } from "sanity";

export default defineType({
  name: "project",
  title: "Proyectos",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título del Proyecto",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Imagen de Portada (Galería Principal)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "gallery",
      title: "Galería del Proyecto",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      options: { layout: "grid" },
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
});

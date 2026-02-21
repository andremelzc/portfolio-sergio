import { defineField, defineType } from "sanity";

export default defineType({
  name: "settings",
  title: "Configuración Global",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título de la Web",
      type: "string",
    }),
    defineField({
      name: "principalImage1",
      title: "Imagen Principal 1",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "principalImage2",
      title: "Imagen Principal 2",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "aboutImage",
      title: "Imagen carta About",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "contactImage",
      title: "Imagen carta Contact",
      type: "image",
      options: { hotspot: true },
    }),
  ],
});

// src/sanity/schemaTypes/gallery.ts
export default {
  name: "gallery",
  title: "Galería Home",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Nombre de la Carpeta",
      type: "string",
      initialValue: "Imágenes Sueltas",
      readOnly: true, // Para que no lo borres por error
    },
    {
      name: "images",
      title: "Imágenes",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          // Si quieres que cada foto del array tenga un link opcional
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Texto descriptivo",
            },
          ],
        },
      ],
    },
  ],
};

import { type SchemaTypeDefinition } from "sanity";
import project from "./project";
import settings from "./settings";
import gallery from "./gallery";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [project, settings, gallery],
};

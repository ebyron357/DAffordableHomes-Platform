import type { SchemaTypeDefinition } from "sanity"
import { blockTypes } from "./blocks"
import { documentTypes } from "./documents"

export const schemaTypes: SchemaTypeDefinition[] = [...blockTypes, ...documentTypes] as SchemaTypeDefinition[]

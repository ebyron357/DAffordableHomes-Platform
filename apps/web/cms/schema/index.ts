import type { SchemaTypeDefinition } from "sanity"

import { article } from "./documents/article"
import { author } from "./documents/author"
import { category } from "./documents/category"
import { articleBodyBlocks } from "./objects/blocks"
import { richText } from "./objects/rich-text"
import { articleImage, faq, officialSource, relatedLink } from "./objects/shared"

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  article,
  author,
  category,
  // Shared objects
  richText,
  articleImage,
  faq,
  officialSource,
  relatedLink,
  // Editorial blocks
  ...articleBodyBlocks,
]

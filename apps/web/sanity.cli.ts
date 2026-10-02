import { defineCliConfig } from "sanity/cli"

import { SANITY_DATASET, SANITY_PROJECT_ID, STUDIO_BASE_PATH } from "./cms/env"

/**
 * CLI configuration for `sanity dataset import`, `sanity schema` and friends.
 * Values come from the environment; nothing is hardcoded.
 */
export default defineCliConfig({
  api: {
    projectId: SANITY_PROJECT_ID || undefined,
    dataset: SANITY_DATASET || undefined,
  },
  studioHost: undefined,
  autoUpdates: false,
  deployment: { appId: undefined },
  reactStrictMode: true,
  vite: (config) => config,
  server: { port: 3333 },
  project: { basePath: STUDIO_BASE_PATH },
})

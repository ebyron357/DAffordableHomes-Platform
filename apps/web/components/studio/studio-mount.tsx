"use client"

import { NextStudio } from "next-sanity/studio"

import config from "../../sanity.config"

/** Mounts the embedded Sanity Studio. Client-only by necessity. */
export function StudioMount() {
  return <NextStudio config={config} />
}

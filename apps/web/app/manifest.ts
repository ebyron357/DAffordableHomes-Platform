import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "D'Affordable Homes",
    short_name: "D'Affordable Homes",
    description: "Education-first homeownership guidance for Dallas–Fort Worth buyers.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#102b4e",
  }
}

import { permanentRedirect } from "next/navigation"

/**
 * /neighborhoods repeated /areas — the same Garland feature and the same city
 * list, with less around it — so two thin pages competed for one search intent.
 * It now redirects there (also in next.config.mjs, so the redirect happens
 * before rendering); its one unique passage, what the site will not publish
 * about a neighborhood, moved to /areas.
 */
export default function LegacyNeighborhoodsPage() {
  permanentRedirect("/areas")
}

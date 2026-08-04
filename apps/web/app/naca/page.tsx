import { permanentRedirect } from "next/navigation"

export default function LegacyNacaPage() {
  permanentRedirect("/programs/naca")
}

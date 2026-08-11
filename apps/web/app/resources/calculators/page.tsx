import { permanentRedirect } from "next/navigation"

export default function LegacyCalculatorHubPage() {
  permanentRedirect("/calculators")
}

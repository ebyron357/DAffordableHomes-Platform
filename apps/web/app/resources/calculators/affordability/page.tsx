import { permanentRedirect } from "next/navigation"

export default function LegacyAffordabilityCalculatorPage() {
  permanentRedirect("/calculators/affordability")
}

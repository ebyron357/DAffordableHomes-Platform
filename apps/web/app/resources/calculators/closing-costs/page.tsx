import { permanentRedirect } from "next/navigation"

export default function LegacyClosingCostCalculatorPage() {
  permanentRedirect("/calculators/closing-costs")
}

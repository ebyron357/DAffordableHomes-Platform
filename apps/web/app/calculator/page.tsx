import { permanentRedirect } from "next/navigation"

export default function LegacyCalculatorPage() {
  permanentRedirect("/calculators/mortgage-payment")
}

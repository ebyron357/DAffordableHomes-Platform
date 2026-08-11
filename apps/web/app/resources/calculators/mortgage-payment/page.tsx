import { permanentRedirect } from "next/navigation"

export default function LegacyMortgagePaymentCalculatorPage() {
  permanentRedirect("/calculators/mortgage-payment")
}

import { permanentRedirect } from "next/navigation"

export default function LegacyDownPaymentPlannerPage() {
  permanentRedirect("/calculators/down-payment")
}

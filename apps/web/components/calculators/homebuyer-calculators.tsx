"use client"

import { useMemo, useState } from "react"
import {
  calculateAffordability,
  calculateClosingCosts,
  calculateDownPaymentScenarios,
  calculateMortgage,
} from "@/lib/calculators"
import {
  CalculatorActions,
  CalculatorPanel,
  EstimateNotice,
  formatCurrency,
  NumberField,
  ResultRow,
  SelectField,
} from "@/components/calculators/calculator-ui"

export function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState(350_000)
  const [downPayment, setDownPayment] = useState(17_500)
  const [annualInterestRate, setAnnualInterestRate] = useState(6.5)
  const [termYears, setTermYears] = useState(30)
  const [annualPropertyTax, setAnnualPropertyTax] = useState(4_200)
  const [annualHomeInsurance, setAnnualHomeInsurance] = useState(1_800)
  const [monthlyHoa, setMonthlyHoa] = useState(0)
  const [annualPmiRate, setAnnualPmiRate] = useState(0.55)

  const result = useMemo(
    () =>
      calculateMortgage({
        homePrice,
        downPayment,
        annualInterestRate,
        termYears,
        annualPropertyTax,
        annualHomeInsurance,
        monthlyHoa,
        annualPmiRate,
      }),
    [
      annualHomeInsurance,
      annualInterestRate,
      annualPmiRate,
      annualPropertyTax,
      downPayment,
      homePrice,
      monthlyHoa,
      termYears,
    ],
  )

  return (
    <CalculatorPanel
      title="Your estimate"
      description="Adjust the assumptions to see principal, interest, taxes, insurance, mortgage insurance, and HOA costs together."
      fields={
        <>
          <NumberField id="mortgage-home-price" label="Home price" value={homePrice} onValueChange={setHomePrice} prefix="$" step={1_000} />
          <NumberField id="mortgage-down-payment" label="Down payment" value={downPayment} onValueChange={setDownPayment} prefix="$" step={500} max={homePrice} />
          <NumberField id="mortgage-interest-rate" label="Interest rate" value={annualInterestRate} onValueChange={setAnnualInterestRate} suffix="%" step={0.125} max={25} />
          <SelectField
            id="mortgage-term"
            label="Loan term"
            value={termYears}
            onValueChange={setTermYears}
            options={[
              { label: "15 years", value: 15 },
              { label: "20 years", value: 20 },
              { label: "30 years", value: 30 },
            ]}
          />
          <NumberField id="mortgage-property-tax" label="Annual property taxes" value={annualPropertyTax} onValueChange={setAnnualPropertyTax} prefix="$" step={100} />
          <NumberField id="mortgage-insurance" label="Annual homeowners insurance" value={annualHomeInsurance} onValueChange={setAnnualHomeInsurance} prefix="$" step={100} />
          <NumberField id="mortgage-hoa" label="Monthly HOA" value={monthlyHoa} onValueChange={setMonthlyHoa} prefix="$" step={25} />
          <NumberField
            id="mortgage-pmi"
            label="Estimated annual mortgage insurance rate"
            value={annualPmiRate}
            onValueChange={setAnnualPmiRate}
            suffix="%"
            step={0.05}
            max={5}
            help="Automatically removed from this estimate when the down payment reaches 20%."
          />
        </>
      }
      results={
        <div aria-live="polite">
          <p className="text-sm font-medium text-primary-foreground/80">Estimated monthly payment</p>
          <p className="mt-3 font-serif text-5xl font-normal tabular-nums text-primary-foreground">{formatCurrency(result.totalMonthlyPayment)}</p>
          <p className="mt-1 text-sm text-primary-foreground/75">per month</p>
          <div className="mt-6">
            <ResultRow label="Principal and interest" value={formatCurrency(result.principalAndInterest)} />
            <ResultRow label="Property taxes" value={formatCurrency(result.propertyTax)} />
            <ResultRow label="Homeowners insurance" value={formatCurrency(result.homeInsurance)} />
            <ResultRow label="Mortgage insurance" value={formatCurrency(result.pmi)} />
            <ResultRow label="HOA" value={formatCurrency(result.hoa)} />
            <ResultRow label="Estimated loan amount" value={formatCurrency(result.loanAmount)} emphasized />
          </div>
          <CalculatorActions secondaryHref="/resources/calculators/affordability" />
          <EstimateNotice />
        </div>
      }
    />
  )
}

export function AffordabilityCalculator() {
  const [annualHouseholdIncome, setAnnualHouseholdIncome] = useState(90_000)
  const [monthlyDebtPayments, setMonthlyDebtPayments] = useState(750)
  const [downPayment, setDownPayment] = useState(20_000)
  const [annualInterestRate, setAnnualInterestRate] = useState(6.5)
  const [termYears, setTermYears] = useState(30)
  const [annualPropertyTaxRate, setAnnualPropertyTaxRate] = useState(1.2)
  const [annualHomeInsuranceRate, setAnnualHomeInsuranceRate] = useState(0.5)
  const [monthlyHoa, setMonthlyHoa] = useState(0)
  const [annualPmiRate, setAnnualPmiRate] = useState(0.55)

  const result = useMemo(
    () =>
      calculateAffordability({
        annualHouseholdIncome,
        monthlyDebtPayments,
        downPayment,
        annualInterestRate,
        termYears,
        annualPropertyTaxRate,
        annualHomeInsuranceRate,
        monthlyHoa,
        annualPmiRate,
      }),
    [
      annualHomeInsuranceRate,
      annualHouseholdIncome,
      annualInterestRate,
      annualPmiRate,
      annualPropertyTaxRate,
      downPayment,
      monthlyDebtPayments,
      monthlyHoa,
      termYears,
    ],
  )

  return (
    <CalculatorPanel
      title="Estimate a planning price"
      description="See a conservative planning estimate based on household income, monthly debt, available down payment, and ownership costs."
      fields={
        <>
          <NumberField id="affordability-income" label="Annual household income" value={annualHouseholdIncome} onValueChange={setAnnualHouseholdIncome} prefix="$" step={1_000} />
          <NumberField id="affordability-debt" label="Monthly debt payments" value={monthlyDebtPayments} onValueChange={setMonthlyDebtPayments} prefix="$" step={25} help="Include recurring minimum payments such as auto, student, personal, and credit-card debt." />
          <NumberField id="affordability-down-payment" label="Available down payment" value={downPayment} onValueChange={setDownPayment} prefix="$" step={500} />
          <NumberField id="affordability-rate" label="Interest rate" value={annualInterestRate} onValueChange={setAnnualInterestRate} suffix="%" step={0.125} max={25} />
          <SelectField
            id="affordability-term"
            label="Loan term"
            value={termYears}
            onValueChange={setTermYears}
            options={[
              { label: "15 years", value: 15 },
              { label: "20 years", value: 20 },
              { label: "30 years", value: 30 },
            ]}
          />
          <NumberField id="affordability-tax-rate" label="Annual property tax rate" value={annualPropertyTaxRate} onValueChange={setAnnualPropertyTaxRate} suffix="%" step={0.1} max={10} />
          <NumberField id="affordability-insurance-rate" label="Annual insurance estimate" value={annualHomeInsuranceRate} onValueChange={setAnnualHomeInsuranceRate} suffix="%" step={0.1} max={10} />
          <NumberField id="affordability-hoa" label="Monthly HOA" value={monthlyHoa} onValueChange={setMonthlyHoa} prefix="$" step={25} />
          <NumberField id="affordability-pmi" label="Estimated annual mortgage insurance rate" value={annualPmiRate} onValueChange={setAnnualPmiRate} suffix="%" step={0.05} max={5} />
        </>
      }
      results={
        <div aria-live="polite">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">Estimated planning price</p>
          <p className="mt-2 text-4xl font-semibold tabular-nums text-primary">{formatCurrency(result.estimatedHomePrice)}</p>
          <p className="mt-1 text-sm text-muted-foreground">not a pre-approval or lending decision</p>
          <div className="mt-6">
            <ResultRow label="Monthly housing budget" value={formatCurrency(result.monthlyHousingBudget)} />
            <ResultRow label="Estimated monthly housing cost" value={formatCurrency(result.estimatedMonthlyPayment)} />
            <ResultRow label="Estimated loan amount" value={formatCurrency(result.estimatedLoanAmount)} />
            <ResultRow label="Estimated total debt-to-income" value={`${result.estimatedDebtToIncomeRatio.toFixed(1)}%`} emphasized />
          </div>
          <CalculatorActions secondaryHref="/resources/calculators/down-payment" />
          <EstimateNotice>
            Uses 28% housing and 36% total-debt planning limits. Lenders use their own underwriting rules, verified income, credit, reserves, program requirements, and property data.
          </EstimateNotice>
        </div>
      }
    />
  )
}

export function ClosingCostCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(350_000)
  const [downPayment, setDownPayment] = useState(17_500)
  const [closingCostRate, setClosingCostRate] = useState(3)
  const [prepaidEscrowRate, setPrepaidEscrowRate] = useState(1)
  const [sellerOrLenderCredits, setSellerOrLenderCredits] = useState(0)

  const result = useMemo(
    () =>
      calculateClosingCosts({
        purchasePrice,
        downPayment,
        closingCostRate,
        prepaidEscrowRate,
        sellerOrLenderCredits,
      }),
    [closingCostRate, downPayment, prepaidEscrowRate, purchasePrice, sellerOrLenderCredits],
  )

  return (
    <CalculatorPanel
      title="Estimate cash needed at closing"
      description="Build a planning estimate for the down payment, closing costs, prepaid items, escrow funding, and any known credits."
      fields={
        <>
          <NumberField id="closing-price" label="Purchase price" value={purchasePrice} onValueChange={setPurchasePrice} prefix="$" step={1_000} />
          <NumberField id="closing-down-payment" label="Down payment" value={downPayment} onValueChange={setDownPayment} prefix="$" step={500} max={purchasePrice} />
          <NumberField id="closing-rate" label="Estimated closing-cost rate" value={closingCostRate} onValueChange={setClosingCostRate} suffix="%" step={0.25} max={15} help="Use a lender estimate or local professional guidance when available." />
          <NumberField id="closing-prepaids" label="Estimated prepaids and escrow rate" value={prepaidEscrowRate} onValueChange={setPrepaidEscrowRate} suffix="%" step={0.25} max={10} help="May include prepaid interest, initial escrow deposits, insurance, and taxes." />
          <NumberField id="closing-credits" label="Seller or lender credits" value={sellerOrLenderCredits} onValueChange={setSellerOrLenderCredits} prefix="$" step={250} />
        </>
      }
      results={
        <div aria-live="polite">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">Estimated cash to close</p>
          <p className="mt-2 text-4xl font-semibold tabular-nums text-primary">{formatCurrency(result.estimatedCashToClose)}</p>
          <div className="mt-6">
            <ResultRow label="Down payment" value={formatCurrency(result.downPayment)} />
            <ResultRow label="Estimated closing costs" value={formatCurrency(result.estimatedClosingCosts)} />
            <ResultRow label="Estimated prepaids and escrow" value={formatCurrency(result.estimatedPrepaidsAndEscrow)} />
            <ResultRow label="Credits applied" value={`−${formatCurrency(result.credits)}`} emphasized />
          </div>
          <CalculatorActions secondaryHref="/resources/calculators/mortgage-payment" />
          <EstimateNotice>
            This is not a Loan Estimate. Actual cash to close can include program-specific fees, inspections, deposits, title charges, tax adjustments, insurance, and other transaction costs.
          </EstimateNotice>
        </div>
      }
    />
  )
}

export function DownPaymentPlanner() {
  const [homePrice, setHomePrice] = useState(350_000)
  const [annualInterestRate, setAnnualInterestRate] = useState(6.5)
  const [termYears, setTermYears] = useState(30)
  const [annualPropertyTax, setAnnualPropertyTax] = useState(4_200)
  const [annualHomeInsurance, setAnnualHomeInsurance] = useState(1_800)
  const [monthlyHoa, setMonthlyHoa] = useState(0)
  const [annualPmiRate, setAnnualPmiRate] = useState(0.55)

  const scenarios = useMemo(
    () =>
      calculateDownPaymentScenarios({
        homePrice,
        annualInterestRate,
        termYears,
        annualPropertyTax,
        annualHomeInsurance,
        monthlyHoa,
        annualPmiRate,
      }),
    [
      annualHomeInsurance,
      annualInterestRate,
      annualPmiRate,
      annualPropertyTax,
      homePrice,
      monthlyHoa,
      termYears,
    ],
  )

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-foreground">Compare common down-payment scenarios</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Compare upfront cash and estimated monthly housing costs. Available programs and required minimums depend on eligibility, property, lender, and loan type.
        </p>
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <NumberField id="down-price" label="Home price" value={homePrice} onValueChange={setHomePrice} prefix="$" step={1_000} />
          <NumberField id="down-rate" label="Interest rate" value={annualInterestRate} onValueChange={setAnnualInterestRate} suffix="%" step={0.125} max={25} />
          <SelectField
            id="down-term"
            label="Loan term"
            value={termYears}
            onValueChange={setTermYears}
            options={[
              { label: "15 years", value: 15 },
              { label: "20 years", value: 20 },
              { label: "30 years", value: 30 },
            ]}
          />
          <NumberField id="down-tax" label="Annual property taxes" value={annualPropertyTax} onValueChange={setAnnualPropertyTax} prefix="$" step={100} />
          <NumberField id="down-insurance" label="Annual homeowners insurance" value={annualHomeInsurance} onValueChange={setAnnualHomeInsurance} prefix="$" step={100} />
          <NumberField id="down-hoa" label="Monthly HOA" value={monthlyHoa} onValueChange={setMonthlyHoa} prefix="$" step={25} />
          <NumberField id="down-pmi" label="Estimated annual mortgage insurance rate" value={annualPmiRate} onValueChange={setAnnualPmiRate} suffix="%" step={0.05} max={5} />
        </div>
      </div>

      <div className="border-t border-border bg-muted/40 p-4 sm:p-8">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left text-sm">
            <caption className="sr-only">Down-payment scenarios and estimated monthly costs</caption>
            <thead>
              <tr className="text-muted-foreground">
                <th scope="col" className="border-b border-border px-4 py-3 font-medium">Down payment</th>
                <th scope="col" className="border-b border-border px-4 py-3 font-medium">Cash amount</th>
                <th scope="col" className="border-b border-border px-4 py-3 font-medium">Loan amount</th>
                <th scope="col" className="border-b border-border px-4 py-3 font-medium">Mortgage insurance</th>
                <th scope="col" className="border-b border-border px-4 py-3 font-medium">Estimated monthly cost</th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((scenario) => (
                <tr key={scenario.percentage} className="text-foreground">
                  <th scope="row" className="border-b border-border px-4 py-4 text-base font-semibold">{scenario.percentage}%</th>
                  <td className="border-b border-border px-4 py-4 tabular-nums">{formatCurrency(scenario.downPayment)}</td>
                  <td className="border-b border-border px-4 py-4 tabular-nums">{formatCurrency(scenario.loanAmount)}</td>
                  <td className="border-b border-border px-4 py-4 tabular-nums">{scenario.pmi > 0 ? `${formatCurrency(scenario.pmi)}/mo` : "Not included"}</td>
                  <td className="border-b border-border px-4 py-4 text-base font-semibold tabular-nums">{formatCurrency(scenario.totalMonthlyPayment)}/mo</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <CalculatorActions secondaryHref="/resources/calculators/closing-costs" />
        </div>
        <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
          Planning estimates only. A 20% down payment often removes conventional mortgage insurance, but program rules vary. Lower-down-payment programs may have different insurance structures and eligibility requirements.
        </p>
      </div>
    </div>
  )
}

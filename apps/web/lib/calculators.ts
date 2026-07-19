export type MortgageInput = {
  homePrice: number
  downPayment: number
  annualInterestRate: number
  termYears: number
  annualPropertyTax: number
  annualHomeInsurance: number
  monthlyHoa: number
  annualPmiRate: number
}

export type MortgageResult = {
  loanAmount: number
  principalAndInterest: number
  propertyTax: number
  homeInsurance: number
  pmi: number
  hoa: number
  totalMonthlyPayment: number
}

export type AffordabilityInput = {
  annualHouseholdIncome: number
  monthlyDebtPayments: number
  downPayment: number
  annualInterestRate: number
  termYears: number
  annualPropertyTaxRate: number
  annualHomeInsuranceRate: number
  monthlyHoa: number
  annualPmiRate: number
}

export type AffordabilityResult = {
  estimatedHomePrice: number
  monthlyHousingBudget: number
  estimatedMonthlyPayment: number
  estimatedLoanAmount: number
  estimatedDebtToIncomeRatio: number
}

export type ClosingCostInput = {
  purchasePrice: number
  downPayment: number
  closingCostRate: number
  prepaidEscrowRate: number
  sellerOrLenderCredits: number
}

export type ClosingCostResult = {
  downPayment: number
  estimatedClosingCosts: number
  estimatedPrepaidsAndEscrow: number
  credits: number
  estimatedCashToClose: number
}

export type DownPaymentScenario = MortgageResult & {
  percentage: number
  downPayment: number
}

function finiteOrZero(value: number) {
  return Number.isFinite(value) ? value : 0
}

function nonNegative(value: number) {
  return Math.max(0, finiteOrZero(value))
}

function roundCurrency(value: number) {
  return Math.round((finiteOrZero(value) + Number.EPSILON) * 100) / 100
}

export function calculatePrincipalAndInterest(
  principal: number,
  annualInterestRate: number,
  termYears: number,
) {
  const normalizedPrincipal = nonNegative(principal)
  const numberOfPayments = Math.max(1, Math.round(nonNegative(termYears) * 12))

  if (normalizedPrincipal === 0) return 0

  const monthlyRate = nonNegative(annualInterestRate) / 100 / 12
  if (monthlyRate === 0) return roundCurrency(normalizedPrincipal / numberOfPayments)

  const growth = (1 + monthlyRate) ** numberOfPayments
  const payment = normalizedPrincipal * ((monthlyRate * growth) / (growth - 1))

  return roundCurrency(payment)
}

export function calculateMortgage(input: MortgageInput): MortgageResult {
  const homePrice = nonNegative(input.homePrice)
  const downPayment = Math.min(homePrice, nonNegative(input.downPayment))
  const loanAmount = homePrice - downPayment
  const downPaymentPercentage = homePrice > 0 ? (downPayment / homePrice) * 100 : 0
  const principalAndInterest = calculatePrincipalAndInterest(
    loanAmount,
    input.annualInterestRate,
    input.termYears,
  )
  const propertyTax = nonNegative(input.annualPropertyTax) / 12
  const homeInsurance = nonNegative(input.annualHomeInsurance) / 12
  const pmi =
    downPaymentPercentage >= 20
      ? 0
      : (loanAmount * (nonNegative(input.annualPmiRate) / 100)) / 12
  const hoa = nonNegative(input.monthlyHoa)

  return {
    loanAmount: roundCurrency(loanAmount),
    principalAndInterest,
    propertyTax: roundCurrency(propertyTax),
    homeInsurance: roundCurrency(homeInsurance),
    pmi: roundCurrency(pmi),
    hoa: roundCurrency(hoa),
    totalMonthlyPayment: roundCurrency(
      principalAndInterest + propertyTax + homeInsurance + pmi + hoa,
    ),
  }
}

export function calculateAffordability(input: AffordabilityInput): AffordabilityResult {
  const monthlyIncome = nonNegative(input.annualHouseholdIncome) / 12
  const monthlyDebt = nonNegative(input.monthlyDebtPayments)
  const frontEndHousingLimit = monthlyIncome * 0.28
  const backEndHousingLimit = Math.max(0, monthlyIncome * 0.36 - monthlyDebt)
  const monthlyHousingBudget = Math.min(frontEndHousingLimit, backEndHousingLimit)
  const downPayment = nonNegative(input.downPayment)

  let low = 0
  let high = 5_000_000

  for (let index = 0; index < 60; index += 1) {
    const candidatePrice = (low + high) / 2
    const mortgage = calculateMortgage({
      homePrice: candidatePrice,
      downPayment,
      annualInterestRate: input.annualInterestRate,
      termYears: input.termYears,
      annualPropertyTax: candidatePrice * (nonNegative(input.annualPropertyTaxRate) / 100),
      annualHomeInsurance: candidatePrice * (nonNegative(input.annualHomeInsuranceRate) / 100),
      monthlyHoa: input.monthlyHoa,
      annualPmiRate: input.annualPmiRate,
    })

    if (mortgage.totalMonthlyPayment <= monthlyHousingBudget) {
      low = candidatePrice
    } else {
      high = candidatePrice
    }
  }

  const estimatedHomePrice = Math.max(0, Math.floor(low / 100) * 100)
  const mortgage = calculateMortgage({
    homePrice: estimatedHomePrice,
    downPayment,
    annualInterestRate: input.annualInterestRate,
    termYears: input.termYears,
    annualPropertyTax: estimatedHomePrice * (nonNegative(input.annualPropertyTaxRate) / 100),
    annualHomeInsurance: estimatedHomePrice * (nonNegative(input.annualHomeInsuranceRate) / 100),
    monthlyHoa: input.monthlyHoa,
    annualPmiRate: input.annualPmiRate,
  })
  const debtToIncomeRatio =
    monthlyIncome > 0
      ? ((monthlyDebt + mortgage.totalMonthlyPayment) / monthlyIncome) * 100
      : 0

  return {
    estimatedHomePrice: roundCurrency(estimatedHomePrice),
    monthlyHousingBudget: roundCurrency(monthlyHousingBudget),
    estimatedMonthlyPayment: mortgage.totalMonthlyPayment,
    estimatedLoanAmount: mortgage.loanAmount,
    estimatedDebtToIncomeRatio: roundCurrency(debtToIncomeRatio),
  }
}

export function calculateClosingCosts(input: ClosingCostInput): ClosingCostResult {
  const purchasePrice = nonNegative(input.purchasePrice)
  const downPayment = Math.min(purchasePrice, nonNegative(input.downPayment))
  const estimatedClosingCosts = purchasePrice * (nonNegative(input.closingCostRate) / 100)
  const estimatedPrepaidsAndEscrow = purchasePrice * (nonNegative(input.prepaidEscrowRate) / 100)
  const credits = Math.min(
    downPayment + estimatedClosingCosts + estimatedPrepaidsAndEscrow,
    nonNegative(input.sellerOrLenderCredits),
  )

  return {
    downPayment: roundCurrency(downPayment),
    estimatedClosingCosts: roundCurrency(estimatedClosingCosts),
    estimatedPrepaidsAndEscrow: roundCurrency(estimatedPrepaidsAndEscrow),
    credits: roundCurrency(credits),
    estimatedCashToClose: roundCurrency(
      downPayment + estimatedClosingCosts + estimatedPrepaidsAndEscrow - credits,
    ),
  }
}

export function calculateDownPaymentScenarios(
  mortgageInput: Omit<MortgageInput, "downPayment">,
  percentages: number[] = [3, 3.5, 5, 10, 20],
): DownPaymentScenario[] {
  const homePrice = nonNegative(mortgageInput.homePrice)

  return percentages.map((percentage) => {
    const normalizedPercentage = Math.min(100, nonNegative(percentage))
    const downPayment = homePrice * (normalizedPercentage / 100)
    const mortgage = calculateMortgage({ ...mortgageInput, downPayment })

    return {
      percentage: normalizedPercentage,
      downPayment: roundCurrency(downPayment),
      ...mortgage,
    }
  })
}

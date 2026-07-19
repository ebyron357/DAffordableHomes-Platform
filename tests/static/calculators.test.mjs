import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  calculateAffordability,
  calculateClosingCosts,
  calculateDownPaymentScenarios,
  calculateMortgage,
  calculatePrincipalAndInterest
} from '../../apps/web/lib/calculators.ts';

test('principal and interest uses the standard fixed-rate amortization formula', () => {
  const payment = calculatePrincipalAndInterest(300_000, 6, 30);
  assert.equal(payment, 1_798.65);
});

test('mortgage estimate includes ownership costs and removes PMI at 20 percent down', () => {
  const result = calculateMortgage({
    homePrice: 400_000,
    downPayment: 80_000,
    annualInterestRate: 6,
    termYears: 30,
    annualPropertyTax: 4_800,
    annualHomeInsurance: 1_800,
    monthlyHoa: 100,
    annualPmiRate: 0.55
  });

  assert.equal(result.loanAmount, 320_000);
  assert.equal(result.pmi, 0);
  assert.equal(result.propertyTax, 400);
  assert.equal(result.homeInsurance, 150);
  assert.equal(result.hoa, 100);
  assert.equal(result.totalMonthlyPayment, 2_568.56);
});

test('affordability estimate remains within the configured total-debt planning limit', () => {
  const result = calculateAffordability({
    annualHouseholdIncome: 90_000,
    monthlyDebtPayments: 750,
    downPayment: 20_000,
    annualInterestRate: 6.5,
    termYears: 30,
    annualPropertyTaxRate: 1.2,
    annualHomeInsuranceRate: 0.5,
    monthlyHoa: 0,
    annualPmiRate: 0.55
  });

  assert.ok(result.estimatedHomePrice > 0);
  assert.ok(result.estimatedMonthlyPayment <= result.monthlyHousingBudget + 1);
  assert.ok(result.estimatedDebtToIncomeRatio <= 36.01);
});

test('cash-to-close estimate accounts for down payment, costs, prepaids, and credits', () => {
  const result = calculateClosingCosts({
    purchasePrice: 350_000,
    downPayment: 17_500,
    closingCostRate: 3,
    prepaidEscrowRate: 1,
    sellerOrLenderCredits: 2_000
  });

  assert.equal(result.estimatedClosingCosts, 10_500);
  assert.equal(result.estimatedPrepaidsAndEscrow, 3_500);
  assert.equal(result.estimatedCashToClose, 29_500);
});

test('down-payment scenarios compare common percentages and omit PMI at 20 percent', () => {
  const scenarios = calculateDownPaymentScenarios({
    homePrice: 350_000,
    annualInterestRate: 6.5,
    termYears: 30,
    annualPropertyTax: 4_200,
    annualHomeInsurance: 1_800,
    monthlyHoa: 0,
    annualPmiRate: 0.55
  });

  assert.deepEqual(
    scenarios.map((scenario) => scenario.percentage),
    [3, 3.5, 5, 10, 20]
  );
  assert.ok(scenarios[0].pmi > 0);
  assert.equal(scenarios[4].pmi, 0);
});

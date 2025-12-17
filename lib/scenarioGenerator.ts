import { v4 as uuidv4 } from 'uuid';

const EMP_MIN = 50;
const EMP_MAX = 25000;
const SAL_INC_MIN = 4;
const SAL_INC_MAX = 15;
const ATTR_MIN = 1;
const ATTR_MAX = 30;
const DISC_MIN = 6.0;
const DISC_MAX = 12.0;
const RETIREMENT_AGE = 60.0;

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function normalRandom(mean: number, stdDev: number): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return num * stdDev + mean;
}

export interface Scenario {
  scenario_id: string;
  Employees: number;
  "Average Age": number;
  "Average Past Service": number;
  "Average Salary": number;
  "Base PBO": number;
  "Salary Increase (%)": number;
  "Discount Rate (%)": number;
  "Attrition (%)": number;
  Duration: number;
  "Test Sensitivity": string;
  "Correct PBO Under Sensitivity": number;
  "Internal % Change": number;
  "Internal Sensitivities": {
    "PBO @ DR +100": number;
    "PBO @ DR -100": number;
    "PBO @ SI +100": number;
    "PBO @ SI -100": number;
  };
}

export function generateScenario(): Scenario {
  const num_emp = randomInt(EMP_MIN, EMP_MAX);
  const avg_age = Math.round(randomFloat(25, 59.5) * 10) / 10;

  const joining_age = normalRandom(23.5, 1.0);
  const avg_past_service = Math.round(Math.max(avg_age - joining_age, 1) * 10) / 10;

  const avg_salary = randomInt(15000, 100000);

  const sal_inc = randomInt(SAL_INC_MIN, SAL_INC_MAX);
  const disc = Math.round(randomFloat(DISC_MIN, DISC_MAX) * 100) / 100;
  const attr = randomInt(ATTR_MIN, ATTR_MAX);

  const raw_duration = Math.max(
    1,
    Math.min(
      RETIREMENT_AGE - avg_age,
      (1 / ((attr + 1) / 100)) + normalRandom(0, 0.5)
    )
  );
  const duration = Math.round(raw_duration * 100) / 100;

  const salary_horizon = Math.max(0.0, RETIREMENT_AGE - avg_age);
  const salary_horizon_factor = salary_horizon > 0 ? salary_horizon / (salary_horizon + 1) : 0;

  const base_multiplier = randomFloat(0.45, 0.65);

  const salary_factor = Math.pow(1 + sal_inc / 100, duration);
  const discount_factor = Math.pow(1 + disc / 100, duration);

  const pbo_raw = avg_salary * avg_past_service * num_emp * base_multiplier * (salary_factor / discount_factor);
  const pbo = Math.round(pbo_raw / 100000);

  const delta_dr = randomFloat(-0.1, 0.1);
  const delta_sr = randomFloat(-0.1, 0.1);
  const alpha_sr = randomFloat(-0.1, 0.1);

  const pct_change_dr_plus = -(duration + delta_dr);
  const pct_change_dr_minus = +(duration + delta_dr);

  const pct_change_si_plus = duration + delta_sr + alpha_sr * salary_horizon_factor;
  const pct_change_si_minus = -(duration + delta_sr + alpha_sr * salary_horizon_factor);

  const pbo_dr_plus_100 = Math.round(pbo * (1 + pct_change_dr_plus / 100));
  const pbo_dr_minus_100 = Math.round(pbo * (1 + pct_change_dr_minus / 100));
  const pbo_si_plus_100 = Math.round(pbo * (1 + pct_change_si_plus / 100));
  const pbo_si_minus_100 = Math.round(pbo * (1 + pct_change_si_minus / 100));
  const pbo_dr_plus_50 = Math.round(pbo * (1 + pct_change_dr_plus / 200));
  const pbo_dr_minus_50 = Math.round(pbo * (1 + pct_change_dr_minus / 200));
  const pbo_si_plus_50 = Math.round(pbo * (1 + pct_change_si_plus / 200));
  const pbo_si_minus_50 = Math.round(pbo * (1 + pct_change_si_minus / 200));

  const choices: [string, number, number][] = [
    ["DR +100", pct_change_dr_plus, pbo_dr_plus_100],
    ["DR +50", pct_change_dr_plus, pbo_dr_plus_50],
    ["DR -100", pct_change_dr_minus, pbo_dr_minus_100],
    ["DR -50", pct_change_dr_minus, pbo_dr_minus_50],
    ["SI +100", pct_change_si_plus, pbo_si_plus_100],
    ["SI +50", pct_change_si_plus, pbo_si_plus_50],
    ["SI -100", pct_change_si_minus, pbo_si_minus_100],
    ["SI -50", pct_change_si_plus, pbo_si_plus_50]
  ];

  const [chosen_name, chosen_pct, chosen_pbo] = choices[randomInt(0, choices.length - 1)];

  const scenario_id = uuidv4();

  return {
    scenario_id,
    Employees: num_emp,
    "Average Age": avg_age,
    "Average Past Service": avg_past_service,
    "Average Salary": avg_salary,
    "Base PBO": pbo,
    "Salary Increase (%)": sal_inc,
    "Discount Rate (%)": disc,
    "Attrition (%)": attr,
    Duration: duration,
    "Test Sensitivity": chosen_name,
    "Correct PBO Under Sensitivity": chosen_pbo,
    "Internal % Change": chosen_pct,
    "Internal Sensitivities": {
      "PBO @ DR +100": pbo_dr_plus_100,
      "PBO @ DR -100": pbo_dr_minus_100,
      "PBO @ SI +100": pbo_si_plus_100,
      "PBO @ SI -100": pbo_si_minus_100,
    }
  };
}

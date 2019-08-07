const MAX_RUN_TIME_MS = 3000;
const MONEY_TO_PAY_OUT_LOANS = 1000;

type Loan = {
  name: string;
  installment: number;
  leftover: number;
};

const loans: readonly Loan[] = [
  { name: "laina 1", installment: 50.0, leftover: 1776.39 },
  { name: "laina 2", installment: 60.0, leftover: 798.03 },
  { name: "laina 3", installment: 1101.9, leftover: 26445.6 },
  { name: "laina 5", installment: 90.0, leftover: 1442.41 },
  { name: "laina 6", installment: 60.0, leftover: 2146.24 },
  { name: "laina 7", installment: 262.76, leftover: 22071.69 },
  { name: "laina 10", installment: 237.5, leftover: 5000 },
  { name: "laina 13", installment: 28.02, leftover: 728.52 },
  { name: "laina 14", installment: 3.58, leftover: 93.08 },
  { name: "laina 15", installment: 10.52, leftover: 147.28 },
  { name: "laina 16", installment: 23.3, leftover: 116.5 },
  { name: "laina 17", installment: 10.24, leftover: 327.68 },
  { name: "laina 18", installment: 36.06, leftover: 757.26 },
  { name: "laina 19", installment: 80.52, leftover: 2174.04 },
  { name: "laina 20", installment: 99.0, leftover: 3400 },
  { name: "laina 21", installment: 182.04, leftover: 13422.4 },
  { name: "laina 23", installment: 3.5, leftover: 7725.4 },
  { name: "laina 24", installment: 180.0, leftover: 1168.26 },
  { name: "laina 25", installment: 100.0, leftover: 665 }
];

const randomize = <T>(arr: readonly T[]): T[] =>
  [...arr].sort(() => Math.random() - 0.5);
const sumByLeftover = (arr: readonly Loan[]) =>
  arr.reduce((sum, item) => item.leftover + sum, 0);
const sumByInstallment = (arr: readonly Loan[]) =>
  arr.reduce((sum, item) => item.installment + sum, 0);

let best: Loan[] = [];
let iterations = 0;
const startTime = Date.now();
while (Date.now() < startTime + MAX_RUN_TIME_MS) {
  iterations++;

  const randomLoans = randomize(loans);
  let money = MONEY_TO_PAY_OUT_LOANS;
  const affordableLoans = [];

  while (money > randomLoans[0].leftover) {
    const next = randomLoans.shift();
    affordableLoans.push(next);
    money -= next.leftover;
  }

  if (sumByInstallment(affordableLoans) > sumByInstallment(best)) {
    console.log(`Found new best one: ${sumByInstallment(affordableLoans)}€`);
    best = affordableLoans;
  }
}

console.log(`Ran ${iterations} iterations`);
console.log("Best combinations of loans found:");
console.log(best.map(i => i.name).join(", "));
console.log(`Saves you ${sumByInstallment(best)}€ per month`);

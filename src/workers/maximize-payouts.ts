type Loan = {
  name: string
  installment: number
  leftover: number
}

type SumByFn = <Prop extends string, T extends { [Key in Prop]: number }>(
  prop: Prop,
  arr: T[]
) => number

const randomize = <T>(arr: readonly T[]): T[] =>
  [...arr].sort(() => Math.random() - 0.5)
const sumBy: SumByFn = (prop, arr) =>
  arr.reduce((sum, item) => item[prop] + sum, 0)

const MAX_RUN_TIME_MS = 1000
const MONEY_TO_PAY_OUT_LOANS = 1000

const sumByInstallment = (arr: Loan[]) => sumBy('installment', arr)

function maximizePayouts(loans: Loan[]) {
  let best: Loan[] = []
  const startTime = Date.now()
  while (Date.now() < startTime + MAX_RUN_TIME_MS) {
    const randomLoans = randomize(loans)
    let money = MONEY_TO_PAY_OUT_LOANS
    const affordableLoans = []

    while (randomLoans.length && money > randomLoans[0].leftover) {
      const next = randomLoans.shift()!
      affordableLoans.push(next)
      money -= next.leftover
    }

    if (sumByInstallment(affordableLoans) > sumByInstallment(best)) {
      best = affordableLoans
    }
  }

  return best
}

addEventListener('message', message => {
  const loans: Loan[] = JSON.parse(message.data)
  if (!loans.length) {
    return
  }

  const bestLoans = maximizePayouts(loans)

  postMessage(JSON.stringify(bestLoans))
})

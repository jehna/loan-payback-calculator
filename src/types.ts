import * as t from 'io-ts'

export const Loan = t.type({
  name: t.string,
  installment: t.number,
  leftover: t.number,
  interest: t.number,
  type: t.intersection([t.literal('annuity'), t.literal('annuity')])
})

export type LoanType = t.TypeOf<typeof Loan>

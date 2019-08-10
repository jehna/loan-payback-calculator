import React from 'react'
import Card from './Card'
import { money } from '../utils/format-utils'
import { lift } from '@grammarly/focal'
import { sumBy } from '../utils/list-utils'

const Summary: React.FC<{ loans: Loan[] }> = ({ loans }) => (
  <Card>
    <h2>Summary</h2>
    <p>
      Total monthly fees:{' '}
      <strong>{money(sumBy('installment', loans))} / month</strong>
    </p>
    <p>
      Total money owed: <strong>{money(sumBy('leftover', loans))}</strong>
    </p>
    <p>
      Time before all loans paid:{' '}
      <strong>
        {Math.max(
          ...loans.map(loan => Math.ceil(loan.leftover / loan.installment))
        )}{' '}
        months
      </strong>
    </p>
  </Card>
)

export default lift(Summary)

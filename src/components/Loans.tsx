import React from 'react'
import { Atom, F } from '@grammarly/focal'
import { Loan } from '../types'
import { mapElems } from '../utils/focal-utils'
import { sumBy } from '../utils/list-utils'
import styled from 'styled-components'
import NewLoan from './NewLoan'
import ActionButton from './ActionButton'

const Table = styled.table`
  border: 1px;

  td,
  th {
    text-align: right;
    padding: 0.65em 0 0.65em 5em;
    border-bottom: 1px solid #ddd;

    &:first-child {
      text-align: left;
      padding-left: 0;
    }

    &:last-child {
      padding-left: 0;
    }
  }

  th {
    border-bottom-color: #aaa;
  }

  tfoot td {
    border: 0;
  }

  tbody tr:last-child td {
    border-bottom-style: double;
    border-bottom-width: 3px;
  }
`

const Remove = styled(ActionButton)`
  opacity: 0.2;

  &:hover {
    opacity: 1;
  }
`

const money = (num: number) =>
  num.toLocaleString('fi', { currency: 'EUR', style: 'currency' })

export default ({ loans = Atom.create<Loan[]>([]) }) => {
  const removeLoanAtIndex = (toRemove: number) => () => {
    loans.modify(c => c.filter((_, i) => i !== toRemove))
  }
  return (
    <>
      <h1>My loans:</h1>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Installment</th>
            <th>Leftover</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <NewLoan loans={loans} />
          {mapElems(
            (loan, i) => (
              <tr key={loan.name}>
                <td>{loan.name}</td>
                <td align="right">{money(loan.installment)}/mo</td>
                <td>{money(loan.leftover)}</td>
                <td>
                  <Remove onClick={removeLoanAtIndex(i)}>-</Remove>
                </td>
              </tr>
            ),
            loans
          )}
        </tbody>
        <tfoot>
          <tr>
            <td>Total:</td>
            <F.td>
              {loans.view(curr => money(sumBy('installment', curr)))}/mo
            </F.td>
            <F.td>{loans.view(curr => money(sumBy('leftover', curr)))}</F.td>
            <td />
          </tr>
        </tfoot>
      </Table>
    </>
  )
}

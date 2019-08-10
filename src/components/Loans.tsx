import React from 'react'
import { Atom, F } from '@grammarly/focal'
import { Loan } from '../types'
import { mapElems } from '../utils/focal-utils'
import { sumBy } from '../utils/list-utils'
import { money } from '../utils/format-utils'
import styled from 'styled-components'
import { lighten } from 'polished'
import NewLoan from './NewLoan'
import ActionButton from './ActionButton'
import colors from '../utils/colors'

const Table = styled.table`
  border: 0;
  border-spacing: 0;
  border-collapse: collapse;
  position: relative;
  width: 100%;

  td,
  th {
    text-align: right;
    padding: 0.65em 0 0.65em 5em;

    &:first-child {
      text-align: left;
      padding-left: 1.5em;
    }

    &:last-child {
      padding-left: 0;
    }
  }

  tr {
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  }

  thead tr {
    position: sticky;
    top: 0;
    background: ${colors.background};
    z-index: 1;
    box-sizing: border-box;
    border: 0;
    box-shadow: 0 2px 1px rgba(0, 0, 0, 0.1);
  }

  tfoot td {
    border: 0;
  }

  tbody {
    background: rgba(0, 0, 0, 0.05);
    tr:last-child {
      border-bottom-style: double;
      border-bottom-width: 3px;
    }
  }
`

const Remove = styled(ActionButton)`
  opacity: 0.2;

  &:hover {
    opacity: 1;
  }
`

export default ({ loans = Atom.create<Loan[]>([]) }) => {
  const removeLoanAtIndex = (toRemove: number) => () => {
    loans.modify(c => c.filter((_, i) => i !== toRemove))
  }
  return (
    <>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Installment</th>
            <th>Leftover</th>
            <th># left</th>
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
                <td>{Math.ceil(loan.leftover / loan.installment)}</td>
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

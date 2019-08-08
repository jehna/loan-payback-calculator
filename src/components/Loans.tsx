import React from 'react'
import { Atom, F } from '@grammarly/focal'
import { Loan } from '../types'
import { mapElems } from '../utils/focal-utils'
import { sumBy } from '../utils/list-utils'
import styled from 'styled-components'
import NewLoan from './NewLoan'

const Table = styled.table`
  border: 1px;

  td,
  th {
    text-align: right;
    padding: 0.65em 5em 0.65em 0;
    border-bottom: 1px solid #ddd;

    &:first-child {
      text-align: left;
    }

    &:last-child {
      padding-right: 0;
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

const money = (num: number) =>
  num.toLocaleString('fi', { currency: 'EUR', style: 'currency' })

export default ({ loans = Atom.create<Loan[]>([]) }) => (
  <>
    <h1>Add your loans:</h1>
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Installment</th>
          <th>Leftover</th>
        </tr>
      </thead>
      <tbody>
        <NewLoan loans={loans} />
        {mapElems(
          loan => (
            <tr key={loan.name}>
              <td>{loan.name}</td>
              <td align="right">{money(loan.installment)}/mo</td>
              <td>{money(loan.leftover)}</td>
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
        </tr>
      </tfoot>
    </Table>
  </>
)

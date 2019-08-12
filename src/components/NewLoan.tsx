import React from 'react'
import styled from 'styled-components'
import ActionButton from './ActionButton'
import { Atom, lift, F } from '@grammarly/focal'
import { Loan, LoanType } from '../types'
import Input from './Input'
import { combineLatest } from 'rxjs'
import { filter, map, startWith } from 'rxjs/operators'
import { isRight } from 'fp-ts/lib/Either'

const Add = lift(styled(ActionButton)`
  opacity: ${props => (props.disabled ? 0.2 : 1)};
`)

const both = <T1, T2>(s1: Atom<T1>, s2: Atom<T2>) =>
  combineLatest(s1, s2).pipe(filter(([a, b]) => !!a && !!b))

type DraftLoan = Partial<LoanType>

export default ({
  loans = Atom.create<LoanType[]>([]),
  draft = Atom.create<DraftLoan>({})
}) => {
  const installment = draft.lens('installment')
  const name = draft.lens('name')
  const leftover = draft.lens('leftover')
  const isValid = draft.view(d => Loan.is(d))
  const interest = draft.lens('interest')

  const setNewLoan = () => {
    const newLoan = Loan.decode(draft.get())
    if (isRight(newLoan)) {
      loans.modify(l => [newLoan.right, ...l])
      draft.set({})
    }
  }
  const onSubmit = () => isValid.get() && setNewLoan()

  return (
    <tr>
      <td>
        <Input
          placeholder="My first loan"
          value={name.view(n => n || '')}
          onChange={e => name.set(e.currentTarget.value)}
          onSubmit={onSubmit}
        />
      </td>
      <td>
        <Input
          placeholder="100"
          type="number"
          min="1"
          step="any"
          onChange={e =>
            installment.set(parseFloat(e.currentTarget.value) || undefined)
          }
          minLength={installment.view(i => (i ? 0 : 1))}
          value={installment.view(i => i || '')}
          onSubmit={onSubmit}
        />{' '}
        €/mo
      </td>
      <td>
        <Input
          placeholder="5"
          type="number"
          min="0"
          step="any"
          onChange={e =>
            interest.set(parseFloat(e.currentTarget.value) / 100 || undefined)
          }
          minLength={interest.view(i => (i ? 0 : 1))}
          value={interest.view(i => (i ? i * 100 : ''))}
          onSubmit={onSubmit}
        />{' '}
        %
      </td>
      <td>
        <Input
          placeholder="1000"
          type="number"
          min="1"
          step="any"
          onChange={e =>
            leftover.set(parseFloat(e.currentTarget.value) || undefined)
          }
          minLength={leftover.view(i => (i ? 0 : 1))}
          value={leftover.view(i => i || '')}
          onSubmit={onSubmit}
        />{' '}
        €
      </td>
      <F.td>
        {both(leftover, installment).pipe(
          startWith([0, 0]),
          map(([cl, ci]) => (cl && ci && Math.ceil(cl / ci)) || '')
        )}
      </F.td>
      <td>
        <Add disabled={isValid.view(v => !v)} onClick={setNewLoan}>
          +
        </Add>
      </td>
    </tr>
  )
}

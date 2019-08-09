import React from 'react'
import styled from 'styled-components'
import ActionButton from './ActionButton'
import { Atom, lift } from '@grammarly/focal'
import { Loan } from '../types'
import Input from './Input'

const Add = lift(styled(ActionButton)`
  opacity: ${props => (props.disabled ? 0.2 : 1)};
`)

type DraftLoan = Partial<Loan>

export default ({
  loans = Atom.create<Loan[]>([]),
  draft = Atom.create<DraftLoan>({})
}) => {
  const installment = draft.lens('installment')
  const name = draft.lens('name')
  const leftover = draft.lens('leftover')
  const isValid = draft.view(d => !!(d.name && d.installment && d.leftover))

  const setNewLoan = () => {
    loans.modify(l => [draft.get() as Loan, ...l])
    draft.set({})
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
      <td>
        <Add disabled={isValid.view(v => !v)} onClick={setNewLoan}>
          +
        </Add>
      </td>
    </tr>
  )
}

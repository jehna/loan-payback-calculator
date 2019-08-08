import React from 'react'
import styled from 'styled-components'
import ActionButton from './ActionButton'
import { Atom, F, lift } from '@grammarly/focal'
import { Loan } from '../types'

const ENTER_KEYCODE = 13

const Input = styled(F.input)`
  border: 0;
  appearance: none;
  font: inherit;
  text-align: inherit;
  margin: 0;
  padding: 0;
  width: 7em;
  -moz-appearance: textfield;

  &:invalid {
    outline: none;
    box-shadow: none;
    text-decoration: red wavy underline;
    line-height: 1.5em; /* Fixes wavy underline bug */
    margin: -1em 0; /* Fixes line height */
  }
`

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
  const handleEnter = (e: React.KeyboardEvent) =>
    e.keyCode === ENTER_KEYCODE && isValid.get() && setNewLoan()

  return (
    <tr>
      <td>
        <Input
          placeholder="My first loan"
          value={name.view(n => n || '')}
          onChange={e => name.set(e.currentTarget.value)}
          onKeyDown={handleEnter}
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
          onKeyDown={handleEnter}
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
          onKeyDown={handleEnter}
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
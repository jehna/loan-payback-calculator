import React, { useEffect } from 'react'
import workerPath from 'file-loader?name=[name].js!../workers/maximize-payouts'
import { Atom, F } from '@grammarly/focal'
import { Loan } from '../types'
import { mapElems } from '../utils/focal-utils'
import { money } from '../utils/format-utils'
import styled from 'styled-components'
import { sumBy } from '../utils/list-utils'
import Input from './Input'
import { debounceTime, filter, withLatestFrom, map } from 'rxjs/operators'
import Card from './Card'

const InputRow = styled.label`
  display: flex;
  flex-direction: row;
`

const worker = new Worker(workerPath)

export default ({
  loans: $loans = Atom.create<Loan[]>([]),
  best = Atom.create<Loan[]>([]),
  extraMoney = Atom.create<number | undefined>(undefined)
}) => {
  useEffect(() => {
    const handleMessage = (evt: MessageEvent) => best.set(JSON.parse(evt.data))
    worker.addEventListener('message', handleMessage)
    return () => worker.removeEventListener('message', handleMessage)
  }, [$loans])

  useEffect(() => {
    extraMoney
      .pipe(
        filter(Boolean),
        debounceTime(1000),
        withLatestFrom($loans),
        map(v => ({ extraMoney: v[0], loans: v[1] }))
      )
      .subscribe(curr => {
        worker.postMessage(JSON.stringify(curr))
      })
  }, [extraMoney, $loans])

  return (
    <Card>
      <h2>Optimized loan payback</h2>
      <InputRow>
        <div>Extra money to spend on loan payback:</div>
        <div>
          <Input
            placeholder="100"
            type="number"
            onChange={e => extraMoney.set(parseFloat(e.currentTarget.value))}
            value={extraMoney.view(i => i || '')}
          />{' '}
          €
        </div>
      </InputRow>

      {$loans.view(loans => !loans.length && <p>Add some loans first!</p>)}

      {extraMoney.view(
        c => c && <p>If you have {money(c)}, the best loans to pay back are:</p>
      )}
      <ul>
        {mapElems(
          loan => (
            <li key={loan.name}>
              {loan.name} ({money(loan.leftover)})
            </li>
          ),
          best
        )}
      </ul>
      {best.view(
        curr =>
          !!curr.length && (
            <p>
              This makes total of {money(sumBy('leftover', curr))}. Paying
              listed loans now would reduce your monthly payment by{' '}
              {money(sumBy('installment', curr))}/mo
            </p>
          )
      )}
    </Card>
  )
}

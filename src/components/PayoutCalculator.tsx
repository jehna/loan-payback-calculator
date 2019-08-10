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

const Container = styled(F.div)`
  margin: 2em 0;
  padding: 1em;
  border-radius: 0.4em;
  background: rgba(255, 255, 255, 0.07);
  box-sizing: border-box;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.1);
  margin-right: 1.5em;

  h2 {
    margin-top: 0;
  }
`

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
    <Container>
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
    </Container>
  )
}

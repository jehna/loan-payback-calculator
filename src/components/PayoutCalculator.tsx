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
  background: aliceblue;
`

const worker = new Worker(workerPath)

export default ({
  loans = Atom.create<Loan[]>([]),
  best = Atom.create<Loan[]>([]),
  extraMoney = Atom.create<number | undefined>(undefined)
}) => {
  useEffect(() => {
    const handleMessage = (evt: MessageEvent) => best.set(JSON.parse(evt.data))
    worker.addEventListener('message', handleMessage)
    return () => worker.removeEventListener('message', handleMessage)
  }, [loans])

  extraMoney
    .pipe(
      filter(Boolean),
      debounceTime(1000),
      withLatestFrom(loans),
      map(v => ({ extraMoney: v[0], loans: v[1] }))
    )
    .subscribe(curr => {
      worker.postMessage(JSON.stringify(curr))
    })

  return (
    <F.Fragment>
      {loans.view(
        currLoans =>
          currLoans.length > 0 && (
            <Container>
              <p>
                Calculate best loans to pay out if you have some extra money:
              </p>
              <p>
                I have{' '}
                <Input
                  placeholder="500"
                  type="number"
                  onChange={e =>
                    extraMoney.set(parseFloat(e.currentTarget.value))
                  }
                  value={extraMoney.view(i => i || '')}
                />{' '}
                € extra money to spend on paying back my loans.
              </p>
              {best.view(curr =>
                curr.length > 0 ? (
                  <React.Fragment key="bestloans">
                    <F.div>
                      Best loans to pay with{' '}
                      {extraMoney.view(c => c && money(c))}:
                    </F.div>
                    <ul>
                      {mapElems(
                        loan => (
                          <li key={loan.name}>
                            {loan.name} ({money(loan.installment)}/mo)
                          </li>
                        ),
                        best
                      )}
                    </ul>
                    <div>
                      Paying {money(sumBy('leftover', curr))} now would reduce
                      your monthly payment by{' '}
                      {money(sumBy('installment', curr))}/mo
                    </div>
                  </React.Fragment>
                ) : (
                  <F.Fragment key="loading">
                    {extraMoney.view(
                      currExtraMoney =>
                        !!currExtraMoney && <div>Crunching numbers...</div>
                    )}
                  </F.Fragment>
                )
              )}
            </Container>
          )
      )}
    </F.Fragment>
  )
}

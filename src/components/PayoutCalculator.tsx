import React, { useEffect } from 'react'
import workerPath from 'file-loader?name=[name].js!../workers/maximize-payouts'
import { Atom, F } from '@grammarly/focal'
import { Loan } from '../types'
import { mapElems } from '../utils/focal-utils'
import { money } from '../utils/format-utils'
import styled from 'styled-components'
import { sumBy } from '../utils/list-utils'

const Container = styled.div`
  margin: 2em 0;
  padding: 1em;
  border-radius: 0.4em;
  background: aliceblue;
`

const worker = new Worker(workerPath)

export default ({
  loans = Atom.create<Loan[]>([]),
  best = Atom.create<Loan[]>([])
}) => {
  useEffect(() => {
    const handleMessage = (evt: MessageEvent) => best.set(JSON.parse(evt.data))
    worker.addEventListener('message', handleMessage)
    return () => worker.removeEventListener('message', handleMessage)
  }, [loans])

  loans.subscribe(curr => worker.postMessage(JSON.stringify(curr)))

  return (
    <F.Fragment>
      {best.view(curr =>
        curr.length > 0 ? (
          <Container>
            <div>Best loans to pay out if you had 1000€ extra:</div>
            <ul>
              {mapElems(
                loan => (
                  <li key={loan.name}>
                    {loan.name} ({money(loan.installment)})
                  </li>
                ),
                best
              )}
            </ul>
            <div>
              This would reduce your monthly payment by{' '}
              {money(sumBy('installment', curr))}/mo
            </div>
          </Container>
        ) : null
      )}
    </F.Fragment>
  )
}

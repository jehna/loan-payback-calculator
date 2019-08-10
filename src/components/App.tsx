import React from 'react'
import styled from 'styled-components'
import Loans from './Loans'
import { Atom } from '@grammarly/focal'
import { Loan } from '../types'
import { persist } from '../utils/focal-utils'
import PayoutCalculator from './PayoutCalculator'
import Header from './Header'
import colors from '../utils/colors'
import Summary from './Summary'

const Page = styled.div`
  display: grid;
  font-size: 18px;
  max-height: 100vh;
  height: 100vh;
  grid-template-columns: 65% auto;
  grid-template-areas:
    'header header'
    'main aside';
  grid-template-rows: auto;
  font-family: -apple-system, BlinkMacSystemFont, avenir next, avenir,
    helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif;
  background: ${colors.background};
  color: #fff;
  align-content: start;
  grid-column-gap: 30px;

  header {
    grid-area: header;
  }

  main {
    grid-area: main;
    overflow-y: scroll;
  }

  aside {
    grid-area: aside;
    overflow-y: scroll;
  }
`

interface AppState {
  loans: Loan[]
}

const INITIAL_STATE: AppState = {
  loans: []
}

export default ({ state = Atom.create<AppState>(INITIAL_STATE) }) => {
  persist('APPSTATE', state)
  return (
    <Page>
      <header>
        <Header />
      </header>
      <main>
        <Loans loans={state.lens('loans')} />
      </main>
      <aside>
        <PayoutCalculator loans={state.lens('loans')} />
        <Summary loans={state.lens('loans')} />
      </aside>
    </Page>
  )
}

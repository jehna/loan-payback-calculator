import React from 'react'
import styled from 'styled-components'
import Loans from './Loans'
import { Atom } from '@grammarly/focal'
import { Loan } from '../types'
import { persist } from '../utils/focal-utils'

const Page = styled.div`
  font-size: 18px;
  max-width: 60em;
  margin: 0 auto;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, avenir next, avenir,
    helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif;
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
      <Loans loans={state.lens('loans')} />
    </Page>
  )
}

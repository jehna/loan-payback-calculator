import React from 'react'
import styled from 'styled-components'

const HeaderStyles = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 1.5em;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.07);
  box-sizing: border-box;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.1);
  z-index: 2;
  position: relative;
  margin-bottom: 10px;
`

export default () => <HeaderStyles>Loan tool</HeaderStyles>

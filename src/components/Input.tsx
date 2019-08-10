import React from 'react'
import { F } from '@grammarly/focal'
import styled from 'styled-components'

const ENTER_KEYCODE = 13

const Input = styled(F.input)`
  border: 0;
  appearance: none;
  font: inherit;
  text-align: inherit;
  margin: 0;
  padding: 0;
  width: 7em;
  color: inherit;
  -moz-appearance: textfield;
  background: transparent;
  text-align: ${props => (props.type === 'number' ? 'right' : 'left')};

  &:invalid {
    outline: none;
    box-shadow: none;
    text-decoration: red wavy underline;
    line-height: 1.5em; /* Fixes wavy underline bug */
    margin: -1em 0; /* Fixes line height */
  }
`

interface InputProps extends React.ComponentProps<typeof Input> {
  onSubmit?: () => void
}

export default ({ onSubmit, ...props }: InputProps) => {
  const handleEnter = (e: React.KeyboardEvent) =>
    onSubmit && e.keyCode === ENTER_KEYCODE && onSubmit()
  return <Input onKeyDown={handleEnter} {...props} />
}

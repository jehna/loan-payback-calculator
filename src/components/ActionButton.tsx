import styled from 'styled-components'

export default styled.button`
  border: 0;
  border-radius: 0.3em;
  appearance: none;
  background: cornflowerblue;
  height: 1.4em;
  width: 1.4em;
  cursor: ${props => (props.disabled ? 'normal' : 'pointer')};
  font-size: 1.5em;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0 0.1em;
  margin: -0.2em 0 -0.2em 0.4em;
  color: white;
`

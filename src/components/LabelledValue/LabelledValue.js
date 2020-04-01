import React from 'react'
import styled from 'styled-components'

const StyledLabelledValue = styled.div`
  display: flex;
  flex-direction: column;
`
const StyledLabel = styled.span`
  font-size: 0.6em;
  letter-spacing: 2px;
  margin-top: 0.25em;
  opacity: 0.5;
  text-transform: uppercase;
`
const StyledValue = styled.h3`
  font-size: 1.5em;
  font-weight: 400;
  margin: 0;
  padding: 0;
`

const LabelledValue = ({ label, value }) => (
  <StyledLabelledValue>
    <StyledValue>{value}</StyledValue>
    <StyledLabel>{label}</StyledLabel>
  </StyledLabelledValue>
)

export default LabelledValue
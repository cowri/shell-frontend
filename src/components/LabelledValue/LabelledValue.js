import React from 'react'
import styled from 'styled-components'

const StyledLabelledValue = styled.div`
  display: flex;
  flex-direction: column;
`
const StyledLabel = styled.span`
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  margin-top: 0.25em;
  opacity: 0.3;

`
const StyledValue = styled.h3`
  font-size: 1em;
  font-weight: 500;
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
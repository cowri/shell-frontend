import React from 'react'
import styled from 'styled-components'
import { withTheme } from '@material-ui/core/styles'

const StyledLabelledValue = styled.div`
  display: flex;
  flex-direction: column;
`
const StyledLabel = withTheme(styled.span`
  color: ${props => props.theme.palette.grey[500]};
  font-size: 16px;
  font-weight: 400;
  line-height: 1rem;
  margin-top: 0.25em;
`)
const StyledValue = withTheme(styled.h3`
  font-size: 1em;
  font-weight: 400;
  font-family: Arial;
  margin: 0;
  padding: 0;
`)

const LabelledValue = ({ label, value }) => (
  <StyledLabelledValue>
    <StyledValue>{value}</StyledValue>
    <StyledLabel>{label}</StyledLabel>
  </StyledLabelledValue>
)

export default LabelledValue
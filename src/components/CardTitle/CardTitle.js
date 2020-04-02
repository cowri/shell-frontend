import React from 'react'
import styled from 'styled-components'

const StyledCardTitle = styled.div`
  align-items: center;
  border-bottom: 1px solid rgba(0,0,0,0.075);
  color: rgba(0,0,0,0.7);
  display: flex;
  font-weight: 700;
  height: 56px;
  margin: 0;
  padding: 0 24px;
`

const CardTitle = ({ children, full }) => (
  <StyledCardTitle full={full}>
    {children}
  </StyledCardTitle>
)

export default CardTitle
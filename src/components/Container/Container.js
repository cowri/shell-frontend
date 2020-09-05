import React from 'react'
import styled from 'styled-components'

const StyledContainer = styled.div`
  box-sizing: border-box;
  margin: 0 auto;
  max-width: ${props => props.full ? '100%' : '625px'};
  padding: 0 24px;
  width: 100%;
  @media (max-width: 512px) {
    padding: 0 6px;
  }
`

const Container = ({ children, full }) => (
  <StyledContainer full={full}>
    {children}
  </StyledContainer>
)

export default Container
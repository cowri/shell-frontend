import React from 'react'
import styled from 'styled-components'

const StyledSurface = styled.div`
  background: #FFF;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  height: 800px;
  overflow: hidden;
  width: 100%;
`

const Surface = ({ children }) => (
  <StyledSurface>
    {children}
  </StyledSurface>
)

export default Surface
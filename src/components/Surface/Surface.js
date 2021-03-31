import React from 'react'
import styled from 'styled-components'

const StyledSurface = styled.div`
  background: ${p => p.modal ? '#fff2fe' : 'rgba(255,255,255,0.6)'};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: ${p => p.modal ? '3rem 0 0' : '0'};
  
`

const Surface = ({ children, modal }) => (
  <StyledSurface modal={modal}>
    {children}
  </StyledSurface>
)

export default Surface

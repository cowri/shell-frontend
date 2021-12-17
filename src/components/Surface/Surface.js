import React from 'react'
import styled from 'styled-components'
import {IS_FTM} from '../../constants/chainId.js';

const StyledSurface = styled.div`
  background: ${p => p.modal ? '#fff2fe' : IS_FTM ? 'rgba(71,136,255,1)' : 'rgba(255,255,255,0.6)'};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  padding: ${p => p.modal ? '60px 40px 70px;' : '0'};
`

const Surface = ({ children, modal }) => (
  <StyledSurface modal={modal}>
    {children}
  </StyledSurface>
)

export default Surface

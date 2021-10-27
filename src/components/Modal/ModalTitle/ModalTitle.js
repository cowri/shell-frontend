import React from 'react'
import { withTheme } from '@material-ui/core/styles'
import styled from 'styled-components'
import {IS_FTM} from '../../../constants/chainId.js';

const StyledModalTitle = withTheme(styled.div`
  font-size: 1.75rem;
  padding: 0 24px;
  font-weight: bold;
  color: ${IS_FTM ? 'rgb(10,21,237)' : '#fff'};
`)

const ModalTitle = ({ children }) => (
  <StyledModalTitle>
    {children}
  </StyledModalTitle>
)

export default ModalTitle

import React from 'react'
import styled from 'styled-components'
import { withTheme } from '@material-ui/core/styles'
import {IS_FTM} from '../../constants/chainId.js';

const StyledTab = withTheme(styled.div`
  align-items: center;
  background: ${props => {
    if (props.active) {
      return IS_FTM ? 'rgba(10, 21, 237, 1) !important' :  'rgba(255,66,161,1) !important'
    }
    return 'rgb(246, 211, 246)'
  }};
  color: #fff;
  cursor: pointer;
  display: flex;
  flex: 1;
  font-weight: 700;
  height: 72px;
  font-size: 21px;
  justify-content: center;
  opacity: 1;
  pointer-events: ${props => props.disabled ? 'none' : 'all'};
  :nth-child(1) {
    background: ${IS_FTM ? 'rgba(10, 21, 237, .9)' : 'rgba(255,66,161,.9)'}
  }
  :nth-child(2) {
    background: ${IS_FTM ? 'rgba(10, 21, 237, .8)' : 'rgba(255,66,161,.8)'}
  }
  :nth-child(3) {
    background: ${IS_FTM ? 'rgba(10, 21, 237, .7)' : 'rgba(255,66,161,.7)'}
  }
  :nth-child(4) {
    background: ${IS_FTM ? 'rgba(10, 21, 237, .6)' : 'rgba(255,66,161,.6)'}
  }
  @media screen and (max-width: 600px) {
    font-size: 18px;
  }
`)

const Tab = ({ active, children, disabled, onClick }) => (
  <StyledTab active={active} disabled={disabled} onClick={onClick}>
    {children}
  </StyledTab>
)

export default Tab

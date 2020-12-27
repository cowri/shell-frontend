import React, { useContext, useState } from 'react'
import styled from 'styled-components'

import { withTheme } from '@material-ui/core/styles'

import Button from '../../../components/Button'
import Container from '../../../components/Container'
import Surface from '../../../components/Surface'
import Tab from '../../../components/Tab'
import Tabs from '../../../components/Tabs'

import ShellTab from './ShellTab'
import ShellsTab from './ShellsTab'
import SwapTab from './SwapTab'

import DashboardContext from '../context'

const StyledActions = withTheme(styled.div`
  align-items: center;
  background-color: ${props => props.theme.palette.grey[50]};
  display: flex;
  height: 80px;
  padding: 0 24px;
  @media (max-width: 512px) {
    padding: 0 12px;
  }
`)

const StyledButton = withTheme(styled.button`
  align-items: center;
  background-color: ${props => props.outlined ? props.theme.palette.grey[50] : props.theme.palette.primary.main};
  border: ${props => props.outlined ? `1px solid ${props.theme.palette.grey[200]}` : '0'};
  border-radius: ${props => props.theme.shape.borderRadius}px;
  box-sizing: border-box;
  color: ${props => props.outlined ? props.theme.palette.grey[600] : '#FFF'};
  cursor: pointer;
  display: flex;
  font-size: ${props => props.small ? '0.8rem' : '1rem'};
  font-weight: 700;
  height: ${props => props.small ? 32 : 48}px;
  padding: 0 ${props => props.small ? 12 : 32}px;
  transition: background-color .2s, border-color .2s;
  pointer-events: ${props => props.disabled ? 'none' : 'all'};
  opacity: ${props => props.disabled ? 0.8 : 1};
  &:hover {
    background-color: ${props => props.outlined ? '#FFF' : props.theme.palette.primary.dark};
    color: ${props => props.outlined ? props.theme.palette.primary.main : '#FFF' };
  }
`)

const DashboardContent = ({ }) => {

  const { state } = useContext(DashboardContext)

  const [activeTab, setActiveTab] = useState('shells')
  const [shellsTab, setShellsTab] = useState('shells')
  const [shellIx, setShellIx] = useState(null)

  const showShell = (ix) => {
    setActiveTab('shell')
    setShellsTab('shell')
    setShellIx(ix)
  }

  const shellTabClick = () => {
    if (activeTab == 'shell') {
      setShellsTab('shells')
      setActiveTab('shells')
    } else if (activeTab == 'swap') {
      setActiveTab(shellsTab)
    }
  }

  return (
    <Container>
      <Surface>
        <Tabs>
          <Tab 
            active={activeTab === 'shell' || activeTab == 'shells'}
            disabled={!state.has('shells')}
            onClick={shellTabClick}
          >
            { activeTab != 'shell' ? 'Withdraw From Deactivated Shells' : <a style={{display: 'flex', alignItems: 'center'}}> <span style={{fontSize: '1.65em'}}> ← </span> Back To Deactivated Shells </a> }
          </Tab>
        </Tabs>
        { activeTab === 'shells' && <ShellsTab showShell={showShell} /> }
        { activeTab === 'shell' && <ShellTab shellIx={shellIx} /> }
      </Surface>
    </Container> 
  )
}

export default DashboardContent
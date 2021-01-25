import React, { useContext, useState } from 'react'
import Container from '../../../components/Container'
import Surface from '../../../components/Surface'
import Tab from '../../../components/Tab'
import Tabs from '../../../components/Tabs'

import ShellTab from './ShellTab'
import ShellsTab from './ShellsTab'
import SwapTab from './SwapTab'

import DashboardContext from '../context'


const DashboardContent = () => {

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
    if (activeTab === 'shell') {
      setShellsTab('shells')
      setActiveTab('shells')
    } else if (activeTab === 'swap') {
      setActiveTab(shellsTab)
    }
  }

  return (
    <Container>
      <Surface>
        <Tabs>
          <Tab 
            active={activeTab === 'shell' || activeTab === 'shells'}
            disabled={!state.has('shells')}
            onClick={shellTabClick}
          >
            { activeTab !== 'shell' ? 'Pools' : <a style={{display: 'flex', alignItems: 'center'}}> <span style={{fontSize: '1.65em'}}> ← </span> Back To Pools </a> }
          </Tab>
          <Tab 
            active={activeTab === 'swap'}
            disabled={!state.has('shells')}
            onClick={() => setActiveTab('swap')}
          >
            Swap
          </Tab>
        </Tabs>
        { activeTab === 'shells' && <ShellsTab showShell={showShell} /> }
        { activeTab === 'shell' && <ShellTab shellIx={shellIx} /> }
        { activeTab === 'swap' && <SwapTab /> }
      </Surface>
    </Container> 
  )
}

export default DashboardContent
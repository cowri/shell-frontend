import React, { useContext, useState } from 'react'

import Container from '../../../components/Container'
import Surface from '../../../components/Surface'
import Tab from '../../../components/Tab'
import Tabs from '../../../components/Tabs'

import ShellTab from './ShellTab'
import ShellsTab from './ShellsTab'
import SwapTab from './SwapTab'

import DashboardContext from '../context'

const DashboardContent = ({ }) => {

  const { state } = useContext(DashboardContext)

  const [activeTab, setActiveTab] = useState('shells')
  const [shellIx, setShellIx] = useState(null)

  const showShell = (ix) => {
    console.log("show shell", ix)
    setActiveTab('shell')
    setShellIx(ix)
  }

  const shellTabClick = () => {
    if (activeTab == 'shell') {
      setActiveTab('shells')
      setShellIx(null)
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
            { activeTab != 'shell' ? 'Shells' : <a> ← Back To Shells </a> }
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
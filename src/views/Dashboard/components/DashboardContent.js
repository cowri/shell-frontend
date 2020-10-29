import React, { useContext, useState } from 'react'

import Container from '../../../components/Container'
import Surface from '../../../components/Surface'
import Tab from '../../../components/Tab'
import Tabs from '../../../components/Tabs'

import PoolTab from './PoolTab'
import PoolsTab from './PoolsTab'
import SwapTab from './SwapTab'

import DashboardContext from '../context'

const DashboardContent = ({ }) => {

  const { state } = useContext(DashboardContext)

  const [activeTab, setActiveTab] = useState('pools')

  return (
    <Container>
      <Surface>
        <Tabs>
          <Tab 
            active={activeTab === 'pool' || activeTab == 'pools'} 
            disabled={!state.has('shells')}
            onClick={() => { if (activeTab == 'pool') setActiveTab('pools') }}
          >
            { activeTab != 'pool' ? 'Pools' : <a> Back To Pools </a> }
          </Tab>
          <Tab 
            active={activeTab === 'swap'}
            disabled={!state.has('shells')}
            onClick={() => setActiveTab('swap')}
          >
            Swap
          </Tab>
        </Tabs>

        { activeTab === 'pools' && <PoolsTab /> }
        { activeTab === 'pool' && <PoolTab /> }
        { activeTab === 'swap' && <SwapTab /> }

      </Surface>
    </Container> 
  )
}

export default DashboardContent
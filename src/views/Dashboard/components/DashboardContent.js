import React, { useContext, useState } from 'react'

import Container from '../../../components/Container'
import Surface from '../../../components/Surface'
import Tab from '../../../components/Tab'
import Tabs from '../../../components/Tabs'

import PoolTab from './PoolTab'
import SwapTab from './SwapTab'

import DashboardContext from '../context'

const DashboardContent = ({ }) => {

  const { state } = useContext(DashboardContext)

  const [activeTab, setActiveTab] = useState('pool')

  return (
    <Container>
      <Surface>
        <Tabs>
          <Tab 
            active={activeTab === 'pool'} 
            disabled={!state.has('assets')}
            onClick={() => setActiveTab('pool')}
          >
            Pool
          </Tab>
          <Tab 
            active={activeTab === 'swap'}
            disabled={!state.has('assets')}
            onClick={() => setActiveTab('swap')}
          >
            Swap
          </Tab>
        </Tabs>

        { activeTab === 'pool' && <PoolTab /> }
        { activeTab === 'swap' && <SwapTab /> }

      </Surface>
    </Container> 
  )
}

export default DashboardContent
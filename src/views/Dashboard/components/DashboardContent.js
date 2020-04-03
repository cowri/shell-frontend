import React, { useState } from 'react'

import Container from '../../../components/Container'
import Surface from '../../../components/Surface'
import Tab from '../../../components/Tab'
import Tabs from '../../../components/Tabs'

import PoolTab from './PoolTab'
import SwapTab from './SwapTab'

const DashboardContent = (value) => {
  const [activeTab, setActiveTab] = useState('pool')

  return (
    <Container>
      <Surface>
        <Tabs>
          <Tab active={activeTab === 'pool'} onClick={() => setActiveTab('pool')}>
            Pool
          </Tab>
          <Tab active={activeTab === 'swap'} onClick={() => setActiveTab('swap')}>
            Swap
          </Tab>
        </Tabs>

        {activeTab === 'pool' && <PoolTab /> }
        {activeTab === 'swap' && (<SwapTab 
          contracts={value.contracts.erc20s}
          loihi={value.contracts.loihi}
        />)}

      </Surface>
    </Container> 
  )
}

export default DashboardContent
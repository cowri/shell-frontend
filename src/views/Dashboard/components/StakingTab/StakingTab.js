import React, {useContext} from 'react';
import {TabHeading, TabContainer} from '../../../../components/TabContainer/styled.js';
import StakeItem from './StakeItem.js';
import DashboardContext from '../../context.js';
import {StakeItemContainer, StakeItemTd} from './styled.js';

export default function StakingTab({showStake}) {

  const {
    state
  } = useContext(DashboardContext)

  return (
    <TabContainer>
      <TabHeading>Liquidity farming</TabHeading>
      <StakeItemContainer th>
        <StakeItemTd>Pool</StakeItemTd>
        <StakeItemTd>Assets</StakeItemTd>
        <StakeItemTd>APR</StakeItemTd>
      </StakeItemContainer>
      {state.get('staking') && state.get('staking').stakes && Object.values(state.get('staking').stakes).map((stake) => (
        <StakeItem stake={stake} key={stake.managerAddress} showStake={showStake} />
      ))}
    </TabContainer>
  )
}

import React, {useContext} from 'react';
import {TabHeading, TabContainer} from '../../../../components/TabContainer/styled.js';
import DashboardContext from '../../context.js';
import {StakeItemContainer, StakeItemTd} from '../FarmingTab/styled.js';
import FarmItem from '../FarmingTab/FarmItem.js';

export default function StakingTab({showStake}) {

  const {
    state,
    loggedIn,
  } = useContext(DashboardContext)

  return (
    <TabContainer>
      <TabHeading>CMP Staking</TabHeading>
      <StakeItemContainer th>
        <StakeItemTd>Pool</StakeItemTd>
        <StakeItemTd>Assets</StakeItemTd>
        {loggedIn && <StakeItemTd>My deposit</StakeItemTd>}
        <StakeItemTd>APR</StakeItemTd>
      </StakeItemContainer>
      {state.get('farming') && state.get('farming').stakes && Object.values(state.get('farming').stakes).map((stake) => (
        <FarmItem farm={stake} key={stake.managerAddress} showFarm={showStake} loggedIn={loggedIn} />
      ))}
    </TabContainer>
  )
}

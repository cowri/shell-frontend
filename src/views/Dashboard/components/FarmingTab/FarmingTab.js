import React, {useContext} from 'react';
import {TabHeading, TabContainer} from '../../../../components/TabContainer/styled.js';
import DashboardContext from '../../context.js';
import {StakeItemContainer, StakeItemTd} from './styled.js';
import FarmItem from './FarmItem.js';

export default function FarmingTab({showFarm}) {

  const {
    state,
    loggedIn,
  } = useContext(DashboardContext)

  return (
    <TabContainer>
      <TabHeading>Liquidity farming</TabHeading>
      <StakeItemContainer th>
        <StakeItemTd>Pool</StakeItemTd>
        <StakeItemTd>Assets</StakeItemTd>
        {loggedIn && <StakeItemTd>My deposit</StakeItemTd>}
        <StakeItemTd>APR</StakeItemTd>
      </StakeItemContainer>
      {state.get('farming') && state.get('farming').farms && Object.values(state.get('farming').farms).map((farm) => (
        <FarmItem farm={farm} key={farm.managerAddress} showFarm={showFarm} loggedIn={loggedIn} />
      ))}
    </TabContainer>
  )
}

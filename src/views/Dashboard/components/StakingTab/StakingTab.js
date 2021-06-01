import React, {useContext} from 'react';
import {TabHeading, TabContainer} from '../../../../components/TabContainer/styled.js';
import StakeItem from './StakeItem.js';
import DashboardContext from '../../context.js';
import {StakeItemContainer, StakeItemTd} from './styled.js';

export default function StakingTab({showStack}) {

  const {
    state
  } = useContext(DashboardContext)

  return (
    <TabContainer>
      <TabHeading>Liquidity mining</TabHeading>
      <StakeItemContainer th>
        <StakeItemTd>Pool</StakeItemTd>
        <StakeItemTd>Mining</StakeItemTd>
        <StakeItemTd>APR</StakeItemTd>
      </StakeItemContainer>
      {state.get('stacking') && state.get('stacking').stacks && Object.values(state.get('stacking').stacks).map((stack) => (
        <StakeItem stack={stack} key={stack.managerAddress} showStack={showStack} />
      ))}
    </TabContainer>
  )
}

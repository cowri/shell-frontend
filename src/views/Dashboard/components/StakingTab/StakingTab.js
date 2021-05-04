import React from 'react';
import {DistributionTabTitle, StyledDistributionTab} from '../DistributionTab/styled.js';
import StakeItem from './StakeItem.js';

export default function StakingTab() {
  return (
    <StyledDistributionTab>
      <DistributionTabTitle>Staking</DistributionTabTitle>
      <StakeItem />
    </StyledDistributionTab>
  )
}

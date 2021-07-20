import React from 'react';
import { StakeItemContainer, StakeItemTd } from './styled.js';

export default function StakeItem({stake, showStake}) {
  return (
    <StakeItemContainer onClick={() => {showStake(stake.managerAddress)}}>
      <StakeItemTd>
        CMP-LP&nbsp;
        <span>({stake.name})</span>
      </StakeItemTd>
      <StakeItemTd>
        {stake.totalLockedValue.display}
        <span>(Balance: {stake.underlyingBalance.display})</span>
      </StakeItemTd>
      <StakeItemTd>
        {Number(stake.apr).toLocaleString('en-US', { minimumFractionDigits: 0 })}%
      </StakeItemTd>
    </StakeItemContainer>
  )
}

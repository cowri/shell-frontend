import React from 'react';
import { StakeItemContainer, StakeItemTd } from './styled.js';

export default function StakeItem({stack, showStack}) {
  return (
    <StakeItemContainer onClick={() => {showStack(stack.managerAddress)}}>
      <StakeItemTd>
        CMP-LP&nbsp;
        <span>({stack.name})</span>
      </StakeItemTd>
      <StakeItemTd>
        {stack.totalLockedValue.display}
        <span>(Balance: {stack.underlyingBalance.display})</span>
      </StakeItemTd>
      <StakeItemTd>
        {Number(stack.apr).toLocaleString('en-US', { minimumFractionDigits: 0 })}%
      </StakeItemTd>
    </StakeItemContainer>
  )
}

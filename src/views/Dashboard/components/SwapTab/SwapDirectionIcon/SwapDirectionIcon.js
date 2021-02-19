import React from 'react';
import {StyledSwapVert, SwapIconContainer, StyledIconButton} from './styled.js';

export const SwapDirectionIcon = ({onClick}) => {
  return (
    <SwapIconContainer>
      <StyledIconButton onClick={onClick} component="span">
        <StyledSwapVert fontSize="inherit"/>
      </StyledIconButton>
    </SwapIconContainer>
  )
}

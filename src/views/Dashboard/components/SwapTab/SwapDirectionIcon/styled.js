import styled from 'styled-components';
import {SwapVert} from '@material-ui/icons';
import {withTheme} from '@material-ui/core/styles';
import {IconButton} from '@material-ui/core';

export const SwapIconContainer = styled.div`
  position: relative;
  margin: 5px 0;
  color: rgba(172,12,238,1);
  text-align: center;
  font-size: 30px;
`

export const StyledIconButton = styled(IconButton)`
  font-size: 30px !important;
`

export const StyledSwapVert = withTheme(styled(SwapVert)`
  color: ${(p) => p.theme.palette.primary.main};
`);

import styled from 'styled-components'
import {withTheme} from '@material-ui/core/styles';
import {IS_FTM} from '../../constants/chainId.js';

export const StyledLabelBar = withTheme(styled.div`
  align-items: center;
  display: flex;
  height: 32px;
  justify-content: space-between;
  margin: 0 auto;
  max-width: ${p => p.fullWidth ? '100%' : '460px'};
`)

export const MaxAmount = styled.div`
  margin: 0 5px 0 auto;
  cursor: pointer;
  color: ${IS_FTM ? '#000' : 'inherit'};
  &:hover {
    text-decoration: underline;
  }
`

export const InputContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  margin: 0 auto;
  max-width: ${p => p.fullWidth ? '100%' : '460px'};
`;

export const StyledEndAdornment = styled.div`
  padding-left: 6px;
  padding-right: 6px;
  margin: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  white-space: nowrap;
  span {
    margin: 0 0 0 5px;
    line-height: 1em;
  }
`

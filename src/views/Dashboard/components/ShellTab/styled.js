import styled from 'styled-components';
import {withTheme} from '@material-ui/core/styles';

export const StyledShellTab = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`

export const StyledTokenName = styled.span`
  align-items: center;
  display: flex;
  flex: 1;
  font-size: 22px;
  @media (max-width: 512px) {
    font-size: 18px;
  }
`


export const Devider = styled.div`
  width: 40px;
  flex-shrink: 0;
  @media screen and (max-width: 512px) {
    width: 20px;
  }
`

export const StyledSocialIcon = styled.a`
  align-items: center;
  color: #FFF;
  display: flex;
  height: 44px;
  justify-content: center;
  width: 44px;
  margin-left: auto;
`

export const StyledBalance = styled.div`
  display: flex;
  flex: 1;
  font-size: 22px;
  justify-content: ${(p) => p.loggedIn ? 'flex-start' : 'flex-end'};
  @media (max-width: 512px) {
    font-size: 18px;
  }
`

export const StyledActions = withTheme(styled.div`
  align-items: center;
  display: flex;
  padding: 10px 40px 0;
  @media (max-width: 512px) {
    padding: 0 12px;
  }
`)

export const StyledRows = styled.div`
  margin-bottom: 12px;
`

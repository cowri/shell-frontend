import {withTheme} from '@material-ui/core/styles';
import styled from 'styled-components';
import {primary} from '../../../../theme/colors.js';
import {StyledTokenIcon} from '../../../../components/TokenIcon/TokenIcon.js';


export const StyledShellsTab = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`

export const ShellNameBody = styled.div`
  display: flex;
  align-items: center;
`;

export const Symbol = styled.span`
  text-align: center;
  display: inline;
  width: 100%;
  font-size: 18px;
  text-decoration: none;
  color: black;
`
export const Weight = styled.span`
  text-align: center;
  display: block;
  width: 100%;
  font-size: 12px;
  text-decoration: none;
  color: grey;
`

export const StyledBalance = styled.div`
  display: flex;
  flex: 1;
  font-size: 22px;
  justify-content: flex-end;
  text-align: right;
  @media (max-width: 512px) {
    font-size: 18px;
    &.mobile-hide {
      display: none;
    }
  }
  text-decoration: none;
  color: black;
`

export const PoolsTable = styled.div`
  margin-bottom: 40px;
`

export const ShellName = styled.span`
  align-items: center;
  display: flex;
  flex: 1.3;
  @media (max-width: 512px) {
    flex-wrap: wrap;
  }
`
export const ShellNamePart = styled.span`
  margin: 4px;
  padding-right: 8px;
  position: relative;
  :first-child {
    margin-left: 0;
  }
  :not(:last-child) {
    border-right: 1px solid rgba(0, 0, 0, .4);
  }
  ${StyledTokenIcon} {
    display: none;
  }
  @media screen and (max-width: 512px) {
    :not(:last-child) {
      border-right: none;
    }
    padding-right: 4px;
    ${Symbol} {
      font-size: 13px;
    }
  }
`

export const StyledInfoBlock = styled.div`
  padding: 60px 40px 30px;
  text-align: center;
  .title {
    margin-top: 0;
  }
  @media (max-width: 512px) {
    padding: 30px 12px;
    .title {
      margin: 0.8em 0 1.6em;
    }
  }
`

export const Farming = withTheme(styled.span`
  font-size: 0.8rem;
  display: inline-block;
  padding: .2em .6em;
  border: 1px solid ${(props) => props.theme.palette.primary.main};
  border-radius: 0.3em;
  color: ${(props) => props.theme.palette.primary.main};
  text-transform: uppercase;
  margin-right: auto;
  &.mobile {
    display: none;
  }
  @media (max-width: 512px) {
    order: -1;
    display: none;
    &.mobile {
      display: inline-block;
    }
  }
`)

export const StyledRow = withTheme(styled.div`
  align-items: center;
  color: ${props => props.head ? props.theme.palette.grey[500] : 'inherit'};
  display: flex;
  font-weight: ${props => props.head ? 500 : 400};
  margin: 0;
  padding: 12px 40px;
  cursor: pointer;
  :hover {
    ${Farming},
    ${Symbol},
    ${StyledBalance},
    ${Weight} {
      color: ${primary.dark};
      border-color: ${primary.dark};
    }
  }
  @media (max-width: 512px) {
    padding: 10px 12px;
  }
`)

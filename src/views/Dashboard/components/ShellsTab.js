import React, { useContext } from 'react'
import styled from 'styled-components'
import { withTheme } from '@material-ui/core/styles'

import Row from '../../../components/Row'

import BigNumber from 'bignumber.js';

import DashboardContext from '../context'
import {primary} from '../../../theme/colors.js';
import TokenIcon from '../../../components/TokenIcon';
import {StyledTokenIcon} from '../../../components/TokenIcon/TokenIcon.js';

const StyledShellsTab = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`

const StyledBalance = styled.div`
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

const PoolsTable = styled.div`
  margin-bottom: 40px;
`

const PoolsTableTh = styled.div`
  flex: 1.5;
  @media (max-width: 512px) {
    flex: 2.5;
  }
`

const ShellName = styled.span`
  align-items: center;
  display: flex;
  flex: 1.5;
  @media (max-width: 512px) {
    flex: 2.5;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: flex-start;
    text-align: center;
  }
`
const Symbol = styled.span`
  text-align: center;
  display: inline;
  width: 100%;
  font-size: 14px;
  text-decoration: none;
  color: black;
`
const Weight = styled.span`
  text-align: center;
  display: block;
  width: 100%;
  font-size: 12px;
  text-decoration: none;
  color: grey;
`
const ShellNamePart = styled.span`
  margin: 4px;
  padding-right: 4px;
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
const Farming = withTheme(styled.span`
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
const StyledRow = withTheme(styled.div`
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

const StyledInfoBlock = styled.div`
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

const ShellNameBody = styled.div`
  display: flex;
  align-items: center;
`;

const ShellsTab = ({showShell}) => {

  const {
    engine,
    state
  } = useContext(DashboardContext)
  let rows = []

  if (state.has('shells')) {
    for (let i = 0; i < engine.shells.length; i++) {
      let liqTotal = state.getIn(['shells',i,'shell','liquidityTotal','display'])
      let liqOwned = state.getIn(['shells',i,'shell','liquidityOwned','display'])

      liqTotal = liqTotal.slice(0, liqTotal.indexOf('.') === -1 ? undefined : liqTotal.indexOf('.'))
      liqOwned = liqOwned.slice(0, liqOwned.indexOf('.') === -1 ? undefined : liqOwned.indexOf('.'))

      rows.push(
        <ShellRow
          key={i}
          showShell={() => showShell(i)}
          assets={engine.shells[i].assets}
          farming={engine.shells[i].farming}
          liqTotal={liqTotal}
          liqOwned={liqOwned}
        />
      )

    }
  }

  return (
    <StyledShellsTab>
      <StyledInfoBlock>

      </StyledInfoBlock>
      <PoolsTable>
        <Row head>
          <PoolsTableTh>Pools</PoolsTableTh>
          <span style={{ flex: 1.2, textAlign: 'left' }}>Liquidity</span>
          <span style={{ flex: 1, textAlign: 'right' }}>Your Balance</span>
        </Row>
        { rows }
      </PoolsTable>
    </StyledShellsTab>
  )
}

const ShellRow = ({showShell, liqTotal, liqOwned, assets, farming}) => {

  return (
    <StyledRow onClick={showShell}>
      <ShellName>
        <ShellNameBody>
          {assets.map((asset) => (
            <>
              <ShellNamePart key={asset.symbol}>
                <Symbol>
                  { asset.symbol }
                </Symbol>
                <TokenIcon size={24}> <img src={asset.icon} alt="" /> </TokenIcon>
                <Weight>
                  { asset.weight.multipliedBy(new BigNumber(100)).toString() + '%' }
                </Weight>
              </ShellNamePart>
            </>
          ))}
        </ShellNameBody>
        <Farming className="mobile">farming</Farming>
      </ShellName>
      <StyledBalance className="mobile-hide" style={{ flex: 0.7 }}>
          {farming && <Farming>farming</Farming>}
      </StyledBalance>
      <StyledBalance className="number" style={{justifyContent: 'flex-start', flex: '1.2'}}> { liqTotal } </StyledBalance>
      <StyledBalance className="number" style={{justifyContent: 'flex-end', flex: '1'}}> { liqOwned } </StyledBalance>
    </StyledRow>
  )

}

export default ShellsTab

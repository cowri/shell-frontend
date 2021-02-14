import React, { useContext } from 'react'
import styled from 'styled-components'
import { withTheme } from '@material-ui/core/styles'

import Row from '../../../components/Row'

import BigNumber from 'bignumber.js';

import DashboardContext from '../context'
import {primary} from '../../../theme/colors.js';
import theme from '../../../theme';

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
  }
  text-decoration: none;
  color: black;
`

const PoolsTable = styled.div`
  margin-bottom: 12px;
`

const ShellName = styled.span`
  align-items: center;
  display: flex;
  flex: 1.5;
  @media (max-width: 512px) {
    flex-wrap: wrap;
  }
`
const Symbol = styled.span`
  text-align: center;
  display: inline;
  width: 100%;
  font-size: 18px;
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
  padding-right: 8px;
  position: relative;
  :first-child {
    margin-left: 0;
  }
  :not(:last-child) {
    border-right: 1px solid rgba(0, 0, 0, .4);
  }
`
const Farming = withTheme(styled.span`
  font-size: 0.8rem;
  display: inline-block;
  padding: .2em .6em;
  border: 1px solid ${(props) => props.theme.palette.primary.main};
  border-radius: 0.3em;
  color: rgba(0,0,0,.5);
  text-transform: uppercase;
  @media (max-width: 512px) {
    order: -1;
  }
`)
const StyledRow = withTheme(styled.div`
  align-items: center;
  border-top: ${props => props.hideBorder ? 0 : `1px solid ${props.theme.palette.grey[50]}`};
  color: ${props => props.head ? props.theme.palette.grey[500] : 'inherit'};
  display: flex;
  font-weight: ${props => props.head ? 500 : 400};
  margin: 0;
  padding: 12px 24px;
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
    padding: 6px 12px;
  }
`)

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
                    liqTotal={liqTotal}
                    liqOwned={liqOwned}
                />
            )

        }
    }

    return (
        <StyledShellsTab>
            <div style={{padding: '60px 20px 30px', textAlign: 'center'}}>

                <p style={{marginTop: '0px', fontSize: '24px', fontWeight: 'bold'}}>
                    ANNOUNCEMENT: LIQUIDITY FARMING
                </p>

                <p style={{ textAlign: 'left', fontSize: '20px' }}>
                    The pools listed below are incentivized with upcoming CMP governance token. The distribution will be applied retrospectively.
                </p>

                <p style={{ textAlign: 'left', fontSize: '20px' }}>
                    Track your share on the <a style={{ color: theme.palette.primary.main}} target="_blank" rel="noopener noreferrer" href="https://distribution.component.finance">rewards estimation page</a>
                </p>

            </div>
            <PoolsTable>
                <Row head>
                    <span style={{ flex: 1.5 }}> Pools </span>
                    <span style={{ flex: 1, textAlign: 'right' }}> Liquidity </span>
                    <span style={{ flex: 1, textAlign: 'right' }}> Your Balance </span>
                </Row>
                { rows }
            </PoolsTable>
        </StyledShellsTab>
    )
}

const ShellRow = ({showShell, liqTotal, liqOwned, assets}) => {

    return (
        <StyledRow onClick={showShell}>
            <ShellName>
                <ShellNameBody>
                    {assets.map((asset) => (
                        <ShellNamePart key={asset.symbol}>
                            <Symbol>
                                { asset.symbol }
                            </Symbol>
                            <Weight>
                                { asset.weight.multipliedBy(new BigNumber(100)).toString() + '%' }
                            </Weight>
                        </ShellNamePart>
                    ))}
                </ShellNameBody>
                <Farming>farming</Farming>
            </ShellName>
            <StyledBalance className="number"> { liqTotal } </StyledBalance>
            <StyledBalance className="number"> { liqOwned } </StyledBalance>
        </StyledRow>
    )

}

export default ShellsTab

import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { withTheme } from '@material-ui/core/styles'

import Button from '../../../components/Button'
import LabelledValue from '../../../components/LabelledValue'

import Overview from '../../../components/Overview'
import OverviewSection from '../../../components/OverviewSection'
import Row from '../../../components/Row'
import TokenIcon from '../../../components/TokenIcon'

import BigNumber from 'bignumber.js';

import DashboardContext from '../context'

const StyledShellsTab = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`

const StyledBalance = styled.div`
  display: flex;
  flex: 1;
  font-size: 22px;
  font-family: Arial;
  justify-content: flex-end;
  text-align: right;
  @media (max-width: 512px) {
    font-size: 18px;
  }
  text-decoration: ${ props => props.moused ? 'underlined' : 'none' };
  color: ${ props => props.moused ? '#0000EE' : 'black' }
`

const StyledRows = styled.div`
  margin-bottom: 12px;
`

const ShellName = styled.span`
  align-items: center;
  display: flex;
  flex: 1.5;
`
const ShellNamePart = styled.span`
  margin: 4px;
  padding-right: 8px;
  position: relative;
  &:after {
    content: "";
    height: 75%;
    width: .5px;
    background-color: black;
    position: absolute;
    right: 0;
    top: 5px;
  }
`

const ShellNamePartLast = styled.span`
  margin: 4px;
  position: relative;
`

const Symbol = styled.span`
  text-align: center;
  display: inline;
  width: 100%;
  font-size: 18px;
  text-decoration: ${ props => props.moused ? 'underlined' : 'none' };
  color: ${ props => props.moused ? '#0000EE' : 'black' };
`
const Weight = styled.span`
  text-align: center;
  display: block;
  width: 100%;
  font-size: 12px;
  text-decoration: ${ props => props.moused ? 'underlined' : 'none' };
  color: ${ props => props.moused ? '#0000EE' : 'grey' };
`
const StyledActions = withTheme(styled.div`
  align-items: center;
  display: flex;
  height: 80px;
  padding: 0 24px;
  @media (max-width: 512px) {
    padding: 0 12px;
  }
`)

const StyledButton = withTheme(styled.button`
  align-items: center;
  background-color: ${props => props.outlined ? props.theme.palette.grey[50] : props.theme.palette.primary.main};
  border: ${props => props.outlined ? `1px solid ${props.theme.palette.grey[200]}` : '0'};
  border-radius: ${props => props.theme.shape.borderRadius}px;
  box-sizing: border-box;
  color: ${props => props.outlined ? props.theme.palette.grey[600] : '#FFF'};
  cursor: pointer;
  display: flex;
  font-size: ${props => props.small ? '0.8rem' : '1rem'};
  font-weight: 700;
  height: ${props => props.small ? 32 : 48}px;
  padding: 0 ${props => props.small ? 12 : 32}px;
  transition: background-color .2s, border-color .2s;
  pointer-events: ${props => props.disabled ? 'none' : 'all'};
  opacity: ${props => props.disabled ? 0.8 : 1};
  &:hover {
    background-color: ${props => props.outlined ? '#FFF' : props.theme.palette.primary.dark};
    color: ${props => props.outlined ? props.theme.palette.primary.main : '#FFF' };
  }
`)

const ShellsTab = ({showShell}) => {

  const {
    presentShell,
    engine,
    state
  } = useContext(DashboardContext)

  let hovers = []
  let rows = []

  if (state.has('shells')) {
    for (let i = 0; i < engine.shells.length; i++) {
      let liqTotal = state.getIn(['shells',i,'shell','liquidityTotal','display'])

      rows.push(
        <ShellRow
          showShell={() => showShell(i)}
          assets={engine.shells[i].assets}
          liqTotal={liqTotal}
          apy={engine.shells[i].apy}
        />
      )

    }
  }

  return (
    <StyledShellsTab>
        <p style={{padding: '20px', textAlign: 'center'}}>
          We have decided to migrate liquidity from the old shells to the new shells.
          In order to test various Shell parameters before our new model, 
          we have decided to deploy new pools.
          <p>
            <a href="https://google.com">
              Read more about this in our blog post.
            </a>
          </p>
          <p>
            Please click the button below to migrate your liquidity out of the old shells.
          </p>
          <StyledActions>
            <StyledButton style={{ margin: '0 auto' }} >
              <a style={{ color: 'white', textDecoration: 'none' }} 
                target="_blank" 
                href="https://deactivated.shells.exchange"
              >
                Withdraw from Deactivated Shells
              </a>
            </StyledButton>
          </StyledActions>
        </p>
      <StyledRows>
        <Row head>
          <span style={{ flex: 1.5 }}> Shells </span>
          <span style={{ flex: 1, textAlign: 'right' }}> Liquidity </span>
          <span style={{ flex: 1, textAlign: 'right' }}> APY </span>
        </Row>
        { rows }
      </StyledRows>
    </StyledShellsTab>
  )
}

const ShellRow = ({showShell, liqTotal, assets, apy}) => {

  const useHover = () => {
    const [hovered, setHovered] = useState()
    const handlers = useMemo(() => ({
      onMouseOver(){ setHovered(true) },
      onMouseOut(){ setHovered(false) }
    }),[])
    return [hovered, handlers]
  }

  const [ hovered, handlers ] = useHover()

  const name = getName(assets)

  function getName (assets) {

    const parts = assets.map( (a,i) => {

      if (i == assets.length - 1) {

        return (
          <ShellNamePartLast>
            <Symbol moused={hovered}>
              { a.symbol }
            </Symbol>
            <Weight moused={hovered}>
              { a.weight.multipliedBy(new BigNumber(100)).toString() + '%' }
            </Weight>
          </ShellNamePartLast>
        )

      } else {

        return (
          <ShellNamePart>
            <Symbol moused={hovered}>
              { a.symbol }
            </Symbol>
            <Weight moused={hovered}>
              { a.weight.multipliedBy(new BigNumber(100)).toString() + '%' }
            </Weight>
          </ShellNamePart>
        )

      }

    })

    return (
      <ShellName>
        {parts}
      </ShellName>
    )

  }

  return (
    <Row onClick={showShell} {...handlers} style={{cursor:'pointer'}}>
      {name}
      <StyledBalance className="number" moused={hovered}> { liqTotal } </StyledBalance>
      { !apy ? <StyledBalance> -- &nbsp; </StyledBalance> 
          : <StyledBalance className="number" moused={hovered}> {apy} </StyledBalance> }
          
    </Row>
  )

}

export default ShellsTab

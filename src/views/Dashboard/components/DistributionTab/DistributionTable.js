import React, {useMemo, useState} from 'react';
import styled from 'styled-components';
import dataStore from '../../../../store/data.js';
import useSubject from '../../../../store/useSubject.js';
import Arrow from '../../../../up-arrow.svg'
import Button from '../../../../components/Button';
import {withTheme} from '@material-ui/core/styles';

function formatNumber(x) {
  if (x > 1_000_000) {
    return `${Math.floor(x / 10_000) / 100}M`
  }
  if (x > 1_000) {
    return `${Math.floor(x / 10) / 100}K`
  }
  let y = x.toString()
  const dotIndex = y.indexOf('.')
  if (dotIndex !== -1) {
    let a = y.substr(0, y.indexOf('.'))
    let b = y.substr(y.indexOf('.'))
    return a.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + b
  }
  return y.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const StyledActions = withTheme(styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  padding: 10px 40px 0;
  @media (max-width: 512px) {
    padding: 0 12px;
  }
`)

const StyledTable = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledTd = styled.div`
  flex: 2 1 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  &:first-child {
    flex: 0 0 40px;
    height: 26px;
  }
  &:nth-child(2) {
    flex-grow: 3;
    @media (max-width: 600px) {
      justify-content: center;
    }
  }
  &:nth-child(3) {
    @media (max-width: 600px) {
      justify-content: flex-end;
      flex-grow: 0;
    }
  }
  &:last-child {
    flex: 0 0 85px;
    @media (max-width: 600px) {
      flex-basis: 100%;
      margin-top: 10px;
      justify-content: center;
    }
  }
`;

const StyledTableHead = styled.div`
  display: flex;
  flex-direction: row;
  ${StyledTd} {
    font-weight: bold;
  }
  @media (max-width: 600px) {
    display: none;
  }
`;

const StyledTableRow = styled.div`
  display: flex;
  flex-direction: row;
  padding: 5px 0;
  @media (max-width: 600px) {
    flex-wrap: wrap;
    background: rgba(255,255,255,0.4);
    padding: 5px 20px;
    margin-bottom: 10px;
  }
`;

const TableMessage = styled.div`
  width: 100%;
  text-align: center;
  font-size: 18px;
  margin: 1em 0;
`

const StyledInput = styled.input`
  width: 100%;
  margin: 0 auto;
  display: block;
  box-sizing: border-box;
  background: #e9cff9;
  border: none;
  box-shadow: none;
  height: 60px;
  font-size: 20px;
  border-radius: 16px;
  padding: 0 0 0 30px;
  outline: none;
  margin-bottom: 25px;
`;

export default function DistributionTable() {
  const balances = useSubject(dataStore.distribution);
  const errorInfo = useSubject(dataStore.error);
  const stage = useSubject(dataStore.stage);
  const totalStake = useSubject(dataStore.totalStake);
  const [searchPhrase, setSearchPhrase] = useState('');
  const [copied, setCopied] = useState(false);
  const [onPage, setOnPage] = useState(10);

  React.useEffect(() => {
    if (copied) setTimeout(() => setCopied(false), 1000)
  }, [copied])

  const filteredBalances = useMemo(() => {
    if (searchPhrase)
      return balances.filter((balance) => {
        return balance.address.toLowerCase().includes(searchPhrase.toLowerCase());
      }).slice(0, onPage);
    else return balances.slice(0, onPage);
  }, [searchPhrase, balances, onPage]);

  return (
    <>
      <StyledInput onInput={(e) => setSearchPhrase(e.target.value)} placeholder="Search by address"/>
      <StyledTable>
        <StyledTableHead>
          <StyledTd>👑</StyledTd>
          <StyledTd>Address</StyledTd>
          <StyledTd>Stake</StyledTd>
          <StyledTd>Percent</StyledTd>
        </StyledTableHead>
        {!balances.length ? (
          <TableMessage>Fetching data, please wait ~1 min</TableMessage>
        ) : filteredBalances.length ? (
          filteredBalances.map((item) => {
            const currentDistributionPercent =  Number(item.currentStake * window.BigInt(1_000_000) / totalStake) / 10000
            return (
              <StyledTableRow key={item.id}>
                <StyledTd>{item.id}</StyledTd>
                <StyledTd style={{fontFamily: 'monospace'}}>{item.address.substring(0, 8)}...{item.address.substring(36)}</StyledTd>
                <StyledTd>{formatNumber(Number(item.currentStake / window.BigInt(10 ** 18)))}</StyledTd>
                <StyledTd>
                  <span>{item.distributionPercent.toFixed(4)}&nbsp;%&nbsp;</span>
                  {currentDistributionPercent > item.distributionPercent ?
                    <img alt='' src={Arrow} style={{display: 'block', width: '15px'}}/> :
                    <img alt='' src={Arrow} style={{transform: 'rotate(180deg)', display: 'block', width: '15px'}}/>}
                </StyledTd>
              </StyledTableRow>
            )
          })
        ) : (
          <TableMessage>No matches</TableMessage>
        )}
        <StyledActions>
          <Button
            style={{
              opacity: filteredBalances.length < onPage ? '0' : '1',
              visibility: filteredBalances.length < onPage ? 'hidden' : 'visible',
            }}
            fullWidth
            onClick={() => setOnPage(onPage + 10) }
          >Show more</Button>
        </StyledActions>
      </StyledTable>
    </>
  )
}

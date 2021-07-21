import React, {useContext, useEffect, useState} from 'react';
import {TabActions, TabContainer, TabHeading} from '../../../../components/TabContainer/styled.js';
import DashboardContext from '../../context.js';
import Button from '../../../../components/Button';
import {FarmTabWithdrawModal} from './FarmTabWithdrawModal';
import {FarmTabDepositModal} from './FarmTabDepositModal';
import Spinner from '../../../../components/Spiner/Spinner.js';

export function FarmTab({farmAddress}) {
  const [loading, setLoading] = useState(true)
  const [farm, setFarm] = useState(null)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showClaimModal, setShowClaimModal] = useState(false)

  const {
    state,
    loggedIn,
    selectWallet,
  } = useContext(DashboardContext)

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const address = farmAddress || queryParams.get('address')
    if (address && state.get('farming') && state.get('farming').farms) setFarm(state.get('farming').farms[address]);
    setLoading(false)
  }, [state, farmAddress])

  return (
    <TabContainer>
      {loading ? <Spinner /> : farm ? (
        <>
          {showWithdrawModal && <FarmTabWithdrawModal onDismiss={() => setShowWithdrawModal(false)} farm={farm} />}
          {showDepositModal && <FarmTabDepositModal onDismiss={() => setShowDepositModal(false)} farm={farm} />}
          <TabHeading>{farm.name}</TabHeading>
          <p>TVL: {farm.totalLockedValue.display}</p>
          <p>Deposited: {farm.userLockedValue.display}</p>
          <p>Available to deposit: {farm.underlyingBalance.display}</p>
          <p>APR: {farm.apr}%</p>
          <p>Claimable: {farm.CMPEarned.display}</p>
          <TabActions>
            {loggedIn &&
              <Button
                fullWidth
                onClick={() => setShowDepositModal(true)}
              >
                Deposit
              </Button>
            }
            {loggedIn && farm.CMPEarned.numeraire.gt(0) &&
                <Button
                  fullWidth
                  onClick={() => farm.claim()} onDismiss={() => setShowClaimModal(false)}
                >Claim</Button>
              }
            {loggedIn && farm.userLockedValue?.numeraire.gt(0) &&
                <Button
                  outlined
                  fullWidth
                  onClick={() => setShowWithdrawModal(true)}
                >Withdraw</Button>
              }
            {!loggedIn && <Button onClick={selectWallet} fullWidth>Connect</Button>}
          </TabActions>
        </>
      ) : (
        <TabHeading>Unknown farm address</TabHeading>
      )}
    </TabContainer>
  )
}

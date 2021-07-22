import React, {useContext, useEffect, useState} from 'react';
import {TabActions, TabContainer, TabHeading} from '../../../../components/TabContainer/styled.js';
import DashboardContext from '../../context.js';
import Button from '../../../../components/Button';
import {StakeTabWithdrawModal} from './StakeTabWithdrawModal';
import {StakeTabDepositModal} from './StakeTabDepositModal';
import Spinner from '../../../../components/Spiner/Spinner.js';

export function StakeTab({stakeAddress}) {
  const [loading, setLoading] = useState(true)
  const [stake, setStake] = useState(null)
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
    const address = stakeAddress || queryParams.get('address')
    if (address && state.get('farming') && state.get('farming').stakes) setStake(state.get('farming').stakes[address]);
    setLoading(false)
  }, [state, stakeAddress])

  return (
    <TabContainer>
      {loading ? <Spinner /> : stake ? (
        <>
          {showWithdrawModal && <StakeTabWithdrawModal onDismiss={() => setShowWithdrawModal(false)} stake={stake} />}
          {showDepositModal && <StakeTabDepositModal onDismiss={() => setShowDepositModal(false)} stake={stake} />}
          <TabHeading>{stake.name}</TabHeading>
          <p>TVL: {stake.totalLockedValue.display}</p>
          <p>Deposited: {stake.userLockedValue.display}</p>
          <p>Available to deposit: {stake.underlyingBalance.display}</p>
          <p>APR: {stake.apr}%</p>
          <p>Claimable: {stake.CMPEarned.display}</p>
          <TabActions>
            {loggedIn &&
              <Button
                fullWidth
                onClick={() => setShowDepositModal(true)}
              >
                Deposit
              </Button>
            }
            {loggedIn && stake.CMPEarned.numeraire.gt(0) &&
                <Button
                  fullWidth
                  onClick={() => stake.claim()} onDismiss={() => setShowClaimModal(false)}
                >Claim</Button>
              }
            {loggedIn && stake.userLockedValue?.numeraire.gt(0) &&
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
        <TabHeading>Unknown stake address</TabHeading>
      )}
    </TabContainer>
  )
}

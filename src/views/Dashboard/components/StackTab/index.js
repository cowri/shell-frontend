import React, {useContext, useEffect, useState} from 'react';
import {TabActions, TabContainer, TabHeading} from '../../../../components/TabContainer/styled.js';
import DashboardContext from '../../context.js';
import Button from '../../../../components/Button';
import {StackTabWithdrawModal} from './StackTabWithdrawModal';
import {StackTabDepositModal} from './StackTabDepositModal';
import Spinner from '../../../../components/Spiner/Spinner.js';

export function StackTab({stackAddress}) {
  const [loading, setLoading] = useState(true)
  const [stack, setStack] = useState(null)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showClaimModal, setShowClaimModal] = useState(false)

  const {state} = useContext(DashboardContext)

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const address = stackAddress || queryParams.get('address')
    if (address && state.get('stacking') && state.get('stacking').stacks) setStack(state.get('stacking').stacks[address]);
    setLoading(false)
  }, [state, stackAddress])

  return (
    <TabContainer>
      {loading ? <Spinner /> : stack ? (
        <>
          {showWithdrawModal && <StackTabWithdrawModal onDismiss={() => setShowWithdrawModal(false)} stack={stack} />}
          {showDepositModal && <StackTabDepositModal onDismiss={() => setShowDepositModal(false)} stack={stack} />}
          <TabHeading>{stack.name}</TabHeading>
          <p>TVL: {stack.totalLockedValue.display}</p>
          <p>Locked: {stack.userLockedValue.display}</p>
          <p>CMP price: ${stack.CMPPrice}</p>
          <p>APR: {stack.apr}%</p>
          <p>Claimable: {stack.CMPEarned.display}</p>
          <TabActions>
            <Button
              fullWidth
              onClick={() => setShowDepositModal(true)}
            >
              Deposit
            </Button>
            <Button
              fullWidth
              onClick={() => stack.claim()} onDismiss={() => setShowClaimModal(false)}
            >Claim</Button>
            <Button
              outlined
              fullWidth
              onClick={() => setShowWithdrawModal(true)}
            >Withdraw</Button>
          </TabActions>
        </>
      ) : (
        <TabHeading>Unknown stack address</TabHeading>
      )}
    </TabContainer>
  )
}

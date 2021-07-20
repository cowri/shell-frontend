import React, {useContext, useState} from 'react';
import styled from 'styled-components';
import Modal from '../Modal';
import DashboardContext from '../../views/Dashboard/context.js';
import ModalActions from '../Modal/ModalActions';
import Button from '../Button';
import ModalTitle from '../Modal/ModalTitle';
import ModalContent from '../Modal/ModalContent';
import ModalConfirm from '../Modal/ModalConfirm';
import ModalError from '../Modal/ModalError';
import WithdrawingModal from '../Modal/ModalAwaitingTx/ModalAwaitingTx.js';
import ModalSuccess from '../Modal/ModalSuccess';
import BN from '../../utils/BN.js';

const ClaimModalParam = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1em;
  font-size: 22px;
  span:first-child {
    font-weight: 600;
    @media screen and (max-width: 600px) {
      font-size: 18px;
    }
  }
  span:last-child {
    margin-left: 20px;
    @media screen and (max-width: 600px) {
      margin-left: 0;
    }
  }
  @media screen and (max-width: 600px) {
    flex-direction: column;
    font-size: 16px;
  }
`

export function ClaimRewardsModal({onDismiss}) {
  const [step, setStep] = useState('start')
  const [txHash, setTxHash] = useState('')

  const {
    engine
  } = useContext(DashboardContext)

  function handleTxHash(hash) {
    setStep('claiming');
    setTxHash(hash);
  }

  function onError() {
    setStep('error');
  }

  function onConfirmation() {
    engine.sync();
    setStep('success');
  }

  async function claim() {
    setStep('confirm');
    engine.rewards.claim(handleTxHash, onConfirmation, onError)
  }

  return (
    <>
      {step === 'start' && (
        <Modal onDismiss={onDismiss}>
          <ModalTitle>Claim Rewards</ModalTitle>
          <ModalContent>
            <ClaimModalParam><span>Wallet:</span><span>{engine.rewards.account}</span></ClaimModalParam>
            <ClaimModalParam><span>Claimable:</span><span>{BN(engine.rewards.amount).div(10 ** 18).toFixed(4)} CMP</span></ClaimModalParam>
          </ModalContent>
          <ModalActions>
            <Button outlined onClick={onDismiss}> Cancel </Button>
            <Button onClick={claim}>Claim</Button>
          </ModalActions>
        </Modal>
      )}
      {step === 'confirm' && <ModalConfirm wallet={engine.wallet} />}
      {step === 'claiming' && <WithdrawingModal txHash={txHash} />}
      {step === 'success' && (
        <ModalSuccess
          buttonBlurb={'Finish'}
          onDismiss={onDismiss}
          title={'Claim Successful.'}
          txHash={txHash}
        />
      )}
      {step === 'error' && (
        <ModalError
          buttonBlurb={'Finish'}
          onDismiss={onDismiss}
          title={'An error occurred.'}
          txHash={txHash}
        />)
      }
    </>
  )
}

import React, {useState} from 'react';
import styled from 'styled-components'
import Button from '../Button';
import {ClaimRewardsModal} from './ClaimRewardsModal.js';

export function ClaimRewards() {
  const [showClaimModal, setShowClaimModal] = useState(false);

  return (
    <>
      <Button
        onClick={ () => setShowClaimModal(true) }
        style={{margin: 0, justifySelf: 'flex-end', width: 'auto',}}
      >
        Claim rewards
      </Button>
      {showClaimModal && <ClaimRewardsModal onDismiss={() => setShowClaimModal(false)}/>}
    </>
  )
}

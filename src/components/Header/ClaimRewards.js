import React, {useState} from 'react';
import styled from 'styled-components'
import Button, {StyledButton} from '../Button/Button.js';
import {ClaimRewardsModal} from './ClaimRewardsModal.js';

const ClaimRewardsContainer = styled.div`
  @media screen and (max-width: 600px) {
    width: 100%;
    ${StyledButton} {
      margin: 40px auto 0 !important;
      justify-self: center !important;
    }
  }
`

export function ClaimRewards() {
  const [showClaimModal, setShowClaimModal] = useState(false);

  return (
    <ClaimRewardsContainer>
      <Button
        onClick={ () => setShowClaimModal(true) }
        style={{margin: 0, justifySelf: 'flex-end', width: 'auto',}}
      >
        Claim rewards
      </Button>
      {showClaimModal && <ClaimRewardsModal onDismiss={() => setShowClaimModal(false)}/>}
    </ClaimRewardsContainer>
  )
}

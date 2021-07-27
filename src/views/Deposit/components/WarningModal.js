import React from 'react'
import { withTheme } from '@material-ui/core/styles'
import styled from 'styled-components'

import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import ModalActions from '../../../components/Modal/ModalActions'

const ModalContent = withTheme(styled.div`
  flex: 1;
  color: red;
  padding: 0 40px 20px;
  margin-top: -10px;
  font-size: 20px;
`)

const ModalTitle = withTheme(styled.div`
  font-size: 1.75rem;
  margin-bottom: 6px;
  margin-top: 24px;
  color: red;
  padding: 0 24px;
`)

const ModalWarning = ({
  onCancel,
  onContinue
}) => {

  const message = ( <ModalContent>
    <p> Component is in beta. </p>
    <p> Please note that this is an early version of the Сomponent. The protocol, dapp (https://component.finance/), and all content are provided on an "as is" basis.
        While we have made reasonable efforts to ensure the Сomponent's security and functionality, we strongly advise anyone who chooses to use the early experimental version: Don't risk any funds you do not afford to lose.
        The Сomponent team does not give any warranties, whether express or implied, regarding the protocol's suitability or usability. The Сomponent will not be liable for any loss, whether such loss is direct, indirect, special, or consequential, suffered by any party due to their use of the Сomponent.
        Thank you for being an early adopter. </p>
  </ModalContent> )

  return (
    <Modal>
      <ModalTitle> Caution </ModalTitle>
      { message }
      <ModalActions>
        <Button outlined onClick={onCancel}> Cancel </Button>
        <Button onClick={onContinue}> Continue </Button>
      </ModalActions>
    </Modal>
  )

}

export default ModalWarning

import React, { useState } from 'react'
import { withTheme } from '@material-ui/core/styles'
import styled from 'styled-components'

import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalIcon from '../../../components/ModalIcon'

const ModalContent = withTheme(styled.div`
  flex: 1;
  color: red;
  padding: 0px 40px 20px;
  margin-top: -10px;
  font-size: 24px;
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

  return (
    <Modal>
      <ModalTitle> Caution </ModalTitle>
      <ModalContent>
        <p> Shell Protocol is in beta. </p>
        <p> Please do not deposit any funds you can not afford to lose. </p>
      </ModalContent>
      <ModalActions>
        <Button outlined onClick={onCancel}> Cancel </Button>
        <Button onClick={onContinue}> Continue </Button>
      </ModalActions>
    </Modal>
  )

}

export default ModalWarning

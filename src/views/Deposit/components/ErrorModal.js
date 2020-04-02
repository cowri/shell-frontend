import React from 'react'

import WarningIcon from '@material-ui/icons/Warning'

import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalIcon from '../../../components/ModalIcon'
import ModalTitle from '../../../components/ModalTitle'

const ErrorModal = ({
  onDismiss
}) => {
  return (
    <Modal>
      <ModalIcon>
        <WarningIcon />
      </ModalIcon>
      <ModalTitle>An error occurred.</ModalTitle>
      <ModalActions>
        <Button onClick={onDismiss}>Finish</Button>
      </ModalActions>
    </Modal>
  )
}

export default ErrorModal
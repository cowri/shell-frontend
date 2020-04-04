import React from 'react'

import DoneIcon from '@material-ui/icons/Done'

import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalIcon from '../../../components/ModalIcon'
import ModalTitle from '../../../components/ModalTitle'

const SuccessModal = ({
  onDismiss,
  title,
}) => {
  return (
    <Modal>
      <ModalIcon>
        <DoneIcon />
      </ModalIcon>
      <ModalTitle>Deposit Successful.</ModalTitle>
      <ModalActions>
        <Button onClick={onDismiss}>Finish</Button>
      </ModalActions>
    </Modal>
  )
}

export default SuccessModal
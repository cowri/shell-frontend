import React from 'react'

import DoneIcon from '@material-ui/icons/Done'

import Button from '../Button'
import Modal from '../Modal'
import ModalActions from '../ModalActions'
import ModalIcon from '../ModalIcon'
import ModalTitle from '../ModalTitle'

const ModalSuccess = ({
  buttonBlurb,
  onDismiss,
  title
}) => {
  return (
    <Modal>
      <ModalIcon>
        <DoneIcon />
      </ModalIcon>
      <ModalTitle>{title}</ModalTitle>
      <ModalActions>
        <Button onClick={onDismiss}>{buttonBlurb}</Button>
      </ModalActions>
    </Modal>
  )
}

export default ModalSuccess
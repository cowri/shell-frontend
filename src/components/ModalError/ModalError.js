import React from 'react'

import WarningIcon from '@material-ui/icons/Warning'

import Button from '../Button'
import Modal from '../Modal'
import ModalActions from '../ModalActions'
import ModalIcon from '../ModalIcon'
import ModalTitle from '../ModalTitle'

const ModalError = ({
  buttonBlurb,
  onDismiss,
  title
}) => {
  return (
    <Modal>
      <ModalIcon>
        <WarningIcon />
      </ModalIcon>
      <ModalTitle>{title}</ModalTitle>
      <ModalActions>
        <Button onClick={onDismiss}>{buttonBlurb}</Button>
      </ModalActions>
    </Modal>
  )
}

export default ModalError
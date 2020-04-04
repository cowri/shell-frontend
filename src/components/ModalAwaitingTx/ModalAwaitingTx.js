import React from 'react'

import HourglassFullIcon from '@material-ui/icons/HourglassFull'

import Loader from '../Loader'
import Modal from '../Modal'
import ModalActions from '../ModalActions'
import ModalIcon from '../ModalIcon'
import ModalTitle from '../ModalTitle'

const AwaitingTxModal = () => {
  return (
    <Modal>
      <ModalIcon>
        <HourglassFullIcon />
      </ModalIcon>
      <ModalTitle>Please wait while transaction confirms.</ModalTitle>
      <ModalActions>
        <div style={{ flex: 1 }}>
          <Loader />
        </div>
      </ModalActions>
    </Modal>
  )
}

export default AwaitingTxModal
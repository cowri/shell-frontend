import React from 'react'

import HourglassFullIcon from '@material-ui/icons/HourglassFull'

import Loader from '../../../components/Loader'
import Modal from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalIcon from '../../../components/ModalIcon'
import ModalTitle from '../../../components/ModalTitle'

const DepositingModal = ({
}) => {
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

export default DepositingModal
import React from 'react'
import Button from '../../../components/Button'
import ErrorIcon from '@material-ui/icons/Warning'
import Modal from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalIcon from '../../../components/ModalIcon'
import ModalTitle from '../../../components/ModalTitle'

const SelectWallet = ({
  selectWallet,
  ...props
}) => {

  return (
    <Modal>
      <ModalTitle>
        Select Your Wallet
      </ModalTitle>
      <ModalIcon>
        <ErrorIcon style={{ fontSize: 48 }} />
      </ModalIcon>
      <ModalActions centered={true}>
        <Button onClick={() => selectWallet() }>
          Refresh
        </Button>
      </ModalActions>
    </Modal>
  )

}

export default SelectWallet
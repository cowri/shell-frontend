import React, { useContext, useState } from 'react'

import LockIcon from '@material-ui/icons/Lock'

import Button from '../../../components/Button'
import Loader from '../../../components/Loader'
import Modal from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalContent from '../../../components/ModalContent'
import ModalIcon from '../../../components/ModalIcon'
import ModalTitle from '../../../components/ModalTitle'

import metamaskLogo from '../../../img/metamask.svg'

import DashboardContext from '../context'

const Unlock = () => {
  const { onEnable } = useContext(DashboardContext)
  const [isRequesting, setIsRequesting] = useState()

  const handleUnlockClick = () => {
    setIsRequesting(true)
    onEnable().catch(e => setIsRequesting(false))
  }
  
  if (isRequesting) {
    return (
      <Modal onDismiss={() => setIsRequesting(false)}>
        <ModalIcon>
          <img src={metamaskLogo} />
        </ModalIcon>
        <ModalTitle>Confirming with MetaMask</ModalTitle>
        <ModalActions>
          <div style={{ width: '100%' }}>
          <Loader />
          </div>
        </ModalActions>
      </Modal>
    )
  } else {
    return (
      <Modal>
        <ModalIcon>
          <LockIcon style={{ fontSize: 48 }} />
        </ModalIcon>
        <ModalTitle>
          Unlock to access the dashboard.
        </ModalTitle>
        <ModalActions centered={true}>
          <Button onClick={handleUnlockClick}>Unlock Wallet</Button>
        </ModalActions>
      </Modal>
    )
  }
}

export default Unlock
import React from 'react'

import metamaskLogo from '../../assets/metamask.svg'
import walletConnectLogo from '../../assets/walletConnectLogo.png'

import Loader from '../Loader'
import Modal from '../Modal'
import ModalActions from '../ModalActions'
import ModalIcon from '../ModalIcon'
import ModalTitle from '../ModalTitle'

const ModalConfirm = ({wallet}) => (
  <Modal>
    <ModalTitle> Confirming with { wallet } </ModalTitle>
    <ModalIcon>
      <img 
        alt="Wallet Logo"
        src={ wallet == 'MetaMask' ? metamaskLogo :
              wallet == 'WalletConnect' ? walletConnectLogo :
              ''
            } 
        style={{ height: 96 }} 
      />
    </ModalIcon>
    <ModalActions>
      <div style={{ width: '100%' }}>
      <Loader />
      </div>
    </ModalActions>
  </Modal>
)

export default ModalConfirm
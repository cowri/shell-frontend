import React from 'react'

import metamaskLogo from '../../assets/metamask.svg'

import Loader from '../Loader'
import Modal from '../Modal'
import ModalActions from '../ModalActions'
import ModalIcon from '../ModalIcon'
import ModalTitle from '../ModalTitle'

const ModalConfirmMetamask = () => (
  <Modal>
    <ModalTitle> Confirming with MetaMask </ModalTitle>
    <ModalIcon>
      <img src={metamaskLogo} style={{ height: 96 }} />
    </ModalIcon>
    <ModalActions>
      <div style={{ width: '100%' }}>
      <Loader />
      </div>
    </ModalActions>
  </Modal>
)

export default ModalConfirmMetamask
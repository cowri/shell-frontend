import React from 'react'

import styled from 'styled-components'

import HourglassFullIcon from '@material-ui/icons/HourglassFull'

import etherscan from '../../assets/etherscan-logo-circle.svg'

import Loader from '../Loader'
import Modal from '../Modal'
import ModalActions from '../ModalActions'
import ModalIcon from '../ModalIcon'
import ModalTitle from '../ModalTitle'

const StyledViewOnEtherscan = styled.div`
  font-size: 1.3em;
  margin-bottom: 30px;
  margin-top: 18px;
`



const AwaitingTxModal = (props) => {
  const { txHash } = props
  return (
    <Modal>
      <ModalTitle> Please wait while your transaction confirms </ModalTitle>
      <ModalIcon>
        <HourglassFullIcon />
      </ModalIcon>
      <StyledViewOnEtherscan>
        <a style={{textDecoration:'none', color:'inherit'}} target="_blank" href={"https://etherscan.io/tx/" + txHash}>
          <img src={etherscan} style={{margin: '-3.5px 10px', width: '1.15em'}} />
          <span>
            View On Etherscan
          </span>
        </a>
      </StyledViewOnEtherscan>
      <ModalActions>
        <div style={{ flex: 1 }}>
          <Loader />
        </div>
      </ModalActions>
    </Modal>
  )
}

export default AwaitingTxModal
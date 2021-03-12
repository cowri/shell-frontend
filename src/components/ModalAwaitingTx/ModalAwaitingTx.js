import React from 'react'

import config from "../../mainnet.multiple.config.json"

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

const AwaitingTxModal = ({ txHash }) => {

    const etherscanlink = config.network === 42
        ? "https://kovan.etherscan.io/tx/" + txHash
        : config.network === 4 ? "https://rinkeby.etherscan.io/tx/" + txHash
            : config.network === 56 ? "https://bscscan.com/tx/" + txHash
                : "https://etherscan.io/tx/" + txHash

  return (
    <Modal>
      <ModalTitle> Please wait while your transaction confirms </ModalTitle>
      <ModalIcon>
        <HourglassFullIcon />
      </ModalIcon>
      {
        txHash ?  <StyledViewOnEtherscan>
          <a href={etherscanlink} style={{textDecoration:'none', color:'inherit'}} target="_blank" rel="noopener noreferrer">
            <img src={etherscan} style={{margin: '-3.5px 10px', width: '1.15em'}} alt="" />
            <span>
              View On Explorer
            </span>
          </a>
        </StyledViewOnEtherscan> : null
      }
      <ModalActions>
        <div style={{ flex: 1 }}>
          <Loader />
        </div>
      </ModalActions>
    </Modal>
  )
}

export default AwaitingTxModal

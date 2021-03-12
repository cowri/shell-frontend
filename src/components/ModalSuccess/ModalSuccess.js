import React from 'react'

import config from "../../mainnet.multiple.config"

import styled from 'styled-components'

import etherscan from '../../assets/etherscan-logo-circle.svg'

import DoneIcon from '@material-ui/icons/Done'

import Button from '../Button'
import Modal from '../Modal'
import ModalActions from '../ModalActions'
import ModalIcon from '../ModalIcon'
import ModalTitle from '../ModalTitle'

const StyledViewOnEtherscan = styled.div`
  font-size: 1.3em;
  margin-bottom: 30px;
  margin-top: 18px;
`

const ModalSuccess = ({
  buttonBlurb,
  onDismiss,
  title,
  txHash
}) => {

    const etherscanlink = config.network === 42
        ? "https://kovan.etherscan.io/tx/" + txHash
        : config.network === 4 ? "https://rinkeby.etherscan.io/tx/" + txHash
            : config.network === 56 ? "https://bscscan.com/tx/" + txHash
                : "https://etherscan.io/tx/" + txHash

    return (
        <Modal>
            <ModalTitle>{title}</ModalTitle>
            <ModalIcon>
                <DoneIcon/>
            </ModalIcon>
            {
                txHash ? <StyledViewOnEtherscan>
                    <a href={etherscanlink} style={{textDecoration: 'none', color: 'inherit'}} target="_blank"
                       rel="noopener noreferrer">
                        <img src={etherscan} style={{margin: '-3.5px 10px', width: '1.15em'}} alt=""/>
                        <span>
                  View On Explorer
                </span>
                    </a>
                </StyledViewOnEtherscan> : null
            }
            <ModalActions>
                <Button onClick={onDismiss}>{buttonBlurb}</Button>
            </ModalActions>
        </Modal>
    )
}

export default ModalSuccess

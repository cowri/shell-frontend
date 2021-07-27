import React from 'react'
import styled from 'styled-components'
import DoneIcon from '@material-ui/icons/Done'

import etherscan from '../../../assets/etherscan-logo-circle.svg'
import xdai from '../../../assets/etherscan-logo-circle-xdai.svg'
import Button from '../../Button'
import Modal from '../index.js'
import ModalActions from '../ModalActions'
import ModalIcon from '../ModalIcon'
import ModalTitle from '../ModalTitle'
import {IS_BSC, IS_ETH, IS_XDAI} from '../../../constants/chainId.js';

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

  const etherscanlink = IS_ETH
    ? `https://etherscan.io/tx/${txHash}`
    : IS_BSC
    ? `https://bscscan.com/tx/${txHash}`
    : `https://blockscout.com/xdai/mainnet/tx/${txHash}`;

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
                        <img src={IS_XDAI ? xdai : etherscan} style={{margin: '-3.5px 10px', width: '1.15em'}} alt=""/>
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

import React, { useState } from 'react'
import { withTheme } from '@material-ui/core/styles'
import styled from 'styled-components'

import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalIcon from '../../../components/ModalIcon'

const ModalContent = withTheme(styled.div`
  flex: 1;
  color: red;
  padding: 0px 40px 20px;
  margin-top: -10px;
  font-size: 20px;
`)

const ModalTitle = withTheme(styled.div`
  font-size: 1.75rem;
  margin-bottom: 6px;
  margin-top: 24px;
  color: red;
  padding: 0 24px;
`)

const ModalWarning = ({
  tag,
  onCancel,
  onContinue
}) => {
  
  let message 
  

  if (tag == 'STABLEx') {

    message = ( <ModalContent> 
        <p> 
          STABLEx is an experimental project. Exercise extreme caution. 
        </p>
        <p>
          <a target="_blank" href="https://www.notion.so/shellprotocol/STABLEx-Shell-Pool-26129611af064c239da396f4120e8e9c">
          See here for details.
          </a>
        </p>
        <p> Furthermore, Shell Protocol is in beta. </p>
        <p> Please do not deposit any funds you can not afford to lose. </p>
      </ModalContent> )

  } else {
    
    message = ( <ModalContent>
        <p> Shell Protocol is in beta. </p>
        <p> Please do not deposit any funds you can not afford to lose. </p>
      </ModalContent> )

  }

  return (
    <Modal width="400px" >
      <ModalTitle> Caution </ModalTitle>
      { message }
      <ModalActions>
        <Button outlined onClick={onCancel}> Cancel </Button>
        <Button onClick={onContinue}> Continue </Button>
      </ModalActions>
    </Modal>
  )

}

export default ModalWarning

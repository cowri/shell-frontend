import React from 'react'
import styled, { keyframes } from 'styled-components'

import Surface from '../Surface'

const modalKeyframes = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`
const contentKeyframes = keyframes`
  from {
    opacity: 0;
    transform: translateY(64px);
  }
  to {
    opacity: 1;
    transform: translateY(0px);
  }
`

const StyledModal = styled.div`
  align-items: center;
  backdrop-filter: blur(100px);
  display: flex;
  justify-content: center;
  text-align: center;
  position: fixed;
  top: 0; right: 0; bottom: 0; left: 0;
  z-index: 100;
`

const StyledModalBg = styled.div`
  background-color: rgba(0,0,0,0.5);
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
`

const StyledModalContent = styled.div`
  animation: ${contentKeyframes} .2s ease-out;
  max-width: 420px;
  position: relative;
  width: calc(100% - 24px);
`

const Modal = ({ children, onDismiss }) => (
  <StyledModal>
    <StyledModalBg onClick={onDismiss} />
    <StyledModalContent>
      <Surface>
        {children}
      </Surface>
    </StyledModalContent>
  </StyledModal>
)

export default Modal
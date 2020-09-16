import React from 'react'
import styled, { keyframes } from 'styled-components'

import Surface from '../Surface'

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
  top: 0; right: 0; left: 0; bottom: 0;
`

const StyledModalContent = styled.div`
  animation: ${contentKeyframes} .2s ease-out;
  display: flex;
  flex-direction: column;
  max-height: calc(100% - 12px);
  max-width: 450px;
  position: sticky;
  width: calc(100% - 12px);
  margin: 6px;
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
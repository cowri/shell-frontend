import React from 'react'
import styled, { keyframes } from 'styled-components'

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
  position: fixed;
  left: 0;
  top: 0;
  padding: 2rem 0;
  z-index: 10;
  height: 100%;
  overflow: auto;
  width: 100vw;
  text-align: center;
  @media (max-width: 512px) {
    padding: 1rem 0;
  }
  &:before {
    content: '';
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }
`

const StyledModalBg = styled.div`
  background-color: rgba(0,0,0,0.5);
  position: fixed;
  top: 0; right: 0; left: 0; bottom: 0;
`

const StyledModalContent = styled.div`
  position: relative;
  z-index: 10;
  animation: ${contentKeyframes} .2s ease-out;
  display: inline-block;
  flex-direction: column;
  max-width: 650px;
  width: 100%;
  padding: 60px 40px 70px;
  background: #fff2fe;
  border-radius: 12px;
  vertical-align: middle;
  @media (max-width: 512px) {
    padding: 20px;
  }
`

const Modal = ({ children, onDismiss }) => (
  <StyledModal>
    <StyledModalBg onClick={onDismiss} />
    <StyledModalContent>
        {children}
    </StyledModalContent>
  </StyledModal>
)

export default Modal

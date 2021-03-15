import React from 'react'
import styled from 'styled-components'

import Container from '../Container'
import Logo from '../Logo'

const StyledHeader = styled.div`
  align-items: center;
  color: #FFF;
  display: flex;
  height: 130px;
  justify-content: space-between;
`

const StyledHeaderLink = styled.a`
  color: #ac0cee;
  text-decoration: none;
  font-size: 20px;
  margin-right: 10px;
  &:hover {
    text-decoration: underline;
  }
`

const Header = () => (
  <Container>
    <StyledHeader>
      <Logo />
      <div>
        <StyledHeaderLink href="https://docs.component.finance/" target="_blank">Docs</StyledHeaderLink>
      </div>
    </StyledHeader>
  </Container>
)

export default Header

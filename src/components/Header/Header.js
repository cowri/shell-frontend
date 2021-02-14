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

const Header = () => (
  <Container>
    <StyledHeader>
      <Logo />
    </StyledHeader>
  </Container>
)

export default Header

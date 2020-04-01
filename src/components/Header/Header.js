import React from 'react'
import styled from 'styled-components'

import theme from '../../theme'

import Container from '../Container'
import Logo from '../Logo'

const StyledHeader = styled.div`
  position: relative;
  color: ${props => props.darkContent ? theme.palette.grey[1000] : "#FFF"};
  z-index: 2;
`
const StyledHeaderInner = styled.div`
  align-items: center;
  display: flex;
  height: 96px;
  justify-content: space-between;
`

const StyledLink = styled.a`
  color: inherit;
  margin: 0 12px;
  opacity: 0.8;
  text-decoration: none;
`

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
`

const Header = ({ darkContent = false }) => (
  <StyledHeader darkContent={darkContent}>
    <Container full>
      <StyledHeaderInner>
        <Logo color={darkContent ? "#000" : "#FFF" }/>
        <StyledNav>
          <StyledLink href="#">App</StyledLink>
          <StyledLink href="#">Developers</StyledLink>
        </StyledNav>
      </StyledHeaderInner>
    </Container>
  </StyledHeader>
)

export default Header
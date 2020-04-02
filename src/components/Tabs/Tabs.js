import React from 'react'
import styled from 'styled-components'

const StyledTabs = styled.div`
  align-items: center;
  display: flex;
`

const Tabs = ({ children }) => (
  <StyledTabs>
    {children}
  </StyledTabs>
)

export default Tabs
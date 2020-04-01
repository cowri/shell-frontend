import React from 'react'
import styled from 'styled-components'

const StyledTable = styled.div`
  display: flex;
  flex-direction: column;
`

const Table = ({ children }) => (
  <StyledTable>
    {children}
  </StyledTable>
)

export default Table
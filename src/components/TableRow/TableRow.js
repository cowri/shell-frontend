import React from 'react'
import styled from 'styled-components'

const StyledTableRow = styled.div`
  display: flex;
`

const TableRow = ({ children }) => (
  <StyledTableRow>
    {children}
  </StyledTableRow>
)

export default TableRow
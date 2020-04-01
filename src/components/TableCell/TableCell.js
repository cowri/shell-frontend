import React from 'react'
import styled from 'styled-components'

const StyledTableCell = styled.div`
  display: flex;
  flex: ${props => props.flex};
`

const TableCell = ({ children, flex = 1 }) => (
  <StyledTableCell flex={flex}>
    {children}
  </StyledTableCell>
)

export default TableCell
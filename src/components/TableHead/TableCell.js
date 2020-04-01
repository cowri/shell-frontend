import React from 'react'
import styled from 'styled-components'

const StyledTableHead = styled.div`
`

const TableHead = ({ children }) => (
  <StyledTableHead>
    {children}
  </StyledTableHead>
)

export default TableHead
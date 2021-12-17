import styled from 'styled-components';

export const FarmParams = styled.table`
  margin: 0 auto;
  font-size: 20px;
  td {
    &:first-child {
      padding-right: 30px;
      @media screen and (min-width: 512px) {
        padding-right: 80px;
      }
    }
    span {
      font-weight: bold;
    }
  }
  tr:not(:last-child) {
    td {
      padding-bottom: 20px;
    }
  }
`

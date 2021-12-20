import styled from 'styled-components';

export const FarmParams = styled.table`
  margin: 0 auto;
  font-size: 20px;
  td {
    &:first-child {
      @media screen and (min-width: 512px) {
        padding-right: 10px;
        padding-left: 30px;
      }
    }
    &:last-child {
      padding-left: 90px;
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

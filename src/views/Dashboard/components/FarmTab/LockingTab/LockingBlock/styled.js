import styled from 'styled-components';
import {StyledButton} from '../../../../../../components/Button/Button.js';

export const LockingPeriodSelector = styled.div`
  display: flex;
  margin-top: 20px;
  font-size: 12px;
  flex-wrap: wrap;
  ${StyledButton} {
    padding: 20px 15px;
    border-radius: 6px;
    margin-bottom: 10px;
    :not(:last-child) {
      margin-right: 6px;
    }
  }
`

export const LockingUserParam = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
  margin-top: 20px;
  b {
    margin-right: 20px;
  }
`

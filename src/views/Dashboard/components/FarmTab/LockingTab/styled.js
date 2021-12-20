import styled from 'styled-components';
import {StyledButton} from '../../../../../components/Button/Button.js';

export const LockingTabs = styled.div`
  display: flex;
  text-align: center;
  font-size: 20px;
  margin-top: 40px;
  margin-bottom: 60px;
  background: #fcefff;
  border-radius: 16px;
  align-items: center;
  padding: 10px;
  ${StyledButton} {
    margin: 0 auto;
    &.current {
      background: transparent;
    }
  }
  span {
    flex-grow: 1;
    padding-bottom: .5rem;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    &.current {
      border-bottom-color: black;
    }
  }
`

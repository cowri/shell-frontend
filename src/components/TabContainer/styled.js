import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles'
import {StyledButton} from '../Button/Button.js';

export const TabContainer = styled.div`
  padding: 60px 40px 70px;
  @media (max-width: 512px) {
    padding: 40px 10px;
  }
`;

export const TabHeading = styled.p`
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
  text-align: center;
  margin-top: 0;
  span {
    font-size: .7em;
  }
`;

export const TabActions = withTheme(styled.div`
  width: 100%;
  align-items: center;
  display: flex;
  margin-top: 40px;
  justify-content: center;
  @media (max-width: 512px) {
    flex-direction: column;
  }
  ${StyledButton} {
    margin: 0;
  }
  ${StyledButton}:not(:last-child) {
    margin-right: 1.5rem;
    @media (max-width: 512px) {
      margin: 0 0 2rem;
    }
  }
`)

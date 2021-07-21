import styled from 'styled-components';

export const StakeItemContainer = styled.div`
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  font-weight: ${(p) => p.th ? 'bold' : 'normal'};
  font-size: ${(p) => p.th ? '20px' : '22px'};
  padding: 12px 0;
  @media (max-width: 512px) {
    font-size: ${p => p.head ? '16px' : 'inherit'};
  }
`

export const StakeItemTd = styled.div`
  flex: 1 1 0;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  span {
    font-size: 0.7em;
  }
  &:last-child {
    flex-grow: 0.3;
    align-items: flex-end;
  }
`

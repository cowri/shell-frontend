import React from 'react';
import {DistributionTabTitle, StyledDistributionTab} from './styled.js';
import DistributionTable from './DistributionTable.js';

export default function DistributionTab() {
  return (
    <StyledDistributionTab>
      <DistributionTabTitle>Component LP rewards distribution</DistributionTabTitle>
      <DistributionTable />
    </StyledDistributionTab>
  )
}

import BN from '../utils/BN.js';

export const MAX_UINT = BN(2)
  .pow(256)
  .minus(1)
  .toString()

import BigNumber from 'bignumber.js';

export default class NumericFormats {
    
    getNumeraireFromDisplay (display) { 

      return new BigNumber(display === '' ? 0 : display);

    }

    getNumeraireFromRaw (raw) {

      return raw.dividedBy(10 ** this.decimals)

    }

    getRawFromNumeraire (numeraire) {

      return numeraire.multipliedBy(10 ** this.decimals).toFixed()

    }

    getRawFromDisplay (display) {

      return new BigNumber(display).multipliedBy(10 ** this.decimals).toFixed()

    }

    getDisplayFromRaw (raw, decimals) {

      return new BigNumber(raw).dividedBy(10 ** this.decimals).toFixed(decimals)

    }

    getDisplayFromNumeraire (numeraire, decimals) {

      return numeraire.toFixed(decimals)

    }
}

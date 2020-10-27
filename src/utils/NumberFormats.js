import BigNumber from 'bignumber.js';

export default class NumericFormats {
    
    getNumeraireFromDisplay (display) { 

      return new BigNumber(display === '' ? 0 : display);

    }

    getAllFormatsFromDisplay (display) {

      return {
        display: display,
        numeraire: this.getNumeraireFromDisplay(display),
        raw: this.getRawFromDisplay(display)
      }
      
    }

    getNumeraireFromRaw (raw) {

      const numeraire = new BigNumber(raw).dividedBy(10 ** this.decimals)

      return numeraire

    }
    
    getAllFormatsFromNumeraire (numeraire) {

      return {
        display: this.getDisplayFromNumeraire(numeraire),
        numeraire: numeraire,
        raw: this.getRawFromNumeraire(numeraire)
      }

    }

    getAllFormatsFromRaw (raw) {

      raw = new BigNumber(raw)

      return {
        raw: raw,
        display: this.getDisplayFromRaw(raw),
        numeraire: this.getNumeraireFromRaw(raw)
      }

    }

    getRawFromNumeraire (numeraire) {

      return numeraire.multipliedBy(10 ** this.decimals)

    }

    getRawFromDisplay (display) {

      return new BigNumber(display).multipliedBy(10 ** this.decimals)

    }

    getDisplayFromRaw (raw) {

      return Number(
        new BigNumber(raw).dividedBy(10 ** this.decimals).toFixed(this.displayDecimals)
      ).toLocaleString()
      
    }

    getDisplayFromNumeraire (numeraire, decimals) {

      return Number(numeraire.toFixed(this.displayDecimals)).toLocaleString()

    }
}

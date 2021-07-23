import BN from './BN.js';

export default class NumericFormats {

    getNumeraireFromDisplay (display) {

      display = display.replace(',','')

      return BN(display === '' ? 0 : display);

    }

    getAllFormatsFromDisplay (display) {

      display = display.replace(',','')

      return {
        display: display,
        numeraire: this.getNumeraireFromDisplay(display),
        raw: this.getRawFromDisplay(display)
      }

    }

    getNumeraireFromRaw (raw) {

      const numeraire = BN(raw).dividedBy(10 ** this.decimals)

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

      raw = BN(raw)

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

      display = display.replace(',','')

      return BN(display).multipliedBy(10 ** this.decimals)

    }

    getDisplayFromRaw (raw, decimals) {

      decimals = decimals ? decimals : this.displayDecimals

      return Number(
        BN(raw).dividedBy(10 ** this.decimals).toFixed(decimals)
      ).toLocaleString('en-US', { minimumFractionDigits: decimals })

    }

    getDisplayFromNumeraire (numeraire, decimals) {

      decimals = decimals ? decimals : this.displayDecimals

      return Number(numeraire.toFixed(decimals))
        .toLocaleString('en-US', { minimumFractionDigits: decimals })

    }
}

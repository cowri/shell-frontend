import React from 'react';
import {withStore} from '@spyna/react-store'
import {withStyles} from '@material-ui/styles';
import theme from '../theme/theme'
import { WadDecimal, getData, toDai } from '../utils/web3Utils'
import { transfer } from '../actions/main'

import cdaiSvg from '../assets/cdai.svg'
import cusdcSvg from '../assets/cusdc.svg'
import ausdtPng from '../assets/aUSDT.png'
import asusdPng from '../assets/aSUSD.png' 

import NumeraireDaiBalance from './NumeraireDaiBalance'
import NumeraireUsdcBalance from './NumeraireUsdcBalance'
import NumeraireUsdtBalance from './NumeraireUsdtBalance'
import NumeraireSusdBalance from './NumeraireSusdBalance'

import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';

const styles = () => ({
   icon: { width: '50px', height: '50px' },
   input: {
        width: '100%',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(3)
    },
    actionButton: {
        marginTop: theme.spacing(2),
        margin: '0px auto'
    },
    actionButtonContainer: {
        width: '100%',
        textAlign: 'center'
    },
    accountBalance: {
        float: 'right',
    },
})

class StatsContainer extends React.Component {
    async componentDidMount() {
        // update data periodically
        this.watchData()

    }

    async watchData() {
        await getData.bind(this)();
        setInterval(() => {
            getData.bind(this)();
        }, 10 * 1000);
    }

    transfer() {
        transfer.bind(this)()
    }

    handleInput(event) {
      const {store} = this.props
      try {
        store.set('transferAmount', new WadDecimal(event.target.value))
      } catch {
        if (event.target.value.length === 0) {
          store.set('transferAmount', new WadDecimal(0))
        } else {
          return
        }
      }
    }

    render() {
        const {classes, store} = this.props
        const totalReserves = store.get('totalReserves')

        return (
            <Grid container>
                <Grid container alignItems='center' direction='column'>
                    <Grid  item>
                        total liquidity: {totalReserves}
                    </Grid>
                </Grid>
                <NumeraireDaiBalance/>
                <NumeraireUsdcBalance/>
                <NumeraireUsdtBalance/>
                <NumeraireSusdBalance/>
            </Grid>
        )
    }
}

export default withStyles(styles)(withStore(StatsContainer))

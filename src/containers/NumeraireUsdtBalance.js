import React from 'react';

import {withStore} from '@spyna/react-store'
import {withStyles} from '@material-ui/styles';
import theme from '../theme/theme'
import { getData } from '../utils/web3Utils'
import ausdtPng from '../assets/aUSDT.png'

import Grid from '@material-ui/core/Grid';

const styles = () => ({
    container: {
        alignItems: 'center',
        color: 'white',
        minHeight: 52,
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    icon: { width: '50px', height: '50px' }
})

class NumeraireUsdtBalance extends React.Component {

    async componentDidMount() {
        this.watchBalance()
    }

    async watchBalance() {
        await getData.bind(this)();
        setInterval(() => {
            getData.bind(this)();
        }, 10 * 1000);
    }

    render() {
        const { classes, store} = this.props
        const usdtBalance = store.get('usdtReserve')
        return (
            <Grid container direction='row' className={classes.container}>
                <Grid item xs='3' sm='3'>
                    <img className={classes.icon} src={ausdtPng} />
                </Grid>
                <Grid item xs='7' sm='7'>
                    <span> Aave USD Tether </span>
                </Grid>
                <Grid item xs='2' sm='2'>
                    <span> { usdtBalance } </span>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(withStore(NumeraireUsdtBalance))

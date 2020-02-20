import React from 'react';

import {withStore} from '@spyna/react-store'
import {withStyles} from '@material-ui/styles';
import theme from '../theme/theme'
import { getData } from '../utils/web3Utils'
import asusdPng from '../assets/aSUSD.png'

import Grid from '@material-ui/core/Grid';

const styles = () => ({
    // container: {
    //     paddingTop: theme.spacing(1),
    //     paddingBottom: theme.spacing(3),
    //     minHeight: 52
    // },
    container: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        minHeight: 52,
        color: 'white' 
    },
    icon: { width: '50px', height: '50px' }
})

class NumeraireSUsdBalance extends React.Component {

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
        const { classes, store } = this.props
        const susdBalance = store.get('susdReserve')
        return (
            <Grid container direction='row' className={classes.container} >
                <Grid item xs='3' sm='3'>
                    <img className={classes.icon} src={asusdPng} />
                </Grid>
                <Grid item xs='7' sm='7'>
                    <span> Aave Synthetix USD </span>
                </Grid>
                <Grid item xs='2' sm='2'>
                    <span> { susdBalance } </span>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(withStore(NumeraireSUsdBalance))

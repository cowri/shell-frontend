import React from 'react';

import {withStore} from '@spyna/react-store'
import {withStyles} from '@material-ui/styles';
import theme from '../theme/theme'
import { getData } from '../utils/web3Utils'

import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';

import logo from '../assets/logo.jpg'

const styles = () => ({
    container: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(3),
        minHeight: 52
    },
})

class NumeraireUsdcBalance extends React.Component {

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
        const {store} = this.props
        const usdcBalance = store.get('usdcReserve')
        return (
            <CardContent>
                <h2> USDC Liquidity { usdcBalance } </h2>
                <CardMedia
                    component="img"
                    style={{resizeMode: 'contain', width: 100, float: 'right', paddingRight: 52 }}
                    src={logo}
                />
                <p> USDC liquidity { usdcBalance } </p>
            </CardContent>
        )
    }
}

export default withStyles(styles)(withStore(NumeraireUsdcBalance))

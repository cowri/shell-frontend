import React from 'react';

import {withStore} from '@spyna/react-store'
import {withStyles} from '@material-ui/styles';
import theme from '../theme/theme'
import { getData } from '../utils/web3Utils'

import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';

import { toDai } from '../utils/web3Utils';

import logo from '../assets/logo.jpg'

const styles = () => ({
    container: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(3),
        minHeight: 52
    },
})

class NumeraireUsdtBalance extends React.Component {

    async componentDidMount() {
        this.watchBalance()
    }

    async watchBalance() {
        // await getData.bind(this)();
        // setInterval(() => {
        //     getData.bind(this)();
        // }, 10 * 1000);
    }

    render() {
        const {store} = this.props
        const cdaiBalanceRaw = store.get('cdaiBalanceRaw')
        return (
            <CardContent>
                <h2>You have {'0'} Dai brewing </h2>
                <CardMedia
                    component="img"
                    style={{resizeMode: 'contain', width: 100, float: 'right', paddingRight: 52 }}
                    src={logo}
                />
                <p> USDT balance: { 5 }` : '-'} </p>
                <p> 1 CHAI = { 5 }` : '?'} DAI </p>
                <p> USDT Savings Rate: { 5 } </p>
                <a target="_blank" href="/about.html" rel="noopener noreferrer"> Learn more </a>
            </CardContent>
        )
    }
}

export default withStyles(styles)(withStore(NumeraireUsdtBalance))

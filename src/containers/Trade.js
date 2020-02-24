import React from 'react';
import {withStore} from '@spyna/react-store'
import {withStyles} from '@material-ui/styles';
import theme from '../theme/theme'
import { getData } from '../utils/web3Utils'
import { swap, primeOriginTrade } from '../actions/main'

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';

import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';

import usdcIcon from '../assets/usdc.svg'
import daiIcon from '../assets/dai.svg'
import asusdIcon from '../assets/aSUSD.svg'
import susdIcon from '../assets/susd.svg'
import usdtIcon from '../assets/usdt.svg'


const styles = () => ({
   input: {
        width: '75%',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(3)
    },
    control: {
        width: '100%'
    },
    select: {
        width: '25%'  
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
    iconInBox: { 
        height: '35px',
        width: '35px', 
    },
})

class TradeContainer extends React.Component {

    constructor () {
        super()
        this.coins = [
            "USDt",
            "USDc",
            "Dai",
            "CDai",
            "Chai",
            "cUSDc"
        ]

        this.handleOriginInput = this.handleOriginInput.bind(this)
        this.handleTargetInput = this.handleTargetInput.bind(this)
        this.handleOrigindSelect = this.handleOriginSelect.bind(this)
        this.handleTargetSelect = this.handleTargetSelect.bind(this)

    }

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

    swap() {
        swap.bind(this)()
    }

    handleOriginSelect (e) { 
        const { store } = this.props
        store.set('originSlot', e.target.value)
        console.log('hello', e.target.value)
        console.log('store.get', store.get('originSlot'))
    }

    handleTargetSelect (e) { 
        const { store } = this.props
        store.set('targetSlot', e.target.value)
    }

    handleOriginInput(e) {
        const { store } = this.props
        primeOriginTrade.call(this, e.target.value)
    }

    handleTargetInput (event) {

    }

    setSlot (type, event) {
        const { store } = this.props
        store.set(type, event.target.value)
    }

    slotTarget () {

    }

    setMax() {
      const {store} = this.props
      const chaiBalanceDecimal = store.get('chaiBalanceDecimal')
    }


    render() {
        const {classes, store} = this.props
        const walletAddress = store.get('walletAddress')
        const isSignedIn = walletAddress && walletAddress.length
        const coins = store.get('contractObjects')

        const originSlot = store.get('originSlot')
        const targetSlot = store.get('targetSlot')
        const originAmount = store.get('originAmount')
        const targetAmount = store.get('targetAmount')

        return (
            <Grid>
                <Grid container alignItems="start" spacing={3}>
                    <Grid item xs='9' sm='9' md='9'>
                        <TextField label={coins[originSlot].name}
                            placeholder='0'
                            className={classes.input}
                            margin="normal"
                            variant="outlined"
                            type="number"
                            onChange={ (e) => this.handleOriginInput(e) }
                            value={originAmount}
                            InputProps={{
                                inputProps: { min: 0 }, 
                                startAdornment: <InputAdornment position="start"> <img className={classes.iconInBox} src={coins[originSlot].icon}/> </InputAdornment> 
                            }}
                        />
                    </Grid>
                    <Grid item xs='3' sm='3' md='3' lg='3'  >
                        <TextField 
                            select
                            onChange={ (e) => this.handleOriginSelect(e) }
                            selectProps={{ native: true }}
                            value={originSlot}
                        >
                            { coins.map((coin, ix) => (
                                <MenuItem key={ix} value={ix}>
                                    { coin.symbol }
                                </MenuItem>
                            )) }
                        </TextField>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs='9' sm='9' md='9' lg='9'>

                    </Grid>
                    <Grid item xs='9' sm='9' md='9'>
                        <TextField 
                            select
                            onChange={ (e) => this.handleTargetSelect(e) }
                            selectProps={{ native: true }}
                            value={targetSlot}
                        >
                            { coins.map((coin, ix) => (
                                <MenuItem key={ix} value={ix}>
                                    { coin.symbol }
                                </MenuItem>
                            )) }
                        </TextField>

                    </Grid>
                </Grid>
                <Grid container>
                    <Box className={classes.actionButtonContainer}>
                        <Button color='primary'
                            size='large'
                            onClick={() => { this.swap() }} 
                            variant="contained" 
                            disabled={!isSignedIn} 
                            className={classes.actionButton}
                        >
                            Transfer
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(withStore(TradeContainer))

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

    handleOriginInput(event) {
        const { store } = this.props
        const originSlot = store.get('originSlot')
        const origin = store.get('contractObjects')[originSlot]
        const value = origin.getDecimal(event.target.value).mul(10**origin.decimals).toFixed()
        console.log("value", value)
        primeOriginTrade.bind(this)(value)

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
        const chaiBalance = store.get('chaiBalance')
        const chaiBalanceDecimal = store.get('chaiBalanceDecimal')
        const web3 = store.get('web3');
        const isSignedIn = walletAddress && walletAddress.length
        const coins = store.get('contractObjects').map(contract => contract.name)

        const originSlot = store.get('originSlot')
        const targetSlot = store.get('targetSlot')
        const originAmount = store.get('originAmount')
        const targetAmount = store.get('targetAmount')

        return (
            <Grid container spacing={3}>
               <Grid item xs={12}>
                   <Card>
                       <CardContent>
                            <Typography variant='h4'>Trade Stablecoins and Stablecoin Derivatives</Typography>
                            <Grid container alignItems="start" spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <FormControl className={classes.control}>
                                        <Select
                                            labelId="demo-customized-select-label"
                                            id="demo-customized-select"
                                            value={this.originSlot}
                                            input={<InputBase value={0} />}
                                            className={classes.select}
                                            onChange={this.setSlot.bind(this, "originSlot")}
                                        > 
                                            { coins.map((coin, ix) => { return (<MenuItem value={ix}> {coin} </MenuItem>) }) }
                                        </Select>
                                        <TextField label="Origin Value"
                                            placeholder='0'
                                            className={classes.input}
                                            margin="normal"
                                            value={ originAmount }
                                            variant="outlined"
                                            type="number"
                                            onChange={this.handleOriginInput.bind(this)}
                                            InputProps={{inputProps: { min: 0 }, endAdornment: <InputAdornment className={classes.endAdornment} position="end">{ }</InputAdornment> }}
                                            helperText={(isSignedIn) ? "Worth: ~" + 5 + " Dai": " "}
                                        />
                                    </FormControl>
                                    <FormControl className={classes.control}>
                                        <Select
                                            labelId="demo-customized-select-label"
                                            id="demo-customized-select"
                                            value={this.originSlot}
                                            input={<InputBase value={0} />}
                                            className={classes.select}
                                            onChange={this.setSlot.bind(this, "Slot")}
                                        > 
                                        { coins.map((coin, ix) => { return (<MenuItem value={ix}> {coin} </MenuItem>) }) }
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
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
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(withStore(TradeContainer))

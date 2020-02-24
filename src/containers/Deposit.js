import React from 'react';
import {withStore} from '@spyna/react-store'
import {withStyles} from '@material-ui/styles';
import theme from '../theme/theme'
import { SixDecimal, EightDecimal, WadDecimal, getData, toDai } from '../utils/web3Utils'
import { selectiveDeposit } from '../actions/main'

import daiIcon from '../assets/dai.svg'
import usdcIcon from '../assets/usdc.svg'
import usdtIcon from '../assets/usdt.svg'
import susdIcon from '../assets/susd.svg'

import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import InputAdornment from '@material-ui/core/InputAdornment'


const styles = () => ({
   input: {
        width: '100%',
        color: 'white',
        background: 'rgba(0,0,0,.05)',
        borderRadius: '5px',
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
    icon: { 
        height: '35px',
        marginLeft: '15px',
        width: '35px', 
    },
    tokenName: { 
        // marginLeft: '15px' 
    },
    nameIcon: { 
        alignItems: 'center',
        color: 'white',
        minHeight: 52,
    },
    endAdornment: {
        color: 'white'
    }
})

class DepositContainer extends React.Component {
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

    deposit () {
        selectiveDeposit.bind(this)()
    }

    handleDaiInput(event) {
      const {store} = this.props
      try { store.set('daiDepositAmount', new WadDecimal(event.target.value)) }
      catch {
        if (event.target.value.length === 0) store.set('daiDepositAmount', new WadDecimal(0))
      }
    }

    handleUsdcInput(event) {
      const {store} = this.props
      try { store.set('usdcDepositAmount', new SixDecimal(event.target.value)) }
      catch {
        if (event.target.value.length === 0) store.set('usdcDepositAmount', new SixDecimal(0))
      }
    }

    handleUsdtInput(event) {
      const {store} = this.props
      try { 
          store.set('usdtDepositAmount', new SixDecimal(event.target.value)) 
          console.log(store.get('usdtDepositAmount'))
      }
      catch {
        if (event.target.value.length === 0) store.set('usdtDepositAmount', new SixDecimal(0))
      }
    }

    handleSusdInput (event) {
        const { store } = this.props
        try { store.set('susdDepositAmount', new SixDecimal(event.target.value)) }
        catch {
            if (event.target.value.length == 0) store.set('susdDepositAmount', new SixDecimal(0))
        }
    }

    setMax() {
      const {store} = this.props
      const chaiBalanceDecimal = store.get('chaiBalanceDecimal')
      store.set('transferAmount', chaiBalanceDecimal)
    }

    render() {
        const {classes, store} = this.props
        const walletAddress = store.get('walletAddress')
        const web3 = store.get('web3');
        const isSignedIn = walletAddress && walletAddress.length

        const daiDepositAmount = store.get('daiDepositAmount')
        const usdcDepositAmount = store.get('usdcDepositAmount')
        const usdtDepositAmount = store.get('usdtDepositAmount')
        const susdDepositAmount = store.get('susdDepositAmount')

        return (
            <Grid>
                <Grid container className={classes.input} > 
                    <TextField label="MultiCollateral Dai"
                        placeholder='0'
                        className={classes.input}
                        margin="normal"
                        value={daiDepositAmount.toString() !== "0" ? daiDepositAmount : ''}
                        variant="outlined"
                        type="number"
                        onChange={this.handleDaiInput.bind(this)}
                        InputProps={{ 
                            inputProps: { min: 0 }, 
                            endAdornment: <InputAdornment position="end"> DAI </InputAdornment>,
                            startAdornment: <InputAdornment position="start"> <img className={classes.iconInBox} src={daiIcon}/> </InputAdornment> 
                        }}
                    />
                </Grid>
                <Grid container className={classes.input} >
                    <TextField label="USD Coin"
                        placeholder='0'
                        className={classes.input}
                        margin="normal"
                        value={usdcDepositAmount.toString() !== "0" ? usdcDepositAmount : ''}
                        variant="outlined"
                        type="number"
                        onChange={this.handleUsdcInput.bind(this)}
                        InputProps={{
                            inputProps: { min: 0 }, 
                            endAdornment: <InputAdornment position="end">USDC</InputAdornment>,
                            startAdornment: <InputAdornment position="start"> <img className={classes.iconInBox} src={usdcIcon}/> </InputAdornment> 
                        }}
                    />
                </Grid>
                <Grid container className={classes.input} >
                    <TextField label="Tether Stablecoin"
                        placeholder='0'
                        className={classes.input}
                        margin="normal"
                        value={usdtDepositAmount.toString() !== "0" ? usdtDepositAmount : ''}
                        variant="outlined"
                        type="number"
                        onChange={this.handleUsdtInput.bind(this)}
                        InputProps={{
                            inputProps: { min: 0 }, 
                            endAdornment: <InputAdornment className={classes.endAdornment} position="end">USDT</InputAdornment>,
                            startAdornment: <InputAdornment position="start"> <img className={classes.iconInBox} src={usdtIcon}/> </InputAdornment> 
                        }}
                    />
                </Grid>
                <Grid container className={classes.input}>
                    <TextField label="Synthetix USD"
                        placeholder='0'
                        className={classes.input}
                        margin="normal"
                        value={susdDepositAmount.toString() !== "0" ? susdDepositAmount : ''}
                        variant="outlined"
                        type="number"
                        onChange={this.handleSusdInput.bind(this)}
                        InputProps={{
                            inputProps: { min: 0 }, 
                            endAdornment: <InputAdornment className={classes.endAdornment} position="end">SUSD</InputAdornment>,
                            startAdornment: <InputAdornment position="start"> <img className={classes.iconInBox} src={usdtIcon}/> </InputAdornment> 
                        }}
                    />
                </Grid>
                <Box className={classes.actionButtonContainer}>
                    <Button color='primary'
                        size='large'
                        onClick={() => { this.deposit() }} 
                        variant="contained" 
                        disabled={!isSignedIn } 
                        className={classes.actionButton}
                    >
                        Deposit
                    </Button>
                </Box>
            </Grid>
        )
    }
}

export default withStyles(styles)(withStore(DepositContainer))

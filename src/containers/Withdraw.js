import React from 'react';
import {withStore} from '@spyna/react-store'
import {withStyles} from '@material-ui/styles';
import theme from '../theme/theme'
import { proportionalWithdraw } from '../actions/main'

import daiIcon from '../assets/dai.svg'
import usdcIcon from '../assets/usdc.svg'
import usdtIcon from '../assets/usdt.svg'
import susdIcon from '../assets/susd.svg'

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'

// const styles = () => ({
//     input: { width: '100%', marginTop: theme.spacing(1), marginBottom: theme.spacing(3) },
//     actionButton: { marginTop: theme.spacing(2), margin: '0px auto' },
//     actionButtonContainer: { width: '100%', textAlign: 'center' },
//     accountBalance: { float: 'right', },
// })
const styles = () => ({
  input: {
       width: '100%',
       color: 'white',
      //  background: 'rgba(0,0,0,.05)',
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

class WithdrawContainer extends React.Component {

    setMax() {
      const {store} = this.props
      const chaiBalanceDecimal = store.get('chaiBalanceDecimal')
      store.set('transferAmount', chaiBalanceDecimal)
    }

    withdraw () {
      proportionalWithdraw.bind(this)()
    }

    render() {
        const {classes, store} = this.props

        const shellSupply = store.get('loihiTotalSupply')
        const shellBalance = store.get('loihiBalance')

        const loihiDaiBalance = store.get('loihiDaiBalance')
        const loihiUsdcBalance = store.get('loihiUsdcBalance')
        const loihiUsdtBalance = store.get('loihiUsdtBalance')
        const loihiSusdBalance = store.get('loihiSusdBalance')

        console.log("loihiDaiBalance")

        const walletAddress = store.get('walletAddress')

        const web3 = store.get('web3');
        const isSignedIn = walletAddress && walletAddress.length

        return (
          <Grid>
            <Typography variant='h4'>Withdraw Shells</Typography>
            <Typography variant='subtitle2'>Send Chai to any address</Typography>
            <Grid container className={classes.input} > 
              <TextField label="MultiCollateral Dai"
                  placeholder='0'
                  className={classes.input}
                  margin="normal"
                  disabled
                  value={'0'}
                  variant="outlined"
                  type="number"
                  InputProps={{ 
                      inputProps: { min: 0 }, 
                      endAdornment: <InputAdornment position="end"> DAI </InputAdornment>,
                      startAdornment: <InputAdornment position="start"> <img className={classes.iconInBox} src={daiIcon}/> </InputAdornment> 
                  }}
              />
            </Grid>
            <Grid container className={classes.input} >
              <TextField label="USD Coin"
                  disabled
                  placeholder='0'
                  className={classes.input}
                  margin="normal"
                  value={'0'}
                  variant="outlined"
                  type="number"
                  InputProps={{
                      inputProps: { min: 0 }, 
                      endAdornment: <InputAdornment position="end">USDC</InputAdornment>,
                      startAdornment: <InputAdornment position="start"> <img className={classes.iconInBox} src={usdcIcon}/> </InputAdornment> 
                  }}
              />
            </Grid>
            <Grid container className={classes.input} >
              <TextField label="Tether Stablecoin"
                  disabled
                  placeholder='0'
                  className={classes.input}
                  margin="normal"
                  value={'0'}
                  variant="outlined"
                  type="number"
                  InputProps={{
                      inputProps: { min: 0 }, 
                      endAdornment: <InputAdornment className={classes.endAdornment} position="end">USDT</InputAdornment>,
                      startAdornment: <InputAdornment position="start"> <img className={classes.iconInBox} src={usdtIcon}/> </InputAdornment> 
                  }}
              />
            </Grid>
            <Grid container className={classes.input}>
              <TextField label="Synthetix USD"
                  disabled
                  placeholder='0'
                  className={classes.input}
                  margin="normal"
                  value={'0'}
                  variant="outlined"
                  type="number"
                  InputProps={{
                      inputProps: { min: 0 }, 
                      endAdornment: <InputAdornment className={classes.endAdornment} position="end">SUSD</InputAdornment>,
                      startAdornment: <InputAdornment position="start"> <img className={classes.iconInBox} src={susdIcon}/> </InputAdornment> 
                  }}
              />
            </Grid>
            <Box className={classes.actionButtonContainer}>
              <Button color='primary'
                size='large'
                onClick={() => this.withdraw()} 
                variant="contained" disabled={!isSignedIn} className={classes.actionButton}
              >
                Withdraw Everything
              </Button>
            </Box>
          </Grid>
        )
    }
}

export default withStyles(styles)(withStore(WithdrawContainer))
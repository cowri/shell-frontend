import React from 'react'
import { withStore } from '@spyna/react-store'
import { withStyles } from '@material-ui/styles'
import theme from '../theme/theme'
import { initBrowserWallet } from '../utils/web3Utils'

import { setViewState } from '../actions/main'
import config from '../mainnet.config.json'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import logo from '../assets/logo.jpg'

const styles = () => ({
    menu: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        minHeight: 100
    },
    actionButton: {
      color: 'white'
    },
    activatedButton: {
      color: 'white',
      fontWeight: 'bold'
    },
    zone: { textAlign: 'center', marginLeft: '10px', marginRight: '10px' }
})

class Menu extends React.Component {

  setViewState (int) {
    setViewState.bind(this)(int)
  }

  render() {
      const {
          classes,
          store
      } = this.props

      const walletAddress = store.get('walletAddress')
      const isSignedIn = walletAddress && walletAddress.length
      const viewState = store.get('viewState')

      return (
        <Grid container className={classes.menu} alignContent='center' justify='center' alignItems='center'>
            <Grid item sm={3} md={3} className={classes.zone}>
                <Button size='small'
                    onClick={() => { this.setViewState(0) }} 
                    disabled={!isSignedIn} 
                    className={viewState == 0 ? classes.activatedButton : classes.actionButton} >
                        Overview
                </Button>
            </Grid>
            <Grid item sm={3} md={3} className={classes.zone}>
                <Button size='small'
                    onClick={() => { this.setViewState(1) }} 
                    disabled={!isSignedIn} 
                    className={viewState == 1 ? classes.activatedButton : classes.actionButton} >
                        Exchange
                </Button>
            </Grid>
            <Grid item sm={3} md={3} className={classes.zone}>
                <Button size='small'
                    onClick={() => { this.setViewState(2) }} 
                    disabled={!isSignedIn} 
                    className={viewState == 2 ? classes.activatedButton : classes.actionButton} >
                        Deposit
                </Button>
            </Grid>
            <Grid item sm={3} md={3} className={classes.zone}>
                <Button size='small'
                    onClick={() => { this.setViewState(3) }} 
                    disabled={!isSignedIn} 
                    className={viewState == 3 ? classes.activatedButton : classes.actionButton} >
                        Withdraw
                </Button>
            </Grid>
        </Grid>
      )
    }
}

export default withStyles(styles)(withStore(Menu))

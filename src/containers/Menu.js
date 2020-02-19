import React from 'react'
import { withStore } from '@spyna/react-store'
import { withStyles } from '@material-ui/styles'
import theme from '../theme/theme'
import { initBrowserWallet } from '../utils/web3Utils'

import { setViewState } from '../actions/main'
import config from '../config.json'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import logo from '../assets/logo.jpg'

const styles = () => ({
    navContainer: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(9),
        minHeight: 120
    },
    title: {
      fontStyle: 'italic',
      lineHeight: '0.8em',
      display:'block',
      fontSize: '40pt'
    },
    subtitle: {
      marginTop: '0px',
      fontStyle: 'regular',
      fontSize: '12pt'
    },
    logo: {
        height: 150,
        display:'inline-block',
        float:'left',
        marginTop:'-50px',
        marginRight: theme.spacing(1)
    },
    accountItem: {
      float: 'right',
    },
    accountButton: {
      float: 'right',
      '& svg': {
        marginRight: theme.spacing(1)
      }
    }
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

      return (
        <Grid container className={classes.menu} alignItems='center'>
            <Grid item sm={3} md={3} >
                <Button color='primary'
                        size='large'
                        onClick={() => { this.setViewState(0) }} 
                        variant="contained" disabled={!isSignedIn} 
                        className={classes.actionButton} >
                            Stats
                </Button>
            </Grid>
            <Grid item sm={3} md={3}>
                <Button color='primary'
                        size='large'
                        onClick={() => { this.setViewState(1) }} 
                        variant="contained" disabled={!isSignedIn} 
                        className={classes.actionButton} >
                            Trade
                </Button>
            </Grid>
            <Grid item sm={3} md={3}>
                <Button color='primary'
                        size='large'
                        onClick={() => { this.setViewState(2) }} 
                        variant="contained" disabled={!isSignedIn} 
                        className={classes.actionButton} >
                            Deposit
                </Button>
            </Grid>
            <Grid item sm={3} md={3}>
                <Button color='primary'
                        size='large'
                        onClick={() => { this.setViewState(3) }} 
                        variant="contained" disabled={!isSignedIn} 
                        className={classes.actionButton} >
                            Withdraw
                </Button>
            </Grid>
          {/* </Grid> */}
        </Grid>
      )
    }
}

export default withStyles(styles)(withStore(Menu))

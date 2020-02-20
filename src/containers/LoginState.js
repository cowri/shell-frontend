import React from 'react'
import { withStore } from '@spyna/react-store'
import { withStyles } from '@material-ui/styles'
import theme from '../theme/theme'
import { initBrowserWallet } from '../utils/web3Utils'
import config from '../config.json'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import logo from '../assets/cowri-logo.svg'
import background from '../assets/ocean.jpg'

const styles = () => ({
    navContainer: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(9),
        minHeight: 120
    },
    title: {
      color: '#fff',
      display:'inline-block',
      float:'center',
      fontSize: '20pt'
    },
    subtitle: {
      marginTop: '0px',
      fontStyle: 'regular',
      fontSize: '12pt'
    },
    logo: {
        height: 40,
        display:'inline-block',
        float:'center',
        marginTop:'30px',
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

class LoginStateContainer extends React.Component {
  async componentDidMount() {
    initBrowserWallet.call(this)
  }

  connect () {
    initBrowserWallet.call(this, true)
  }

  render() {
      const {
          classes,
          store
      } = this.props

      const walletAddress = store.get('walletAddress')
      const web3Failure = store.get('web3Failure')
      const network = store.get('network')
      return (
        <Grid container alignContent={'center'} >
          <Grid container direction='row-reverse' alignItems='center'>
            <Grid item sm={6} md={6} className={classes.accountItem}>
              <Button color='primary' onClick={() => { this.connect()}} variant={walletAddress ? 'text' : "contained"} className={classes.accountButton}>
                {walletAddress ? (walletAddress.slice(0,7) + '...' + walletAddress.slice(walletAddress.length - 5)) : 'Connect wallet'}
              </Button>
            </Grid>
          </Grid>
          <Dialog open={ network !== config.network}>
            <DialogTitle id="alert-dialog-title">{"Wrong network"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                  <p>Switch to Kovan to interact with this app</p>
              </DialogContentText>
            </DialogContent>
          </Dialog>
            <Dialog
                open={web3Failure}
                onClose={(event) => {store.set('web3Failure', false)}}
            >
            <DialogTitle id="alert-dialog-title">{"Failed to connect to web3"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                  <p>Unable to connect to wallet.</p>
                  <a target="_blank" href="https://metamask.io/" rel="noopener noreferrer">Install metamask</a>
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </Grid>
      )
    }
}

export default withStyles(styles)(withStore(LoginStateContainer))

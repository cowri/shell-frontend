import React from 'react'
import { withStore } from '@spyna/react-store'
import { withStyles } from '@material-ui/styles'
import theme from '../theme/theme'
import config from '../kovan.config.json'

import Grid from '@material-ui/core/Grid'

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

class FooterContainer extends React.Component {

  render() {
      const { classes, store } = this.props

      const walletAddress = store.get('walletAddress')
      const web3Failure = store.get('web3Failure')
      const network = store.get('network')
      return (
        <Grid container alignContent={'center'} >
          <Grid item xs={12} className={classes.footer}>
            Made by Cowri Labs
          </Grid>
          <Grid item xs={12} className={classes.footer}>
              <a target="_blank" href="https://github.com/shellprotocol" rel="noopener noreferrer">Twitter</a> ·
              <a target="_blank" href="https://github.com/cowri" rel="noopener noreferrer">GitHub</a> ·
              <a target="_blank" href="https://discordapp.com/invite/PtEHX" rel="noopener noreferrer">Discord</a> ·
              <a target="_blank" href={"https://etherscan.io/token/" + config.LOIHI} rel="noopener noreferrer">Contract</a><br />
          </Grid>
        </Grid>
      )
    }
}

export default withStyles(styles)(withStore(FooterContainer))

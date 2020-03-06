import React from 'react'
import { withStore } from '@spyna/react-store'
import { withStyles } from '@material-ui/styles'
import theme from '../theme/theme'

import Grid from '@material-ui/core/Grid'

import logo from '../assets/cowri-logo.svg'

const styles = () => ({
    navContainer: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        minHeight: 120
    },
    title: {
      color: '#fff',
      display:'inline-block',
      float:'center',
      fontSize: '20pt'
    },
    logo: {
        height: 40,
        display:'inline-block',
        float:'center',
        marginTop:'30px',
    },
})

class NavContainer extends React.Component {

  render() {
      const { classes, store } = this.props

      const walletAddress = store.get('walletAddress')
      const web3Failure = store.get('web3Failure')
      const network = store.get('network')
      return (
          <Grid container direction='column' justify='center' alignContent='center' className={classes.navContainer} alignItems='center'>
              <img src={logo} className={classes.logo} />
              <span className={classes.title}>Shell</span>
          </Grid>
      )
    }
}

export default withStyles(styles)(withStore(NavContainer))

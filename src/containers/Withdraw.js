import React from 'react';
import {withStore} from '@spyna/react-store'
import {withStyles} from '@material-ui/styles';
import theme from '../theme/theme'
import { WadDecimal, getData, toDai } from '../utils/web3Utils'
import { proportionalWithdraw } from '../actions/main'

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const styles = () => ({
    input: { width: '100%', marginTop: theme.spacing(1), marginBottom: theme.spacing(3) },
    actionButton: { marginTop: theme.spacing(2), margin: '0px auto' },
    actionButtonContainer: { width: '100%', textAlign: 'center' },
    accountBalance: { float: 'right', },
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
        console.log("shellBalance", shellBalance)
        console.log("shellSupply", shellSupply)

        const loihiDaiBalance = store.get('loihiDaiBalance')
        const loihiUsdcBalance = store.get('loihiUsdcBalance')
        const loihiUsdtBalance = store.get('loihiUsdtBalance')
        const loihiSusdBalance = store.get('loihiSusdBalance')


        const walletAddress = store.get('walletAddress')

        const web3 = store.get('web3');
        const isSignedIn = walletAddress && walletAddress.length

        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant='h4'>Withdraw Shells</Typography>
                  <Typography variant='subtitle2'>Send Chai to any address</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6} >
                      <List>
                        <ListItem>
                          <ListItemText primary={ "Dai:" + loihiDaiBalance }  />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary={ "Usdc: " + loihiUsdcBalance } />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary={ "Usdt: " + loihiUsdtBalance } />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary={ "Usdt: " + loihiSusdBalance } />
                        </ListItem>
                      </List>
                    </Grid>
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
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )
    }
}

export default withStyles(styles)(withStore(WithdrawContainer))
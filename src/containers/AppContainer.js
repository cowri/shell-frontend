import React from 'react'
import {withStore} from '@spyna/react-store'

import config from '../config.json'

import NavContainer from './Nav'
import JoinExitContainer from './JoinExit'
import ChaiBalanceContainer from './ChaiBalance'
import TotalSupplyContainer from './TotalSupply'
import TransferChaiContainer from './TransferChai'
import StatsContainer from './Stats'
import TradeContainer from './Trade'
import DepositContainer from './Deposit'
import WithdrawContainer from './Withdraw'
import MenuContainer from "./Menu"

import theme from '../theme/theme'

import Typography from '@material-ui/core/Typography'
import { withStyles, ThemeProvider } from '@material-ui/styles'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'

const styles = () => ({
  root: {
    flexGrow: 1,
  },
  paper: {
  },
  footer: {
    textAlign: 'center',
    color: '#fff',
  },
  a: {
    color: '#fff',
    opacity: 0.9
  },
  navContainer: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(3),
    minHeight: 52
  },
  contentContainer: {
      // boxShadow: '0px 0px 30px 0px rgba(0, 0, 0, 0.05)',
      borderRadius: theme.shape.borderRadius,
      padding: 0,
      marginBottom: theme.spacing(3)
  }
})

class AppContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = { }
        this.views =[ StatsContainer, TradeContainer, DepositContainer, WithdrawContainer ];
    }


    async componentDidMount() { }

    render() {
        const { store, classes } = this.props
        const viewState = store.get('viewState')
        console.log("viewState", viewState)

        function injectView (index) {

            if (viewState == 0) return <StatsContainer/>
            else if (viewState == 1) return <TradeContainer/>
            else if (viewState == 2) return <DepositContainer/>
            else if (viewState == 3) return <WithdrawContainer/>

        }
        return (
            <Container maxWidth="md">
                <Grid container spacing={3}>
                    <Grid item xs={12}><br/></Grid>
                    <NavContainer />
                    <MenuContainer />
                    <Grid item xs={12}>
                        { injectView(viewState) }
                    </Grid>
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
            </Container>
        )
    }
}

export default withStyles(styles)(withStore(AppContainer))

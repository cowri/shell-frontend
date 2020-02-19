import React from 'react'
import {withStore} from '@spyna/react-store'

import config from '../config.json'

import NavContainer from './Nav'
import StatsContainer from './Stats'
import TradeContainer from './Trade'
import DepositContainer from './Deposit'
import WithdrawContainer from './Withdraw'
import MenuContainer from "./Menu"

import theme from '../theme/theme'

import { withStyles } from '@material-ui/styles'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'

const styles = () => ({
  root: { flexGrow: 1, },
  footer: { textAlign: 'center', },
  navContainer: { paddingTop: theme.spacing(1), paddingBottom: theme.spacing(3), minHeight: 52 },
  contentContainer: { borderRadius: theme.shape.borderRadius, padding: 0, marginBottom: theme.spacing(3) }
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
                        Interacting with the Lo'ihi contract at: <a target="_blank" href={"https://etherscan.io/token/" + config.LOIHI} rel="noopener noreferrer">{config.CHAI}</a><br />
                    </Grid>
                    <Grid item xs={12} className={classes.footer}>
                        Lo'ihi by Cowri &nbsp;
                            <a target="_blank" href="https://twitter.com/white_kenny_" rel="noopener noreferrer">Kenny White</a>,&nbsp;
                            <a target="_blank" href="https://twitter.com/nonnewtonianliq" rel="noopener noreferrer">James Foley</a>,&nbsp;
                        &nbsp; UI at <a href="https://github.com/cowri/loihi-frontend">github.com/cowri/loihi-frontend</a>
                    </Grid>
                </Grid>
            </Container>
        )
    }
}

export default withStyles(styles)(withStore(AppContainer))

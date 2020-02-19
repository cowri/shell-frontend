import React from 'react';
import {withStore} from '@spyna/react-store'
import {withStyles} from '@material-ui/styles';
import { getData } from '../utils/web3Utils'
import theme from '../theme/theme'

import NumeraireDaiBalance from './NumeraireDaiBalance'
import NumeraireUsdcBalance from './NumeraireUsdcBalance'
import NumeraireUsdtBalance from './NumeraireUsdtBalance'
import NumeraireSusdBalance from './NumeraireSusdBalance'

import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';

const styles = () => ({
    input: { width: '100%', marginTop: theme.spacing(1), marginBottom: theme.spacing(3) },
    actionButton: { marginTop: theme.spacing(2), margin: '0px auto' },
    actionButtonContainer: { width: '100%', textAlign: 'center' },
    accountBalance: { float: 'right', },
})

class StatsContainer extends React.Component {

    render() {
        const {classes, store} = this.props
        return (
            <Grid container spacing={3}>
               <Grid item xs={12}>
                    <Card>
                        <NumeraireDaiBalance/>
                        <NumeraireUsdcBalance/>
                        <NumeraireUsdtBalance/>
                        <NumeraireSusdBalance/>
                    </Card>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(withStore(StatsContainer))

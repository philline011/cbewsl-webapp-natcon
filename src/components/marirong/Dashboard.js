import React, { Fragment } from 'react';
import { Grid } from '@mui/material'
import MarirongHeader from '../utils/MarirongHeader';

const Dashboard = () => {
    return(
        <Fragment>
            <MarirongHeader />
            <Grid container justifyContent={"center"} alignItems={"center"} textAlign={"center"}>
                <Grid item xs={12}>
                    <h1>Dashboard</h1>
                </Grid>
            </Grid>
        </Fragment>
    )
}


export default Dashboard;
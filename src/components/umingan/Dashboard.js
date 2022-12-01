import React, { Fragment } from 'react';
import { Grid } from '@mui/material'
import LipataHeader from '../utils/LipataHeader';

const Dashboard = () => {
    return(
        <Fragment>
            <LipataHeader />
            <Grid container justifyContent={"center"} alignItems={"center"} textAlign={"center"}>
                <Grid item xs={12}>
                    <h1>Dashboard</h1>
                </Grid>
            </Grid>
        </Fragment>
    )
}


export default Dashboard;
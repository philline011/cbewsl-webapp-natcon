import React, { Fragment, useEffect, useState } from "react";
import { Grid, Typography } from '@mui/material'
import {useParams } from 'react-router-dom';

import RainfallGraph from "../analysis/RainfallGraph";
import SurficialGraph from "../analysis/SurficialGraph";
import SubsurfaceGraph from "../analysis/SubsurfaceGraph";


const Container = (props) => {
    const { ts_end, tsm_sensor}  = props;
   
    const [rainfall_comp, setRainfallComp] = useState("");
    const [surficial_comp, setSurficialComp] = useState("");
    const [subsurface_comp, setSubsurfaceComp] = useState("");

    let {chart_type} = useParams();

    useEffect(() => {

        const input = { site_code : 'LPA', ts_end }; // "2017-06-09 04:30:00"
        let temp;
        
        if (chart_type === "rainfall") {
            temp = <RainfallGraph 
                {...props}
                input={input}
                disableBack 
            />;
            setRainfallComp(temp);
            
  
        } else if (chart_type === "surficial") {
            temp = <SurficialGraph 
                {...props}
                input={input}
                disableBack
                disableMarkerList  
            />;
            setSurficialComp(temp);
        } else if (chart_type === "subsurface") {
            input.tsm_sensor = tsm_sensor;
            temp = <SubsurfaceGraph 
                {...props}
                input={input}
                disableBack
            />;
            setSubsurfaceComp(temp);
        }
    }, []);


    const type = chart_type;

    return (
        <Fragment>
            <Typography variant='h6' sx={{ml: 8, mt: 8}}> Rendered {chart_type} for LPA</Typography>
            <Grid item xs={12} md={6} sx={{padding: 8}}>
                { rainfall_comp }
                { surficial_comp }
                { subsurface_comp }
            </Grid>
        </Fragment>
    );
}

export default Container;
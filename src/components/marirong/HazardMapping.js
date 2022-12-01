import React from 'react';
import {Grid, Container, Button} from '@mui/material';
import MARHazardMap from '../../assets/hazard_map_01.jpg'
import { useSnackbar } from "notistack";
const HazardMapping = () => {


    console.log("useSnackbar:", useSnackbar())

    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    
    
    const handleClick = () => {
        enqueueSnackbar('Succesfully Downloaded');
    };

    return(
        <Container>
            <Grid>
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    sx={{marginTop: 2, textAlign: 'center'}}>
                    <img
                        src={MARHazardMap}
                        alt="lipata-hazard-map-png"
                        style={{objectFit: 'contain', height: '100%', width: '95%'}}
                    />
                </Grid>
                <Grid container sx={{mt: 2, mb: 6, padding: '2%'}}>
                    <Grid item xs={12} sm={12} md={12} lg={7}>
                        <Button variant="contained" sx={{float: 'right', mx: 1}}>
                            Upload
                        </Button>
                        <Button
                            variant="contained"
                            sx={{float: 'right', mx: 1}}
                            onClick={e => {
                                handleClick()
                            }}>
                            Download
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    )
}

export default HazardMapping;
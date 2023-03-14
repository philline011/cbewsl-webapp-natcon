import React, { Fragment } from 'react';
import {
  Grid, Typography, Button, Box, Modal, TextField,
  Checkbox, FormLabel, FormControl, FormControlLabel, FormGroup, FormHelperText
} from '@mui/material';
import RainfallGraph from '../analysis/RainfallGraph';

const Rainfall = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    return(
        <Fragment>
            <Grid item xs={12} sx={{ padding: 8 }}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box>
                        <Typography variant='h4' sx={{ marginBottom: 4 }}>
                            <b>Rainfall Data</b>
                        </Typography>
                    </Box>
                </Grid>
                <RainfallGraph />
            </Grid>
        </Fragment>
    )
}

export default Rainfall;
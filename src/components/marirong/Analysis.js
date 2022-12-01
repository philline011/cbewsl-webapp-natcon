import React, { Fragment } from 'react';
import {
  Grid, Typography, Button, Box, Modal, TextField,
  Checkbox, FormLabel, FormControl, FormControlLabel, FormGroup, FormHelperText
} from '@mui/material';
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import RainfallGraph from '../analysis/RainfallGraph';
import SurficialGraph from '../analysis/SurficialGraph';
import SubsurfaceGraph from '../analysis/SubsurfaceGraph';
import LandslideFeaturesTable from '../analysis/LandslideFeaturesTable';
import EarthquakeChart from '../analysis/EarthquakeChart';

const Analysis = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [state, setState] = React.useState({
    rainfall: false,
    surficial: false,
    subsurface: false,
  });

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const { rainfall, surficial, subsurface } = state;
  const error = [rainfall, surficial, subsurface].filter((v) => v).length === 0;


  return (
    <Fragment>
      <Grid item xs={12} sx={{ padding: 8 }}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Button variant="contained" onClick={handleOpen} sx={{ marginBottom: 4 }}>
            Load Graph per needed timestamp
          </Button>

          <Box>
            <Typography variant='h5' sx={{ marginBottom: 4 }}>
              Rainfall Data
            </Typography>
          </Box>

        </Grid>
        <RainfallGraph />
        <Typography variant='h5' sx={{ marginBottom: 4, marginTop: 8 }}>
          Surficial Data
        </Typography>
        <SurficialGraph />
        <Typography variant='h5' sx={{ marginBottom: 4, marginTop: 8 }}>
          Subsurface Data
        </Typography>
        <SubsurfaceGraph />
        <LandslideFeaturesTable />
        <Typography variant='h5' sx={{ marginBottom: 4, marginTop: 8 }}>
          Earthquake Proximity Map
        </Typography>
        <EarthquakeChart />
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ marginBottom: 2 }}>
            Consolidate charts per needed timestamp
          </Typography>
          <Box>
            <FormControl sx={{ m: 2 }} error={error} component="fieldset" variant="standard">
              <FormLabel component="legend">Select data source</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox checked={rainfall} onChange={handleChange} name="rainfall" />
                  }
                  label="Rainfall"
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={surficial} onChange={handleChange} name="surficial" />
                  }
                  label="Surficial Marker"
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={subsurface} onChange={handleChange} name="subsurface" />
                  }
                  label="Subsurface"
                />
              </FormGroup>
              <FormHelperText>Please select atleast 1 data source</FormHelperText>
            </FormControl>
          </Box>

          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            ......
          </Typography>
        </Box>
      </Modal>
    </Fragment>


  )
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default Analysis;
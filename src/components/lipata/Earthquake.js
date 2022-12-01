import React, {Fragment} from 'react';
import {
  Grid,
  Typography,
  Button,
  Box,
  Modal,
  TextField,
  Checkbox,
  FormLabel,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
} from '@mui/material';
import EarthquakeChart from '../analysis/EarthquakeChart';

const Earthquake = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Grid item xs={12} sx={{padding: 8}}>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Box>
          <Typography variant="h5" sx={{marginBottom: 4}}>
            Earthquake Data
          </Typography>
        </Box>
      </Grid>
      <EarthquakeChart />
    </Grid>
  );
};

export default Earthquake;

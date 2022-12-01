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
import SubsurfaceGraph from '../analysis/SubsurfaceGraph';

const Subsurface = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Fragment>
      <Grid item xs={12} sx={{padding: 8}}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Button
            variant="contained"
            onClick={handleOpen}
            sx={{marginBottom: 4}}>
            Load Subsurface Graph per needed timestamp
          </Button>
          <Box>
            <Typography variant="h5" sx={{marginBottom: 4}}>
              Subsurface Data
            </Typography>
          </Box>
        </Grid>
        <SubsurfaceGraph />
      </Grid>
    </Fragment>
  );
};

export default Subsurface;

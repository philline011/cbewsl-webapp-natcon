import React, {useState} from 'react';
import {Grid, Container, Button, Typography} from '@mui/material';
import FabMuiTable from '../utils/MuiTable';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

const Moms = () => {
  const [open, setOpen] = useState(false);
  const [feature, setFeature] = useState('');

  const handleChange = event => {
    setFeature(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    {name: 'date', label: 'Observance timestamp'},
    {name: 'description', label: 'Description'},
    {name: 'feature', label: 'Feature Name'},
    {name: 'reporter', label: 'Reporter'},
    {name: 'actions', label: 'Actions'},
  ];

  const options = {
    filter: true,
    selectableRows: 'multiple',
    selectableRowsOnClick: true,
    filterType: 'checkbox',
    responsive: 'vertical',
    onRowsDelete: rowsDeleted => {
      // const idsToDelete = rowsDeleted.data.map (item => item.dataIndex)
      // handleMuiTableBatchDelete(idsToDelete.sort());
    },
  };
  const dummyData = [
    {
      date: '2022-09-06 7:30AM',
      description: 'Nagkaroon nang maliit na landslide',
      feature: 'Slope failure',
      reporter: 'Jek de Guzman',
      actions: 'N/A',
    },
    {
      date: '2022-09-06 8:30AM',
      description: 'May bagong naipon na tubig',
      feature: 'Ponding',
      reporter: 'Edch Flores',
      actions: 'N/A',
    },
    {
      date: '2022-09-08 11:30AM',
      description: 'Nagkaroon nang bagong crack',
      feature: 'New crack',
      reporter: 'Jek de Guzman',
      actions: 'N/A',
    },
  ];

  return (
    <Container>
      <Grid container spacing={4} sx={{mt: 2, mb: 6, padding: '2%'}}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4">Manifestations of Movement</Typography>
            </Grid>
            <Grid item xs={12}>
              <FabMuiTable
                data={{
                  columns: columns,
                  rows: dummyData,
                }}
                options={options}
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container align="center">
                <Grid item xs={12}>
                  <Button variant="contained" onClick={handleClickOpen}>
                    Add manifestations of movement
                  </Button>
                  <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>
                      Enter new manifestation of movement
                    </DialogTitle>
                    <DialogContent>
                      <Grid item xs={12}>
                        <TextField
                          autoFocus
                          margin="dense"
                          label="Date and time"
                          variant="outlined"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          autoFocus
                          margin="dense"
                          label="Description"
                          variant="outlined"
                          fullWidth
                          multiline
                          rows="4"
                        />
                      </Grid>
                      <Grid item xs={12} style={{paddingTop: 10}}>
                        <InputLabel id="demo-simple-select-label">
                          Feature name
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={feature}
                          label="Feature Name"
                          onChange={handleChange}
                          fullWidth>
                          <MenuItem value={'Scarp'}>Scarp</MenuItem>
                          <MenuItem value={'Crack'}>Crack</MenuItem>
                          <MenuItem value={'Seepage'}>Seepage</MenuItem>
                          <MenuItem value={'Ponding'}>Ponding</MenuItem>
                          <MenuItem value={'Tilted trees'}>
                            Tilted trees
                          </MenuItem>
                          <MenuItem value={'Split trees'}>Split trees</MenuItem>
                          <MenuItem value={'Damaged structure'}>
                            Damaged structure
                          </MenuItem>
                          <MenuItem value={'Ground bulging'}>
                            Ground bulging
                          </MenuItem>
                          <MenuItem value={'Ground depression'}>
                            Ground depression
                          </MenuItem>
                          <MenuItem value={'Slope Failure'}>
                            Slope Failure
                          </MenuItem>
                        </Select>
                      </Grid>
                      <Grid item xs={12} style={{paddingTop: 10}}>
                        <TextField
                          autoFocus
                          margin="dense"
                          label="Reporter"
                          variant="outlined"
                          fullWidth
                        />
                      </Grid>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>Cancel</Button>
                      <Button onClick={handleClose}>Submit</Button>
                    </DialogActions>
                  </Dialog>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};
export default Moms;

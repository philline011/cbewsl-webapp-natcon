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

const SurficialMarkers = () => {
  const [open, setOpen] = useState(false);
  const [weather, setWeather] = useState('');

  const handleChange = event => {
    setWeather(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    {name: 'date', label: 'Date'},
    {name: 'time', label: 'Time'},
    {name: 'markerA', label: 'A'},
    {name: 'markerB', label: 'B'},
    {name: 'markerC', label: 'C'},
    {name: 'markerD', label: 'D'},
    {name: 'weather', label: 'Weather'},
    {name: 'person', label: 'Nag-sukat'},
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
      date: '2022-09-06',
      time: '7:30AM',
      markerA: '10cm',
      markerB: '12cm',
      markerC: '14cm',
      markerD: '15cm',
      weather: 'Maulap',
      person: 'Jek',
    },
    {
      date: '2022-09-08',
      time: '6:30AM',
      markerA: '10cm',
      markerB: '12cm',
      markerC: '14cm',
      markerD: '15cm',
      weather: 'Maulan',
      person: 'John',
    },
    {
      date: '2022-09-10',
      time: '7:20AM',
      markerA: '10cm',
      markerB: '12cm',
      markerC: '14cm',
      markerD: '15cm',
      weather: 'Maaraw',
      person: 'Phin',
    },
  ];

  return (
    <Container>
      <Grid container spacing={4} sx={{mt: 2, mb: 6, padding: '2%'}}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4">Surficial Markers</Typography>
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
                    Add surficial marker measurement
                  </Button>
                  <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>
                      Enter new surficial marker measurements
                    </DialogTitle>
                    <DialogContent>
                      <Grid
                        container
                        direction={'row'}
                        paddingTop={3}
                        spacing={1}
                        align="center">
                        <Grid item xs={6}>
                          <TextField
                            autoFocus
                            margin="dense"
                            label="Date"
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            autoFocus
                            margin="dense"
                            label="Time"
                            variant="outlined"
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        direction={'row'}
                        paddingTop={2}
                        align="center">
                        <Grid item xs={3}>
                          <TextField
                            autoFocus
                            margin="dense"
                            label="Marker A"
                            variant="outlined"
                            style={{width: 100}}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <TextField
                            autoFocus
                            margin="dense"
                            label="Marker B"
                            variant="outlined"
                            style={{width: 100}}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <TextField
                            autoFocus
                            margin="dense"
                            label="Marker C"
                            variant="outlined"
                            style={{width: 100}}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <TextField
                            autoFocus
                            margin="dense"
                            label="Marker D"
                            variant="outlined"
                            style={{width: 100}}
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={12} style={{paddingTop: 10}}>
                        <InputLabel id="demo-simple-select-label">
                          Weather
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={weather}
                          label="Weather"
                          onChange={handleChange}
                          fullWidth>
                          <MenuItem value={'Maaraw'}>Maaraw</MenuItem>
                          <MenuItem value={'Maulap'}>Maulap</MenuItem>
                          <MenuItem value={'Maulan'}>Maulan</MenuItem>
                          <MenuItem value={'Makulimlim'}>Makulimlim</MenuItem>
                          <MenuItem value={'Maambon'}>Maambon</MenuItem>
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
export default SurficialMarkers;

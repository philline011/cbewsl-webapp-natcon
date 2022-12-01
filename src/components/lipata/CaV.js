import React, {useState} from 'react';
import {Grid, Container, Button, Typography, Modal, Divider, Stack, TextField, InputLabel} from '@mui/material';
import FabMuiTable from '../utils/MuiTable';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


const CaV = () => {
  const columns = [
    {name: 'house_hold_no', label: 'Household #'},
    {name: 'head', label: 'Household Head'},
    {name: 'count', label: 'Member Count'},
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
    {house_hold_no: 1, head: 'Zargon Aleleng', count: 5},
    {house_hold_no: 2, head: 'Benhur Camacho', count: 3},
    {house_hold_no: 3, head: 'Mary Jane Tujoyns', count: 5},
    {house_hold_no: 4, head: 'Ben Taught', count: 6},
    {house_hold_no: 5, head: 'Gretchen Bubule', count: 8},
  ];

  //Dummy dialog and data
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openModal, setOpenModal] = useState(false);
  const closeModal = () => setOpenModal(false);

  const [hhNum, setHHNum] = useState();
  const [hhHead, setHHHead] = useState();
  const [hhHeadBday, setHHHeadBday] = useState();
  const [hhHeadGender, setHHHeadGender] = useState();
  const [hhMembers, setHHMembers] = useState();

  const dummyDialogData = [
    {
      house_hold_no: 1,
      head: 'Marissa Aleleng',
      count: 1,
      actions: 'Wife of Mr. Aleleng',
    },
    {house_hold_no: 5, head: 'Gretchen Bubule', count: 1, actions: 'N/A'},
  ];

  return (
    <Container>
      <Grid container spacing={4} sx={{mt: 2, mb: 6, padding: '2%'}}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4">Household Summary</Typography>
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
          </Grid>
        </Grid>

        <Grid container sx={{mt: 2, mb: 6, padding: '2%'}}>
          <Grid item xs={12} sm={12} md={12} lg={7}>
              <Button
                  variant="contained"
                  sx={{float: 'right', mx: 1}}
                  onClick={e => {
                      setOpenModal(true);
                      console.log("hello");
                  }}>
                  Add Household
              </Button>
              
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4">Vulnerable Household</Typography>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{minWidth: '100%'}}>
                <CardContent>
                  <Typography
                    sx={{fontSize: 16}}
                    color="text.secondary"
                    gutterBottom>
                    Pregnant
                  </Typography>
                  <Typography variant="h5" component="div"></Typography>
                  <Typography variant="body2">
                    No. of households with pregnant women:
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={handleOpen}>
                    View details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{minWidth: '100%'}}>
                <CardContent>
                  <Typography
                    sx={{fontSize: 14}}
                    color="text.secondary"
                    gutterBottom>
                    Person with disability
                  </Typography>
                  <Typography variant="h5" component="div"></Typography>
                  <Typography variant="body2">
                    No. of households with PWD:
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={handleOpen}>
                    View details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{minWidth: '100%'}}>
                <CardContent>
                  <Typography
                    sx={{fontSize: 14}}
                    color="text.secondary"
                    gutterBottom>
                    Person with comorbidity
                  </Typography>
                  <Typography variant="h5" component="div"></Typography>
                  <Typography variant="body2">
                    No. of households with people with comorbidities:
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={handleOpen}>
                    View details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          {'Vulnerable household details'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            List of households with pregnant/PWD/with comorbidities
          </DialogContentText>
          <FabMuiTable
            data={{
              columns: columns,
              rows: dummyDialogData,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openModal}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogContent>
            <div style={{width:"500px"}}>
              <Typography
                id="title"
                variant="h5"
                component="h4"
                marginBottom={2}>
                Add New Household
              </Typography>
              <Divider />
              <Stack spacing={1} paddingTop={2}>
                <TextField
                  label="Household Number"
                  variant="outlined"
                  value={hhNum}
                  onChange={e => setHHNum(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Household Head"
                  variant="outlined"
                  value={hhHead}
                  onChange={e => setHHHead(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Gender"
                  variant="outlined"
                  value={hhHeadGender}
                  onChange={e => setHHHeadGender(e.target.value)}
                  fullWidth
                />
                {/* <InputLabel>Birthday</InputLabel> */}
                <TextField
                  label="Birthday"
                  variant="outlined"
                  type="date"
                  value={hhHeadBday}
                  onChange={e => setHHHeadBday(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Household Members"
                  variant="outlined"
                  value={hhMembers}
                  onChange={e => setHHMembers(e.target.value)}
                  multiline
                  fullWidth
                />
              </Stack>
            </div>
        </DialogContent>
        <DialogActions>
          <Button
            autofocus
            variant="text"
            color="error"
            onClick={closeModal}
            >
            Cancel
          </Button>
          <Button
            autofocus
            variant="contained"
          >
            Add Household
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CaV;

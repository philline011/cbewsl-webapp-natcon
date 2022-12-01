import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
    TextField,
    Grid,
    Select, MenuItem, InputLabel, FormControl
  } from '@mui/material';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import React, {Fragment, useState, useEffect} from 'react';

function UserProfileModal(props){
   const isOpen = props.isOpen

  return(
    <Dialog
        fullWidth
        fullScreen={false}
        // maxWidth='xs'
        open={isOpen}
        aria-labelledby="form-dialog-title"

    >
      <DialogTitle id="form-dialog-title">Create Account</DialogTitle>
      <DialogContent style={{paddingTop: 10}}>
        <TextField
          id="outlined-required"
          placeholder="Ex: Juan"
          label="First Name"
          variant="outlined"
          style={{width: '100%', paddingBottom: 10}}
        />

        <TextField
          id="outlined-required"
          placeholder="Ex: Dela Cruz"
          label="Last Name"
          variant="outlined"
          style={{width: '100%', paddingBottom: 10}}
        />

        <TextField
          id="outlined-required"
          placeholder="Ex: Castro"
          label="Middle Name"
          variant="outlined"
          style={{width: '100%', paddingBottom: 10}}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Birthday"
            // value={value}
            // onChange={(newValue) => {
            //   setValue(newValue);
            // }}
            renderInput={(params) => <TextField style={{width: '100%', paddingBottom: 10}} {...params} />}
          />
        </LocalizationProvider>

        <FormControl fullWidth style={{width: '100%', paddingBottom: 10}}>
          <InputLabel id="demo-simple-select-label">Gender</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // value={age}
            label="Gender"
            // onChange={handleChange}
          >
            <MenuItem value={10}>Female</MenuItem>
            <MenuItem value={20}>Male</MenuItem>
          </Select>
        </FormControl>

        <TextField
          id="outlined-required"
          placeholder="Ex: Juan"
          label="Nickname"
          variant="outlined"
          style={{width: '100%', paddingBottom: 10}}
        />

        <TextField
          id="outlined-required"
          placeholder="Ex: DelaCruz1234"
          label="Username"
          variant="outlined"
          style={{width: '100%', paddingBottom: 10}}
        />

        <TextField
          id="outlined-required"
          type="password"
          placeholder="*****"
          label="Password"
          variant="outlined"
          style={{width: '100%', paddingBottom: 10}}
        />

        <TextField
          id="outlined-required"
          type="password"
          placeholder="*****"
          label="Confirm Password"
          variant="outlined"
          style={{width: '100%', paddingBottom: 10}}
        />

        <FormControl fullWidth style={{width: '100%', paddingBottom: 10}}>
          <InputLabel id="demo-simple-select-label">Designation</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // value={age}
            label="Designation"
            // onChange={handleChange}
          >
            <MenuItem value={10}>LEWC</MenuItem>
            <MenuItem value={20}>BLGU</MenuItem>
            <MenuItem value={20}>MLGU</MenuItem>
            <MenuItem value={20}>PLGU</MenuItem>
            <MenuItem value={20}>Dynaslope</MenuItem>
            <MenuItem value={20}>Community</MenuItem>
          </Select>
        </FormControl>

      </DialogContent>
      <DialogActions>
        <Button color="primary"
          onClick={e => {
            console.log("save")
          }} 
        >
            Save Account
        </Button>
        <Button color="secondary"
          onClick={e => {
            console.log("cancel")
          }} 
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UserProfileModal;
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
    Select, MenuItem, InputLabel, FormControl, Box
  } from '@mui/material';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import React, {Fragment, useState, useEffect} from 'react';
import moment from 'moment';
import axios from 'axios';
import {signUp} from '../../../apis/UserManagement'
import PromptModal from './PromptModal';
import { CompressOutlined } from '@mui/icons-material';

function UserProfileModal(props){
  const isOpen = props.isOpen
  const setIsOpen = props.setIsOpen

  const [openPrompt, setOpenPrompt] = useState(false)
  const [notifMessage, setNotifMessage] = useState("")
  const [errorPrompt, setErrorPrompt] = useState(false)

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("")
  const [middleName, setMiddleName] = useState("")
  const [suffix, setSuffix] = useState("")
  const [nickname, setNickname] = useState("")
  const [gender, setGender] = useState("")
  const [birthday, setBirthday] =useState(moment(new Date()).format("YYYY-MM-DD"))
  const [mobileNo, setMobileNo] = useState("")
  const [address, setAddress] = useState("")
  const [designation, setDesignation] = useState("")
  const [username, setUsername] = useState("")

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordMatched, setPasswordMatched] = useState()

  useEffect(() => {
    checkMatch()
  }, [newPassword, confirmPassword]);
  
  const checkMatch = () => {
    if(confirmPassword != ""){
      if(newPassword == confirmPassword) setPasswordMatched(true)
      else setPasswordMatched(false)
    }
    else setPasswordMatched(true)
  }

  const [filledRequired, setFilledRequired] = useState()

  const checkRequired = () => {
    if(firstName != "" && lastName != "" && gender != "" && birthday != "" && designation != "" && mobileNo != "" && username != ""){
      console.log("qwe")
      // setFilledRequired(true)
      return true
    }
    else {
      console.log("yo")
      // setFilledRequired(false)
      return false
    }
    console.log("dbbfefu",filledRequired)
  }

  const handleSubmit = () => {

    let submitData = {
      firstname: firstName,
      middlename: middleName,
      lastname: lastName,
      nickname: nickname,
      gender: gender,
      suffix: suffix,
      birthday: moment(new Date(birthday)).format("YYYY-MM-DD"),
      address: address,
      designation_id: designation,
      mobile_no: mobileNo,
      password: newPassword,
      username: username
    }
    console.log(submitData)
    
    let filled = checkRequired()
    console.log("dbbfefu",filledRequired)

    if(filled){
      signUp(submitData, (response) => {
        if(response.status == true){
          setOpenPrompt(true)
          setErrorPrompt(false)
          setNotifMessage("Account succesfully created")
          setIsOpen(false)
        }
        else if(response.status == false){
          setOpenPrompt(true)
          setErrorPrompt(true)
          setNotifMessage(response.message)
        }
        console.log(response)
      })
    }else{
      setOpenPrompt(true)
      setNotifMessage("Please fill all required fields.")
      setErrorPrompt(true)
    }
    
  }
  
  return(
    <Fragment>
      <PromptModal
        isOpen={openPrompt}
        error={errorPrompt}
        setOpenModal={setOpenPrompt}
        notifMessage={notifMessage}
      />
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
            error={(errorPrompt && firstName == "") ? true : false}
            helperText={(errorPrompt && firstName == "") ? "First Name required" : ""}
            id="outlined-required"
            placeholder="Ex: Juan"
            label="First Name"
            variant="outlined"
            style={{width: '100%', paddingBottom: 10}}
            onChange={e => {
              setFirstName(e.target.value)
            }}
          />

          <TextField
            error={(errorPrompt && lastName == "") ? true : false}
            helperText={(errorPrompt && lastName == "") ? "Last Name required" : ""}
            id="outlined-required"
            placeholder="Ex: Dela Cruz"
            label="Last Name"
            variant="outlined"
            style={{width: '100%', paddingBottom: 10}}
            onChange={e => {
              setLastName(e.target.value)
            }}
          />

          <TextField
            id="outlined-required"
            placeholder="Ex: Castro"
            label="Middle Name"
            variant="outlined"
            style={{width: '100%', paddingBottom: 10}}
            onChange={e => {
              setMiddleName(e.target.value)
            }}
          />

          <TextField
            id="outlined-required"
            placeholder="Ex: Jr."
            label="Suffix"
            variant="outlined"
            style={{width: '100%', paddingBottom: 10}}
            onChange={e => {
              setSuffix(e.target.value)
            }}
          />

          <Box flexDirection={'row'}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Birthday"
                value={birthday}
                onChange={(e) => {
                  setBirthday(e);
                }}
                renderInput={(params) => <TextField style={{width: '49.2%', paddingBottom: 10, marginRight: '1.6%'}} {...params} />}
              />
            </LocalizationProvider>

            <FormControl fullWidth style={{width: '49.2%', paddingBottom: 10}}>
              <InputLabel id="demo-simple-select-label">Gender</InputLabel>
              <Select
                error={(errorPrompt && gender == "") ? true : false}
                helperText={(errorPrompt && gender == "") ? "Gender required" : ""}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Gender"
                onChange={e => {
                  setGender(e.target.value)
                }}
              >
                <MenuItem value={"Female"}>Female</MenuItem>
                <MenuItem value={"Male"}>Male</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TextField
            id="outlined-required"
            placeholder="Ex: Brgy. Marirong, Samar"
            label="Address"
            variant="outlined"
            style={{width: '100%', paddingBottom: 10}}
            onChange={e => {
              setAddress(e.target.value)
            }}
          />

          <TextField
            id="outlined-required"
            placeholder="Ex: Juan"
            label="Nickname"
            variant="outlined"
            style={{width: '100%', paddingBottom: 10}}
            onChange={e => {
              setNickname(e.target.value)
            }}
          />

          <TextField
            error={(errorPrompt && username == "") ? true : false}
            helperText={(errorPrompt && username == "") ? "Username required" : ""}
            id="outlined-required"
            placeholder="Ex: DelaCruz1234"
            label="Username"
            variant="outlined"
            style={{width: '100%', paddingBottom: 10}}
            onChange={e => {
              setUsername(e.target.value)
            }}
          />

          <TextField
            error={(errorPrompt && mobileNo == "") ? true : false}
            helperText={(errorPrompt && mobileNo == "") ? "Mobile Number required" : ""}
            id="outlined-required"
            placeholder="Ex: 09xxxxxxxxx"
            label="Mobile Number"
            variant="outlined"
            style={{width: '100%', paddingBottom: 10}}
            onChange={e => {
              setMobileNo(e.target.value)
            }}
          />

          <TextField
            // error={passwordMatched ? false : true}
            // helperText={passwordMatched ? " " : "Password does not match"}
            id="outlined-required"
            placeholder="XXXX"
            type="password"
            label = "Password"
            variant="outlined"
            style={{width: '100%', paddingBottom: 10}}
            onChange={e => {
              setNewPassword(e.target.value)
            }}
          />

          <TextField
            error={passwordMatched ? false : true}
            helperText={passwordMatched ? "" : "Password does not match"}
            id="outlined-required"
            placeholder="XXXX"
            type="password"
            label="Confirm Password"
            variant="outlined"
            style={{width: '100%', paddingBottom: 10}}
            onChange={e => {
              setConfirmPassword(e.target.value)
            }}
          />

          <FormControl fullWidth style={{width: '100%', paddingBottom: 10}}>
            <InputLabel id="demo-simple-select-label-designation">Designation</InputLabel>
            <Select
              error={(errorPrompt && designation == "") ? true : false}
              helperText={(errorPrompt && designation == "") ? "Designation required" : ""}
              labelId="demo-simple-select-label-designation"
              id="demo-simple-select-designation"
              label="Designation"
              onChange={e => {
                setDesignation(e.target.value)
              }}
            >
              <MenuItem value={1}>LEWC</MenuItem>
              <MenuItem value={2}>BLGU</MenuItem>
              <MenuItem value={3}>MLGU</MenuItem>
              <MenuItem value={4}>PLGU</MenuItem>
              <MenuItem value={5}>Dynaslope</MenuItem>
              <MenuItem value={6}>Community</MenuItem>
            </Select>
          </FormControl>

        </DialogContent>
        <DialogActions>
          <Button 
            disabled={(passwordMatched && confirmPassword != "")? false : true}
            color="primary"
            onClick={e => {
              handleSubmit()
            }} 
          >
              Save Account
          </Button>
          <Button color="secondary"
            onClick={e => {
              setIsOpen(false)
              console.log("cancel")
            }} 
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default UserProfileModal;
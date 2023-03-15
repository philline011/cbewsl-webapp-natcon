import React, {Fragment, useEffect, useState} from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button, Typography, TextField, Divider,
  Grid
} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import {Paper, Link, Box} from '@material-ui/core';
import tile_1 from '../../assets/tile/tile_1.png';
import tile_2 from '../../assets/tile/tile_2.png';
import tile_3 from '../../assets/tile/tile_3.png';
import tile_4 from '../../assets/tile/tile_4.png';
import {SignInLogo} from '../../components/utils/SignInLogo';
import UserProfileModal from '../marirong/modals/UserProfileModal';
import PromptModal from '../marirong/modals/PromptModal';
import {signIn, forgotPassword, verifyOTP} from '../../apis/UserManagement'
import { getNumberOfFiles } from '../../apis/Misc';
import umi_login_banner from '../../assets/umi_login_banner.png'

const imageDivider = makeStyles(theme => ({
  animated_divider: {
    display: 'none',
    '@media (min-width:600px)': {
      fontSize: 'none',
    },
    [theme.breakpoints.up('md')]: {
      display: 'initial',
    },
  },
}));

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="/">
        CBEWS-L
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const Signin = () => {
  const imageDiv = imageDivider();

  let navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [inputOTPModal, setInputOTPModal] = useState(false)
  const [createAccountModal, setCreateAccountModal] = useState(false)
  
  const [openPrompt, setOpenPrompt] = useState(false)
  const [promptTitle, setPromptTitle] = useState("")
  const [notifMessage, setNotifMessage] = useState("")
  const [errorPrompt, setErrorPrompt] = useState(false)

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordMatched, setPasswordMatched] = useState()

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [indicator, setIndicator] = useState("")
  const [otp, setOTP] = useState("")

  const [fileCount, setFileCount] = useState();

  useEffect(() => {
    checkMatch()
    numOfFiles()
  }, [newPassword, confirmPassword]);

  const numOfFiles = () => {
    getNumberOfFiles("assets", (data) => {
      console.log(data.length)
      setFileCount(data.length)
    });
  }

  useEffect(() => {

  })

  const checkMatch = () => {
    if(confirmPassword != ""){
      if(newPassword == confirmPassword) setPasswordMatched(true)
      else setPasswordMatched(false)
    }
    else setPasswordMatched(true)
  }

  const handleLogin = () => {
    
    let submitData = {
      username: username,
      password: password
    }
    window.location = '/opcen';
    // if (username != "" && password != "") {
    //   signIn(submitData, (response) => {
    //     if(response.status == true){
    //       let temp = {...response.data}
    //       temp['img_length'] = fileCount
    //       localStorage.setItem('credentials', JSON.stringify(temp))
    //       window.location = '/opcen';
    //     }
    //     else{
    //       setOpenPrompt(true)
    //       setErrorPrompt(true)
    //       setNotifMessage(response.message)
    //     }
    //   });
    // } else {
    //   setOpenPrompt(true);
    //   setErrorPrompt(true);
    //   setNotifMessage("Username / Password not found.")
    // }
  };



  return (
    <Fragment>

      <Dialog
        fullWidth
        fullScreen={false}
        maxWidth='xs'
        open={openModal}
        aria-labelledby="form-dialog-title"

      >
        <DialogTitle id="form-dialog-title">Forgot Password</DialogTitle>
        <DialogContent>

          <TextField
            id="filled-helperText"
            placeholder="E.g. JuanDelacruz"
            // inputProps={{min: 0, style: {textAlign: 'center'}}}
            helperText={
              <Typography
                variant="caption"
                display="block"
                // style={{textAlign: 'center'}}
                >
                Username or Mobile Number
              </Typography>
            }
            variant="outlined"
            style={{width: '100%'}}
            onChange={e => {
              setIndicator(e.target.value)
            }}
          />

          <Link
            component="button"
            onClick={e => {
              setOpenModal(false)
              setInputOTPModal(true)
            }}
            style={{width: '100%', fontSize: 15}}
          >
            Already have an OTP? Click here.
          </Link>

        </DialogContent>
        <DialogActions>
            <Button color="primary"
              onClick={e => {
                forgotPassword({indicator: indicator}, (response) => {
                  console.log(response)
                  if(response.status == true){
                    setOpenPrompt(true)
                    setErrorPrompt(false)
                    setPromptTitle(response.title)
                    setNotifMessage(response.message)
                    setOpenModal(false)
                  }
                  else{
                    setOpenPrompt(true)
                    setErrorPrompt(true)
                    setPromptTitle(response.title)
                    setNotifMessage(response.message)
                  }
                })
              }} 
            >
                Request OTP
            </Button>
            <Button color="secondary"
              onClick={e => {
                setOpenModal(false)
              }} 
            >
              Close
            </Button>
        </DialogActions>
      </Dialog>

      <Dialog
          fullWidth
          fullScreen={false}
          maxWidth='xs'
          open={inputOTPModal}
          aria-labelledby="form-dialog-title"

      >
        <DialogTitle id="form-dialog-title">Create New Password</DialogTitle>
        <DialogContent style={{paddingTop: 10}}>
          <TextField
            id="filled-helperText"
            label="OTP"
            placeholder="XXXX"
            helperText="Ask developers for your OTP"
            variant="outlined"
            style={{width: '100%', paddingBottom: 10}}
            onChange={e => {
              setOTP(e.target.value)
            }}
          />
          
          <TextField
            // error={passwordMatched ? false : true}
            // helperText={passwordMatched ? " " : "Password does not match"}
            id="outlined-required"
            placeholder="XXXX"
            type="password"
            label = "New Password"
            variant="outlined"
            style={{width: '100%', paddingBottom: 10}}
            onChange={e => {
              setNewPassword(e.target.value)
            }}
          />

          <TextField
            error={passwordMatched ? false : true}
            helperText={passwordMatched ? " " : "Password does not match"}
            id="outlined-required"
            placeholder="XXXX"
            type="password"
            label="Confirm Password"
            variant="outlined"
            style={{width: '100%'}}
            onChange={e => {
              setConfirmPassword(e.target.value)
            }}
          />

        </DialogContent>
        <DialogActions>
          <Button color="primary"
            disabled={(passwordMatched && confirmPassword != "")? false : true}
            onClick={e => {
              console.log("pinapasa",password)
              verifyOTP({password: newPassword, otp: otp}, (response) => {
                console.log(response)
                if(response.status == true){
                  setOpenPrompt(true)
                  setErrorPrompt(false)
                  setPromptTitle(response.title)
                  setNotifMessage(response.message)
                  setInputOTPModal(false)
                }
                else{
                  setOpenPrompt(true)
                  setErrorPrompt(true)
                  setPromptTitle(response.title)
                  setNotifMessage(response.message)
                }
              })
            }} 
          >
              Submit
          </Button>
          <Button color="secondary"
            onClick={e => {
              setInputOTPModal(false)
              setOpenModal(true)
            }} 
          >
            Back
          </Button>
        </DialogActions>
      </Dialog>

      <UserProfileModal
        isOpen={createAccountModal}
        setIsOpen={setCreateAccountModal}
      />

      <PromptModal
        isOpen={openPrompt}
        error={errorPrompt}
        setOpenModal={setOpenPrompt}
        notifMessage={notifMessage}
        title={promptTitle}
      />

      <Grid container>
        <Grid
          className={imageDiv.animated_divider}
          item
          xs={0}
          sm={0}
          md={7}>
          <div>
            <img
              src={tile_1}
              style={{
                position: 'fixed',
                width: '58.3%',
                height: '100%',
              }}
            />
            <img
              src={tile_2}
              style={{
                position: 'fixed',
                width: '58.3%',
                height: '100%',
              }}
            />
            <img
              src={tile_3}
              style={{
                position: 'fixed',
                width: '58.3%',
                height: '100%',
              }}
            />
            <img
              src={tile_4}
              style={{
                position: 'fixed',
                width: '58.3%',
                height: '100%',
              }}
            />
          </div>
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={5}
          elevation={6}
          alignContents="center">

          <SignInLogo />

          <Typography component="h2" variant="h3" style={{textAlign: 'center'}}>
            Community Based Early Warning 
          </Typography>
          <Typography
            component="h2"
            variant="h3"
            style={{paddingBottom: '5%', textAlign: 'center'}}>
             Systems for Landslides
          </Typography>
          <Grid container spacing={4} textAlign="center">
            <Grid item xs={12} sm={12} md={12}>
              <TextField
                id="filled-helperText"
                placeholder="E.g. JuanDelacruz"
                inputProps={{min: 0, style: {textAlign: 'center'}}}
                helperText={
                  <Typography
                    variant="caption"
                    display="block"
                    style={{textAlign: 'center'}}>
                    Username
                  </Typography>
                }
                variant="standard"
                style={{width: '80%'}}
                onChange={e => {
                  setUsername(e.target.value)
                }}
                onKeyPress={(event)=> {
                  if (event.code === "Enter") {
                    handleLogin();
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <TextField
                id="filled-helperText"
                placeholder="**************"
                inputProps={{min: 0, style: {textAlign: 'center'}}}
                type="password"
                helperText={
                  <Typography
                    variant="caption"
                    display="block"
                    style={{textAlign: 'center'}}>
                    Password
                  </Typography>
                }
                variant="standard"
                style={{width: '80%'}}
                onChange={e => {
                  setPassword(e.target.value)
                }}
                onKeyPress={(event)=> {
                  if (event.code === "Enter") {
                    if (event.code === "Enter") {
                      handleLogin();
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Button
                variant="contained"
                onClick={() => {
                  handleLogin();
                }}>
                Sign in
              </Button>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Grid>
                <Link
                  component="button" 
                  style={{fontStyle: 'italic', fontSize: 16}}
                  onClick={e => {setOpenModal(true)}}
                >
                  Forgot Password?
                </Link>
              </Grid>
              <Grid>
                <Link
                  component="button" 
                  style={{fontStyle: 'italic', fontSize: 16}}
                  onClick={e => {setCreateAccountModal(true)}}
                >
                  No account yet? Register here!
                </Link>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <div style={{
                  textAlign: 'center',
                  height: 'auto',
                  width: '100%',
                  padding: 5
              }}>
                <img src={umi_login_banner}
                  alt="umi-login-banner"
                  style={{
                    objectFit: 'contain',
                    height: 'auto',
                    width: 600,
                  }}
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default Signin;

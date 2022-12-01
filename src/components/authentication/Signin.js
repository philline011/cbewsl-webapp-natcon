import React, {Fragment, useState} from 'react';
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
                Username
              </Typography>
            }
            variant="outlined"
            style={{width: '100%'}}
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
                setOpenModal(false)
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
        <DialogContent>
          <TextField
            id="filled-helperText"
            placeholder="XXXX"
            helperText={
              <Typography
                variant="caption"
                display="block"
                >
                OTP
              </Typography>
            }
            variant="outlined"
            style={{width: '100%', paddingBottom: 10}}
          />

          <TextField
            id="filled-helperText"
            placeholder="XXXX"
            helperText={
              <Typography
                variant="caption"
                display="block"
                >
                New Password
              </Typography>
            }
            variant="outlined"
            style={{width: '100%', paddingBottom: 10}}
          />

          <TextField
            id="filled-helperText"
            placeholder="XXXX"
            helperText={
              <Typography
                variant="caption"
                display="block"
                >
                Confirm Password
              </Typography>
            }
            variant="outlined"
            style={{width: '100%'}}
          />
        </DialogContent>
        <DialogActions>
          <Button color="primary"
            onClick={e => {
              setInputOTPModal(false)
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
      />

      <Grid container>
        <Grid
          className={imageDiv.animated_divider}
          item
          xs={false}
          sm={3}
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
            Information for Landslides
          </Typography>

          {/* DI PA FINAL DI PA SAME SA MARIRONG */}
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
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Button
                variant="contained"
                onClick={() => {
                  window.location = '/opcen';
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
                  No account yet? Register Here!
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default Signin;

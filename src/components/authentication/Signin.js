import React, {Fragment} from 'react';
import {Grid, TextField, Typography, Button} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import {Paper, Link, Box} from '@material-ui/core';
import tile_1 from '../../assets/tile/tile_1.png';
import tile_2 from '../../assets/tile/tile_2.png';
import tile_3 from '../../assets/tile/tile_3.png';
import tile_4 from '../../assets/tile/tile_4.png';
import {SignInLogo} from '../../components/utils/SignInLogo';

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

  return (
    <Fragment>
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
          component={Paper}
          elevation={6}
          square
          alignContents="center"
          paddingBottom="50%">
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
              <a href="#">
                <Typography style={{fontStyle: 'italic'}}>
                  Forgot Password?
                </Typography>
              </a>
              <a href="#">
                <Typography style={{fontStyle: 'italic'}}>
                  No account yet? Register Here!
                </Typography>
              </a>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default Signin;

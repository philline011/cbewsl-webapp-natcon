import React, {Fragment, useState, useEffect} from 'react';
import {
  Grid,
  IconButton,
  Typography,
  Tab,
  Tabs,
  AppBar,
  Toolbar,
  Tooltip,
  Avatar,
} from '@mui/material';
import DostSeal from '../../assets/phivolcs_seal.png';
import DynaslopeSealMini from '../../assets/dynaslope_seal_mini.png';

import ilolo_province_seal from '../../assets/iloilo_province_seal.png';
import leon_municipal_seal from '../../assets/leon_municipal_seal.png';
import leon_mdrrmc_responder from '../../assets/leon_mdrrmc_responder.png';
import mar_lewc_seal from '../../assets/mar_lewc_seal.png';

import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import {useNavigate} from 'react-router-dom';
import moment from 'moment';

const MarirongHeader = () => {
  let navigate = useNavigate();
  const [value, setValue] = useState(0);
  const [server_time, setServerTime] = useState('');

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/opcen');
        break;
      case 1:
        event.preventDefault();
        break;
      case 2:
        event.preventDefault();
        break;
      case 3:
        event.preventDefault();
        break;
      case 4:
        navigate('/events');
        break;
      default:
        navigate('/assessment');
        break;
    }
  };

  const a11yProps = index => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  };
  const [anchorElSettings, setAnchorElSettings] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElCRA, setAnchorElCRA] = React.useState(null);
  const [anchorElAnalysis, setAnchorElAnalysis] = React.useState(null);
  const [anchorElGroundData, setAnchorElGroundData] = React.useState(null);
  const open = Boolean(anchorEl);
  const openCRA = Boolean(anchorElCRA);
  const openAnalysis = Boolean(anchorElAnalysis);
  const openGroundData = Boolean(anchorElGroundData);
  const openSettings = Boolean(anchorElSettings);

  const preventDefault = event => {
    event.preventDefault();
  };

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickCRA = event => {
    setAnchorElCRA(event.currentTarget);
  };

  const handleClickAnalysis = event => {
    setAnchorElAnalysis(event.currentTarget);
  };

  const handleClickGroundData = event => {
    setAnchorElGroundData(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElCRA(null);
    setAnchorElAnalysis(null);
    setAnchorElGroundData(null);
    setAnchorElSettings(null);
  };

  const handleCurrentTab = () => {
    const path_name = window.location.pathname;
    if (path_name === '/opcen') {
      setValue(0);
    } else if (
      path_name === '/hazard_mapping' ||
      path_name === '/cav'
    ) {
      setValue(1);
    } else if (
      path_name === '/analysis' ||
      path_name === '/rainfall' ||
      path_name === '/surficial' ||
      path_name === '/subsurface' ||
      path_name === '/earthquake'
    ) {
      setValue(2);
    } else if (
      path_name === '/surficial_markers' ||
      path_name === '/moms'
    ) {
      setValue(3);
    } else if (path_name === '/events') {
      setValue(4);
    }
  };

  useEffect(() => {
    setInterval(() => {
      let dt = moment().format('ddd DD-MMM-YYYY HH:mm:ss');
      setServerTime(dt);
    }, 1000);
    handleCurrentTab()
  }, []);

  return (
    <Fragment>
      <Grid container style={{background: '#16526D'}}>
        <Grid item xs={4} sm={4} md={4} lg={4}>
          <div
            style={{
              textAlign: 'left',
              height: 'auto',
              width: '100%',
              padding: 20,
            }}>
            <Typography
              variant="h5"
              style={{fontWeight: '600', color: 'white'}}>
              COMMUNITY-BASED EARLY WARNING SYSTEM FOR LANDSLIDES
            </Typography>
            <Typography
              variant="h6"
              style={{fontWeight: '300', color: 'white'}}>
              Brgy. Marirong, Leon, Iloilo
            </Typography>
          </div>
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={6} sx={{marginTop: 2}}>
          <div
            style={{
              textAlign: 'center',
              height: 'auto',
              width: '100%',
              padding: 10,
            }}>
            <img
              src={DostSeal}
              alt="dost-seal-png"
              style={{
                objectFit: 'contain',
                height: 75,
                width: 75,
                marginRight: 8,
              }}
            />
            <img
              src={DynaslopeSealMini}
              alt="dynaslope-seal-mini-png"
              style={{
                objectFit: 'contain',
                height: 75,
                width: 75,
                marginRight: 8,
              }}
            />
            <img
              src={ilolo_province_seal}
              alt="ilolo_province_seal"
              style={{
                objectFit: 'cover',
                height: 70,
                width: 70,
                marginRight: 8,
              }}
            />
            <img
              src={leon_municipal_seal}
              alt="leon_municipal_seal"
              style={{
                objectFit: 'contain',
                height: 70,
                width: 70,
                marginRight: 8,
              }}
            />
            <img
              src={leon_mdrrmc_responder}
              alt="leon_mdrrmc_responder"
              style={{
                objectFit: 'contain',
                height: 70,
                width: 70,
                marginRight: 8,
              }}
            />
            <img
              src={mar_lewc_seal}
              alt="mar_lewc_seal"
              style={{
                objectFit: 'contain',
                height: 70,
                width: 70,
                marginRight: 8,
              }}
            />
          </div>
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={2}>
          <div style={{textAlign: 'end', padding: 5}}>
            <Tooltip title="Notification">
              <IconButton onClick={() => {}} sx={{p: 2, mt: 4}}>
                <NotificationsNoneIcon
                  alt="Notification"
                  style={{color: 'white'}}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="Open settings">
              <IconButton onClick={(e) => { setAnchorElSettings(e.currentTarget) }} sx={{p: 2, mt: 4}}>
                <Avatar alt="Profile photo" />
              </IconButton>
            </Tooltip>

            <Menu
              id="menu-settings"
              anchorEl={anchorElSettings}
              open={openSettings}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'button',
              }}>
              <MenuItem
                onClick={() => {
                  navigate('/profile-settings');
                  handleClose();
                }}>
                Profile Settings
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate('/change-password');
                  handleClose();
                }}>
                Change Password
              </MenuItem>
            </Menu>

            <IconButton
              id="button"
              aria-controls={open ? 'menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              sx={{p: 2, mt: 4}}>
              <MenuIcon alt="Menu" style={{color: 'white'}} />
            </IconButton>
            <Menu
              id="menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'button',
              }}>
              <MenuItem
                onClick={() => {
                  navigate('/resources');
                  handleClose();
                }}>
                Resources
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate('/feedback');
                  handleClose();
                }}>
                Feedback
              </MenuItem>
              <MenuItem 
                onClick={() => {
                  localStorage.removeItem('credentials')
                  (window.location = '/')
                }}>
                Logout
              </MenuItem>
            </Menu>
            <Grid item md={12} style={{alignSelf: 'center'}}>
              <Typography variant="body1" style={{color: 'white'}}>
                {server_time.toUpperCase()}
              </Typography>
            </Grid>
          </div>
        </Grid>
        <Grid
          item
          xs={12}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            width: '100%',
          }}>
          <AppBar position="static" color="inherit">
            <Grid container style={{backgroundColor: '#F8991D'}}>
              <Grid item md={10}>
                <Toolbar style={{justifyContent: 'center'}}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example">
                    <Tab
                      label={
                        <span style={{color: 'white', fontWeight: 'bold'}}>
                          DASHBOARD
                        </span>
                      }
                      {...a11yProps(0)}
                    />
                    <Tab
                      label={
                        <span style={{color: 'white', fontWeight: 'bold'}}>
                          COMMUNITY RISK ASSESSMENT
                        </span>
                      }
                      onClick={e => {
                        handleClickCRA(e);
                        preventDefault(e);
                      }}
                    />
                    <Tab
                      label={
                        <span style={{color: 'white', fontWeight: 'bold'}}>
                          DATA ANALYSIS
                        </span>
                      }
                      onClick={e => {
                        handleClickAnalysis(e);
                        preventDefault(e);
                      }}
                    />
                    <Tab
                      label={
                        <span style={{color: 'white', fontWeight: 'bold'}}>
                          GROUND DATA
                        </span>
                      }
                      onClick={e => {
                        handleClickGroundData(e);
                        preventDefault(e);
                      }}
                    />
                    <Tab
                      label={
                        <span style={{color: 'white', fontWeight: 'bold'}}>
                          SCHEDULE
                        </span>
                      }
                      {...a11yProps(1)}
                    />
                  </Tabs>
                </Toolbar>
              </Grid>
            </Grid>
          </AppBar>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Menu
          id="menu"
          anchorEl={anchorElCRA}
          open={openCRA}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'button',
          }}>
          <MenuItem
            onClick={() => {
              navigate('/hazard_mapping');
              handleClose();
            }}>
            Hazard Map
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate('/cav');
              handleClose();
            }}>
            Household Data
          </MenuItem>
        </Menu>
      </Grid>
      <Grid item xs={12}>
        <Menu
          id="menu"
          anchorEl={anchorElAnalysis}
          open={openAnalysis}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'button',
          }}>
          <MenuItem
            onClick={() => {
              navigate('/analysis');
              handleClose();
            }}>
            Summary
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate('/rainfall');
              handleClose();
            }}>
            Rainfall plot
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate('/surficial');
              handleClose();
            }}>
            Surficial Plot
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate('/subsurface');
              handleClose();
            }}>
            Subsurface plot
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate('/earthquake');
              handleClose();
            }}>
            Earthquake Data
          </MenuItem>
        </Menu>
        <Menu
          id="menu"
          anchorEl={anchorElGroundData}
          open={openGroundData}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'button',
          }}>
          <MenuItem
            onClick={() => {
              navigate('/surficial_markers');
              handleClose();
            }}>
            Surficial Markers
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate('/moms');
              handleClose();
            }}>
            Manifestations of movement
          </MenuItem>
        </Menu>
      </Grid>
    </Fragment>
  );
};

export default MarirongHeader;

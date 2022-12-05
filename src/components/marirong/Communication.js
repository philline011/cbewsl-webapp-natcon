import React, {Fragment, useEffect, useState} from 'react';
import {Grid, Button, InputAdornment, TextField} from '@mui/material';
import MarirongHeader from '../utils/MarirongHeader';
import {Box} from '@mui/system';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Avatar from '@mui/material/Avatar';
import {deepOrange, deepPurple} from '@mui/material/colors';
import AttachmentIcon from '@mui/icons-material/Attachment';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const Communication = () => {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [characterLimit, setCharacterLimit] = useState(250);
  const [message, setMessage] = useState('');
  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    console.log(index);
  };

  useEffect(() => {
    setCharacterLimit(250 - message.length);
  }, [message]);

  const DummyData = [
    {
      id: 1,
      message: 'EVENT LPA MAY 20 2022 A 56CM B 53CM C 67CM JEKDEGUZMAN',
      timestamp: 'May 20, 2022',
      sender: 'Jeremiah De guzman',
      mobile_no: '09123456789',
    },
    {
      id: 2,
      message: 'Ano na po ang alert level sa ating lugar',
      timestamp: 'May 16, 2022',
      sender: 'Kate Flores',
      mobile_no: '0987654321',
    },
    {
      id: 3,
      message:
        'Mayroon po kaming nakitang bagong crack sa gilid ng aming bahay',
      timestamp: 'May 17, 2022',
      sender: 'Web Sevilla',
      mobile_no: '0978564312',
    },
    {
      id: 4,
      message: 'May alert level po bang nakataas ngayon?',
      timestamp: 'May 14, 2022',
      sender: 'Oscar Guanzon',
      mobile_no: '0978564312',
    },
    {
      id: 5,
      message: 'Copy',
      timestamp: 'May 12, 2022',
      sender: 'Nichi Mallari',
      mobile_no: '09998886667',
    },
    {
      id: 6,
      message: 'Ang menu po natin today eh, adobong manok at munggo',
      timestamp: 'May 11, 2022',
      sender: 'BJ-Canteen',
      mobile_no: '09998886667',
    },
    {
      id: 7,
      message: 'GanDanG um4gA, taRa n0m n0m.... UwU',
      timestamp: 'May 09, 2022',
      sender: 'Sir Don ng Parokya ni edgar',
      mobile_no: '09998886667',
    },
    {
      id: 8,
      message: 'Alert 0 na po ang sa inyong lugar mga kabrodie',
      timestamp: 'May 09, 2022',
      sender: 'Dynaslope',
      mobile_no: '09998886667',
    },
  ];

  const ConvoData = [
    {
      id: 1,
      message: 'EVENT LPA MAY 20 2022 A 56CM B 53CM C 67CM JEKDEGUZMAN',
      timestamp: 'May 20, 2022 11:00:00',
      sender: 'Jek',
      mobile_no: '09123456789',
    },
    {
      id: 1,
      message: 'Salamat po sa pag papadala ng sukat!',
      timestamp: 'May 21, 2022 11:01:00',
      sender: 'Me',
      mobile_no: '',
    },
    {
      id: 1,
      message: 'Kamusta po kayo ngayon dyan? Kamusta po panahon?',
      timestamp: 'May 21, 2022 11:02:00',
      sender: 'Me',
      mobile_no: '',
    },
    {
      id: 1,
      message: 'Malakas po yung ulan kanina, pero ngayon po kaonti na lang po.',
      timestamp: 'May 20, 2022 11:03:00',
      sender: 'Jek',
      mobile_no: '09123456789',
    },
    {
      id: 1,
      message: 'Sige po. Mag ingat po kayo jan mam.',
      timestamp: 'May 21, 2022 12:00:00',
      sender: 'Me',
      mobile_no: '',
    },
  ];

  const MessageRight = message => (
    <div style={{display: 'flex', justifyContent: 'flex-end', padding: 10}}>
      <div style={{marginRight: 10}}>
        <Box
          sx={{
            backgroundColor: '#b1b1b1',
            '&:hover': {
              backgroundColor: '#b1b1b1',
              opacity: [0.9, 0.8, 0.7],
            },
            padding: 1,
            borderRadius: 5,
          }}>
          <Typography variant="h6">{message.data.message}</Typography>
          <Typography variant="subtitle1" style={{textAlign: 'right'}}>
            {message.data.timestamp}
          </Typography>
        </Box>
      </div>
      <div>
        <Avatar
          sx={{bgcolor: 'gray'}}
          alt={message.data.sender}
          src="/broken-image.jpg"
        />
      </div>
    </div>
  );

  const MessageLeft = message => (
    <div style={{display: 'flex', justifyContent: 'flex-start', padding: 10}}>
      <div>
        <Avatar
          sx={{bgcolor: 'gray'}}
          alt={message.data.sender}
          src="/broken-image.jpg"
        />
      </div>
      <div style={{marginLeft: 10}}>
        <Box
          sx={{
            backgroundColor: '#b1b1b1',
            '&:hover': {
              backgroundColor: '#b1b1b1',
              opacity: [0.9, 0.8, 0.7],
            },
            padding: 1,
            borderRadius: 5,
          }}>
          <Typography variant="h6">{message.data.message}</Typography>
          <Typography variant="subtitle1">{message.data.timestamp}</Typography>
        </Box>
      </div>
    </div>
  );

  return (
    <Fragment>
      <Grid
        container
        justifyContent={'center'}
        alignItems={'left'}
        textAlign={'left'}
        padding={5}
        spacing={3}>
        <Grid item xs={3}>
          <Box
            style={{
              padding: 10,
              backgroundColor: '#b1b1b1',
              maxHeight: window.screen.height - 400,
              minHeight: 650,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 60,
            }}>
            <Grid container>
              <Grid item xs={12}>
                <h1 style={{textAlign: 'center'}}>Inbox</h1>
              </Grid>
              <Grid item xs={12}>
                <Paper
                  component="form"
                  sx={{p: '2px 4px', display: 'flex', alignItems: 'center'}}>
                  <InputBase
                    sx={{ml: 1, flex: 1}}
                    placeholder="Search contacts"
                    inputProps={{'aria-label': 'search contact number'}}
                  />
                  <IconButton
                    type="submit"
                    sx={{p: '10px'}}
                    aria-label="search">
                    <SearchIcon />
                  </IconButton>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row">
                  <Button
                    variant="text"
                    startIcon={<AddCircleOutlineIcon />}
                    fullWidth={true}
                    color="inherit">
                    Create new contact
                  </Button>
                  <Button
                    variant="text"
                    startIcon={<EditIcon />}
                    fullWidth={true}
                    color="inherit">
                    Edit existing contact
                  </Button>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <div style={{maxHeight: 450, overflowY: 'scroll'}}>
                  <List
                    sx={{
                      width: '100%',
                      maxWidth: 'true',
                      bgcolor: 'background.paper',
                    }}>
                    {DummyData.map((item, index) => (
                      <React.Fragment>
                        <ListItemButton
                          selected={selectedIndex === 0}
                          onClick={event => handleListItemClick(event, index)}>
                          <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                              <Avatar
                                sx={{bgcolor: 'gray'}}
                                alt={item.sender}
                                src="/broken-image.jpg"
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={item.sender}
                              secondary={
                                <React.Fragment>
                                  <Typography
                                    sx={{display: 'inline'}}
                                    component="span"
                                    variant="body2"
                                    color="text.primary">
                                    {item.mobile_no}
                                  </Typography>
                                  {` - ${item.message}`}
                                </React.Fragment>
                              }
                            />
                          </ListItem>
                        </ListItemButton>
                        <Divider variant="left" component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                </div>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Grid container>
            <Box
              sx={{
                width: '100%',
                bgcolor: 'background.paper',
                maxHeight: window.screen.height - 400,
                minHeight: 600,
                overflowY: 'scroll',
              }}>
              <Divider variant="left" />
              <Grid
                item
                xs={12}
                style={{maxHeight: window.screen.height - 400, minHeight: 600}}>
                {ConvoData.map(message =>
                  message.sender === 'Me' ? (
                    <MessageRight data={message} />
                  ) : (
                    <MessageLeft data={message} />
                  ),
                )}
              </Grid>
              <Divider variant="left" />
            </Box>
          </Grid>
          <Grid container>
            <Box sx={{width: '100%', bgcolor: 'background.paper'}}>
              <Grid item xs={12}>
                <TextField
                  id="input-with-icon-textfield"
                  label="Message"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        {message.length != 0 && (
                          <HighlightOffIcon onClick={() => setMessage('')} />
                        )}
                        <AttachmentIcon style={{padding: 5}} />
                        <SendIcon style={{padding: 5}} />
                      </InputAdornment>
                    ),
                  }}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  inputProps={{maxLength: 250}}
                  style={{width: '100%'}}
                  variant="standard"
                  multiline
                  helperText={`${characterLimit} characters left.`}
                />
              </Grid>
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={3}>
          <Box
            style={{
              padding: 10,
              backgroundColor: '#b1b1b1',
              maxHeight: window.screen.height - 400,
              minHeight: 650,
              borderTopLeftRadius: 60,
              borderTopRightRadius: 10,
            }}>
            <Grid container>
              <Grid item xs={12}>
                <h1 style={{textAlign: 'center'}}>Contact Information</h1>
              </Grid>
              <Grid item xs={12}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                  }}>
                  <Avatar
                    sx={{bgcolor: 'gray', width: 100, height: 100}}
                    alt={DummyData[selectedIndex].sender}
                    src="/broken-image.jpg"
                  />
                </div>
                <div style={{textAlign: 'center', padding: 20}}>
                  <Typography variant="h5">
                    {DummyData[selectedIndex].sender}
                  </Typography>
                  <Typography variant="h6">
                    {DummyData[selectedIndex].mobile_no}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={12}>
                <Accordion
                  style={{backgroundColor: '#b1b1b1', boxShadow: 'none'}}
                  expanded={expanded === 'media'}
                  onChange={handleChange('media')}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header">
                    <Grid
                      container
                      justifyContent={'center'}
                      alignItems={'center'}
                      textAlign={'left'}>
                      <Grid item xs={12} style={{width: '100%'}}>
                        <Typography variant="h5">Media</Typography>
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>Not available.</Typography>
                  </AccordionDetails>
                </Accordion>
                <Divider />
                <Accordion
                  style={{backgroundColor: '#b1b1b1', boxShadow: 'none'}}
                  expanded={expanded === 'files'}
                  onChange={handleChange('files')}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header">
                    <Grid
                      container
                      justifyContent={'center'}
                      alignItems={'center'}
                      textAlign={'left'}>
                      <Grid item xs={12} style={{width: '100%'}}>
                        <Typography variant="h5">Files</Typography>
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>Not available.</Typography>
                  </AccordionDetails>
                </Accordion>
                <Divider />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default Communication;

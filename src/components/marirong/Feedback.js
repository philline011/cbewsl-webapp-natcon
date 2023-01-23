import React, {Fragment, useState, useEffect} from 'react';
import {
  Grid,
  Typography,
  Button,
  Box,
  TextField,
  FormControl,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PromptModal from './modals/PromptModal';
import { saveFeedback } from '../../apis/Misc';

function Feedback() {
  const [issue, setIssue] = useState('');
  const [othersConcern, setOthersConcern] = useState('');
  const [concern, setConcern] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [sendButtonState, setSendButtonState] = useState(true);
  const [notif_message, setNotifMessage] = useState('');
  const [is_open_prompt_modal, setIsOpenPromptModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserLast, setCurrentUserLast] = useState(null);
  const [designation, setDesignation] = useState(null);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const handleValidation = messsage => {
    setNotifMessage(messsage);
    setIsOpenPromptModal(true);
  };

  const handleChange = event => {
    setIssue(event.target.value);
  };

  const resetValues = () => {
    setIssue('');
    setOthersConcern('');
    setConcern('');
    setSelectedImage('');
  };

  const handleSend = () => {
    setOpenBackdrop(!openBackdrop);
    const feedback_id = 0;
    const form_data = new FormData();
    form_data.append('feedback_id', feedback_id);
    form_data.append('file', selectedImage);
    form_data.append('issue', issue);
    form_data.append('concern', concern);
    form_data.append('other_concern', othersConcern);
    console.log('FORM DATA', form_data);
    saveFeedback(form_data, data => {
      const {status, feedback} = data;
      handleValidation(feedback);
      if (status === true) {
        resetValues();
      }
      setOpenBackdrop(false);
    });
  };

  useEffect(() => {
    const data = localStorage.getItem('credentials');
    const parse_data = JSON.parse(data);
    const first_name = parse_data.user.first_name;
    const last_name = parse_data.user.last_name;
    const designation = parse_data.profile.designation_details.designation;
    setCurrentUser(first_name);
    setCurrentUserLast(last_name);
    setDesignation(designation);
  }, []);

  useEffect(() => {
    if (selectedImage) {
      const file = URL.createObjectURL(selectedImage);
      setImageUrl(file);
    }
  }, [selectedImage]);

  useEffect(() => {
    if (issue === '' || concern === '') {
      setSendButtonState(true);
    } else {
      setSendButtonState(false);
    }
    return;
  }, [sendButtonState, issue, concern]);

  return (
    <Grid container sx={{padding: 8}}>
      <Grid item xs={12}>
        <Box elevato="true">
          <Typography variant="h4" sx={{marginBottom: 4}}>
            Feedback
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{minWidth: 275}}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography>
                  Reporter:
                    <Typography style={{fontWeight: 'bold', display: 'inline-flex', paddingLeft: 5}}> {`${currentUser} ${currentUserLast}`}</Typography>
                </Typography>
                <Typography>
                  Stakeholder's Group:
                  <Typography style={{fontWeight: 'bold', display: 'inline-flex', paddingLeft: 5}}>{designation}</Typography>
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Subject</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={issue}
                    required
                    label="Subject"
                    onChange={handleChange}>
                    <MenuItem value={''}>''</MenuItem>
                    <MenuItem value={'CBEWS-L Web app'}>
                      CBEWS-L Web app (concerns with the app, bugs, errors)
                    </MenuItem>
                    <MenuItem value={'Monitoring Operations'}>
                      Monitoring Operations (concerns with monitoring protocols)
                    </MenuItem>
                    <MenuItem value={'Suggestions'}>
                      Suggestions (user interface suggestions, feature requests
                      and edits)
                    </MenuItem>
                    <MenuItem value={'Others'}>Others</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {issue === 'Others' && (
                <Grid item xs={6}>
                  <TextField
                    id="standard-multiline-static"
                    multiline
                    placeholder="E.G. general question/s about CBEWS-L app"
                    variant="outlined"
                    style={{width: '100%'}}
                    value={othersConcern}
                    onChange={e => setOthersConcern(e.target.value)}
                  />
                </Grid>
              )}
              <Grid item xs={2} style={{alignSelf: 'center'}}>
                <Fragment>
                  <input
                    accept="image/*"
                    type="file"
                    id="select-image"
                    style={{display: 'none'}}
                    onChange={e => setSelectedImage(e.target.files[0])}
                  />
                  <label htmlFor="select-image">
                    <Button
                      variant="outlined"
                      component="span"
                      endIcon={<AddPhotoAlternateIcon />}>
                      Attach Image
                    </Button>
                  </label>
                </Fragment>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="standard-multiline-static"
                  label="Please describe/elaborate concern"
                  multiline
                  rows={10}
                  required
                  placeholder="E.g. Dashboard not working"
                  variant="outlined"
                  style={{width: '100%'}}
                  value={concern}
                  onChange={e => setConcern(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                {imageUrl && selectedImage && (
                  <Box mt={2} textAlign="center">
                    <div style={{marginBottom: 10}}>Preview:</div>
                    <img
                      src={imageUrl}
                      alt={selectedImage.name}
                      height="auto"
                      width="30%"
                    />
                  </Box>
                )}
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{justifyContent: 'flex-end'}}>
            <Button
              size="small"
              variant="contained"
              onClick={() => handleSend()}
              disabled={sendButtonState}>
              Submit Feedback
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <PromptModal
        isOpen={is_open_prompt_modal}
        setOpenModal={setIsOpenPromptModal}
        handleValidation={handleValidation}
        notifMessage={notif_message}
      />
      <Grid>
        <Backdrop
          sx={{color: '#fff', zIndex: theme => theme.zIndex.drawer + 9999}}
          open={openBackdrop}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Grid>
    </Grid>
  );
}

export default Feedback;
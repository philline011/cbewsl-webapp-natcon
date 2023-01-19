import React, {Fragment, useState, useEffect} from 'react';
import {Grid, Card, Typography, Divider, Chip} from '@mui/material';
import moment from 'moment';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ValidationModal from './modals/ValidationModal';
import NewAlertsModal from './modals/NewAlertsModal';
import PromptModal from './modals/PromptModal';
import AlertReleaseFormModal from './modals/AlertReleaseModal';
import DisseminateModal from './modals/DisseminateModal';
import NotificationSoundFolder from '../../audio/notif_sound.mp3';
import AccordionActions from '@mui/material/AccordionActions';
import { getLatestCandidatesAndAlerts } from '../../apis/AlertGeneration';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const OpCen = () => {
  const [latestCandidatesAndAlerts, setLatestCandidatesAndAlerts] = useState(null);
  const [candidateList, setCandidateList] = useState([]);
  const [alertLevel, setAlertLevel] = useState('3');
  const [alertTs, setAlertTs] = useState(moment().format('LLLL'));
  const [expanded, setExpanded] = React.useState(false);
  const [is_generated, setIsGenerated] = useState(false);
  const [is_open_validation_modal, setIsOpenValidationModal] = useState(false);
  const [is_open_new_alert_modal, setIsOpenNewAlertModal] = useState(false);
  const [is_open_prompt_modal, setIsOpenPromptModal] = useState(false);
  const [is_open_release_modal, setIsOpenReleaseModal] = useState(false);
  const [is_open_disseminate_modal, setIsOpenDisseminateModal] =
    useState(false);
  const [alert_trigger, setAlertTrigger] = useState('');
  const [notif_message, setNotifMessage] = useState('');
  const [triggers, setTriggers] = useState([]);
  const [monitoring_releases, setMonitoringReleases] = useState([]);

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleValidate = trigger => {
    setAlertTrigger(trigger);
    setIsOpenValidationModal(!is_open_validation_modal);
  };

  const handleValidation = messsage => {
    setIsOpenValidationModal(!is_open_validation_modal);
    setNotifMessage(messsage);
    setIsOpenPromptModal(true);
  };

  const handleRelease = trigger => {
    setAlertTrigger(trigger);
    setIsOpenReleaseModal(!is_open_release_modal);
  };

  const handleSubmitRelease = messsage => {
    setIsOpenValidationModal(false);
    setNotifMessage(messsage);
    setIsOpenPromptModal(true);
  };

  const handleDisseminate = data => {
    setIsOpenDisseminateModal(!is_open_disseminate_modal);
  };

  const handleSendSMS = () => {
    setIsOpenDisseminateModal(false);
    setNotifMessage('Disseminate success!');
    setIsOpenPromptModal(true);
    const initial_triggers = [
      {
        // trigger: 'Routine',
        trigger: 'Rainfall',
        // alert_level: 0,
        alert_level: 1,
        // tech_info: 'Routine monitoring',
        tech_info:
          'MARG (on-site raingauge) 1-day cumulative rainfall value (53mm) exceeded threshold (52.5mm)',
        date_time: 'September 07, 2022, 09:30 AM',
        site: 'Brgy. Marirong, Leon, Iloilo',
        validity_status: 0,
        id: 1,
        community_response: 'N/A',
        barangay_response: 'N/A',
        waray_tech_info: 'N/A',
        source: 'Leon MDRRMO',
      },
      {
        trigger: 'Surficial',
        alert_level: 2,
        tech_info:
          'Marker C: 10.5 cm difference in 17.25 hours; Marker E: 13.0 cm difference in 2.5 hours',
        date_time: 'September 07, 2022, 09:30 AM',
        site: 'Brgy. Marirong, Leon, Iloilo',
        validity_status: 0,
        id: 2,
        community_response: 'N/A',
        barangay_response: 'N/A',
        waray_tech_info: 'N/A',
        source: 'Leon MDRRMO',
      },
      {
        trigger: 'Subsurface',
        alert_level: 3,
        tech_info:
          'MARTA (Node 9, 10, 11, 12) has critical subsurface movement and exceeded velocity thresholds',
        date_time: 'September 07, 2022, 09:30 AM',
        site: 'Brgy. Marirong, Leon, Iloilo',
        validity_status: 0,
        id: 3,
        community_response: 'N/A',
        barangay_response: 'N/A',
        waray_tech_info: 'N/A',
        source: 'Leon MDRRMO',
      },
    ];
    setTriggers(initial_triggers);
    setMonitoringReleases([]);
  };

  const ProcessCandidate = (candidate) => {
    let temp = [];
    candidate.forEach(element => {
      element['trigger_list_arr'].forEach(el => {
        temp.push({
          trigger: el.trigger_type.toUpperCase(),
          alert_level: el.alert_level,
          tech_info: el.tech_info,
          date_time: el.ts_updated,
          site: 'Brgy. Marirong, Leon, Iloilo',
          validity_status: el.validating_status,
          id: el.trigger_id,
          community_response: '',
          barangay_response: '',
          waray_tech_info: '',
          source: element.site_code === 'mar' ? 'Leon, MDRRMO' : element.site_code,
        })
      });
    });
    setTriggers(temp);
    if (temp.length != 0) {
      // setIsOpenNewAlertModal(true);
      setIsGenerated(true);
    }
  }

  useEffect(()=> {
    getLatestCandidatesAndAlerts(setLatestCandidatesAndAlerts);
  }, []);

  useEffect(()=> {
    if (latestCandidatesAndAlerts != null) {
      ProcessCandidate(JSON.parse(latestCandidatesAndAlerts['candidate_alerts']));
      console.log(latestCandidatesAndAlerts);
    }
  }, [latestCandidatesAndAlerts]);

  const [audio] = useState(new Audio(NotificationSoundFolder));

  useEffect(() => {
    if (is_open_new_alert_modal) audio.play();
    else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [is_open_new_alert_modal]);

  return (
    <Fragment>
      <Grid
        container
        justifyContent={'center'}
        alignItems={'center'}
        textAlign={'center'}>
        <Grid item xs={12} style={{width: '100%', margin: 10}}>
          <Grid container spacing={1}>
            <Grid
              item
              xs={12}
              style={{
                alignSelf: 'center',
                marginTop: 8,
                justifyItems: 'center',
              }}>
              <Typography variant="h4">Current alert status</Typography>
              <Typography variant="h5">{alertTs}</Typography>
              <Divider variant="middle" style={{padding: 10}} />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  paddingTop: 20,
                }}>
                <Card
                  style={{
                    backgroundColor: 'red',
                    width: 500,
                  }}>
                  <Typography variant="h3">ALERT LEVEL {alertLevel}</Typography>
                </Card>
              </div>
              <Typography variant="h5">
                valid until September 08, 2022, 12:00 NN
              </Typography>
              <h3>Response (MDRRMO): N/A</h3>
              <h3>Response (LEWC at Barangay): N/A</h3>
              <h3>Response (Komunidad): N/A</h3>
              <Divider variant="middle" style={{paddingBottom: 10}} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} style={{width: '95%', marginLeft: 50, padding: 20}}>
        <Typography variant="h4">Alerts for validation</Typography>
        <Typography variant="h7" style={{marginLeft: 20}}>
          Check data analysis of current alerts for validation
        </Typography>
      </Grid>
      {triggers.map((row, index) => {
        const {
          trigger,
          alert_level,
          tech_info,
          date_time,
          validity_status,
          id,
        } = row;

        return (
          <Accordion
            style={{marginLeft: 70, marginRight: 70}}
            expanded={expanded === `panel_${id}`}
            onChange={handleChange(`panel_${id}`)}
            key={`panel_${id}`}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-content-${id}`}
              id={`panel-header-${id}`}>
              <Grid
                container
                justifyContent={'center'}
                alignItems={'center'}
                textAlign={'left'}>
                <Grid item xs={12} style={{width: '100%'}}></Grid>
                <Grid item xs={3}>
                  <Typography variant="h6">
                    {trigger} trigger - Alert level {alert_level}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Divider orientation="vertical" />
                </Grid>
                <Grid item xs={5}>
                  <Typography variant="h6">
                    Trigger timestamp: {date_time}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  {validity_status === -1 && (
                    <Chip
                      label="Invalid"
                      color="secondary"
                      style={{backgroundColor: 'red', float: 'right'}}
                    />
                  )}
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <br />
              <Grid container style={{textAlign: 'center'}}>
                <Grid item md={12}>
                  <Typography variant="body1">
                    {trigger} - Alert level {alert_level}
                  </Typography>

                  <br />
                </Grid>
                <Grid item md={6}>
                  <Typography variant="subtitle2">Date and Time</Typography>
                  <Typography variant="caption">{date_time}</Typography>
                </Grid>
                <Grid item md={6}>
                  <Typography variant="subtitle2">
                    Technical Information
                  </Typography>
                  <Typography variant="caption">{tech_info}</Typography>
                </Grid>
                <Grid item md={12}>
                  <Stack
                    spacing={1}
                    direction="row"
                    justifyContent="flex-end"
                    style={{marginTop: 20}}>
                    {(validity_status === 0 || validity_status === null) && (
                      <Button size="small" onClick={() => handleValidate(row)}>
                        Validate
                      </Button>
                    )}

                    {validity_status === 1 && (
                      <Button size="small" onClick={() => handleRelease(row)}>
                        Generate
                      </Button>
                    )}

                    {validity_status === -1 && (
                      <Button size="small" onClick={() => handleValidate(row)}>
                        Validate
                      </Button>
                    )}
                  </Stack>
                </Grid>
              </Grid>
              <br />
            </AccordionDetails>
          </Accordion>
        );
      })}
      <Grid
        item
        xs={12}
        style={{width: '95%', marginLeft: 50, padding: 10, marginTop: 30}}>
        <Typography variant="h4">Event Monitoring</Typography>
      </Grid>
      {monitoring_releases.length > 0 ? (
        monitoring_releases.map((row, index) => {
          const {
            trigger,
            alert_level,
            tech_info,
            date_time,
            validity_status,
            id,
          } = row;

          return (
            <Accordion
              style={{marginLeft: 70, marginRight: 70}}
              expanded={expanded === `event_panel_${id}`}
              onChange={handleChange(`event_panel_${id}`)}
              key={`event_panel_${id}`}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`event-panel-content-${id}`}
                id={`event-panel-header-${id}`}>
                <Grid
                  container
                  justifyContent={'center'}
                  alignItems={'center'}
                  textAlign={'left'}>
                  <Grid item xs={12} style={{width: '100%'}}></Grid>
                  <Grid item xs={3}>
                    <Typography variant="h6">
                      {trigger} trigger - Alert level {alert_level}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Divider orientation="vertical" />
                  </Grid>
                  <Grid item xs={5}>
                    <Typography variant="h6">
                      Trigger timestamp: {date_time}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    {validity_status === -1 && (
                      <Chip
                        label="Invalid"
                        color="secondary"
                        style={{backgroundColor: 'red', float: 'right'}}
                      />
                    )}
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <br />
                <Grid container style={{textAlign: 'center'}}>
                  <Grid item md={12}>
                    <Typography variant="body1">
                      {trigger} - Alert level {alert_level}
                    </Typography>

                    <br />
                  </Grid>
                  <Grid item md={6}>
                    <Typography variant="subtitle2">Date and Time</Typography>
                    <Typography variant="caption">{date_time}</Typography>
                  </Grid>
                  <Grid item md={6}>
                    <Typography variant="subtitle2">
                      Technical Information
                    </Typography>
                    <Typography variant="caption">{tech_info}</Typography>
                  </Grid>
                  <Grid item md={12}>
                    <Stack
                      spacing={1}
                      direction="row"
                      justifyContent="flex-end"
                      style={{marginTop: 20}}>
                      <Button
                        size="small"
                        onClick={() => handleDisseminate(row)}>
                        Disseminate
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
                <br />
              </AccordionDetails>
            </Accordion>
          );
        })
      ) : (
        <div>
          <Typography variant="body1" style={{textAlign: 'center'}}>
            No event monitoring
          </Typography>
        </div>
      )}
      <ValidationModal
        isOpen={is_open_validation_modal}
        setOpenModal={setIsOpenValidationModal}
        trigger={alert_trigger}
        triggers={triggers}
        setTriggers={setTriggers}
        handleValidation={handleValidation}
        setNotifMessage={setNotifMessage}
      />
      <AlertReleaseFormModal
        isOpen={is_open_release_modal}
        setOpenModal={setIsOpenReleaseModal}
        trigger={alert_trigger}
        triggers={triggers}
        setTriggers={setTriggers}
        handleSubmitRelease={handleSubmitRelease}
        setNotifMessage={setNotifMessage}
        monitoringReleases={monitoring_releases}
        setMonitoringReleases={setMonitoringReleases}
      />
      <NewAlertsModal
        isOpen={is_open_new_alert_modal}
        setOpenModal={setIsOpenNewAlertModal}
        setIsOpenValidationModal={setIsOpenValidationModal}
        triggers={triggers}
      />
      <PromptModal
        isOpen={is_open_prompt_modal}
        setOpenModal={setIsOpenPromptModal}
        handleValidation={handleValidation}
        notifMessage={notif_message}
      />
      <DisseminateModal
        isOpen={is_open_disseminate_modal}
        setOpenModal={setIsOpenDisseminateModal}
        trigger={alert_trigger}
        triggers={triggers}
        setTriggers={setTriggers}
        handleSendSMS={handleSendSMS}
        setNotifMessage={setNotifMessage}
        monitoringReleases={monitoring_releases}
        setMonitoringReleases={setMonitoringReleases}
      />
    </Fragment>
  );
};

export default OpCen;

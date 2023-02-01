import React, { Fragment, useState, useEffect } from 'react';
import { Grid, Card, Typography, Divider, Chip, Tooltip } from '@mui/material';
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
import {Cancel, Check, CheckCircle, Info} from '@material-ui/icons';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const alert_level_colors = [
  {alert_level: 0, color: '#c5e0b4'},
  {alert_level: 1, color: '#FCEE27'},
  {alert_level: 2, color: '#F8991D'},
  {alert_level: 3, color: '#FE0000'},
];

function capitalizeFirstLetter(str, every_word = false) {
  const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

  if (every_word) {
    const arr = str.split(' ');
    const cap_arr = arr.map(s => capitalize(s));

    return cap_arr.join(' ');
  }

  return capitalize(str);
}

function ExtendedAccordionPanel(props) {
  const {data, key, handleDisseminate} = props;
  const [header_color, setHeaderColor] = useState('');
  const [data_timestamp, setDataTimestamp] = useState(null);
  const [alert_level, setAlertLevel] = useState(0);
  const [ext_day, setExtDay] = useState(null);
  const [isMessageSend, setIsMessageSend] = useState(null);

  // const checkReleasedMessage = release_id => {
  //   getReleasedMessages(release_id, response => {
  //     const {status, data} = response;
  //     if (status) {
  //       setIsMessageSend(data ? true : false);
  //     }
  //   });
  // };

  useEffect(() => {
    if (data) {
      const {
        event,
        event_alert_id,
        internal_alert_level,
        releases,
        public_alert_symbol,
        is_onset_release,
        latest_event_triggers,
        ts_start,
        highest_event_alert_level,
        day,
      } = data;
      setExtDay(day);
      const {data_ts, release_id} = releases[0];
      // checkReleasedMessage(release_id);
      console.log(releases);
      setDataTimestamp(data_ts);
      const {alert_level: alertLevel} = public_alert_symbol;
      console.log(alertLevel);
      setAlertLevel(alertLevel);
      const colors = alert_level_colors.find(e => e.alert_level === alertLevel);
      setHeaderColor(colors.color);
    }
  }, [data]);

  return (
    <Fragment>
      <Accordion
        style={{marginLeft: 70, marginRight: 70, marginBottom: 70}}
        expanded={true}
        // onChange={handleChange(`pending_panel_${key}`)}
        key={`pending_panel_${key}`}>
        <AccordionSummary
          // expandIcon={<ExpandMoreIcon />}
          aria-controls={`pending-panel-content-${key}`}
          style={{backgroundColor: `${header_color}`}}
          id={`pending-panel-header-${key}`}>
          <Grid
            container
            justifyContent={'center'}
            alignItems={'center'}
            textAlign={'left'}>
            <Grid item xs={3}>
              <Typography variant="h6">
                {`Alert level ${alert_level}`}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              {data_timestamp && (
                <Typography variant="h6">
                  Data Timestamp: {moment(data_timestamp).format('LLL')}
                </Typography>
              )}
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <br />

          <Grid container spacing={4}>
            <Grid item md={12} style={{textAlign: 'center'}}>
              {ext_day && (
                <Typography variant="body1">
                  Day {ext_day} of 3-day extended monitoring
                </Typography>
              )}
            </Grid>
            <Grid item md={12}>
              <Tooltip
                title={
                  isMessageSend ? 'Warning sent!' : 'Please disseminate warning'
                }
                placement="top">
                <Button
                  onClick={() => handleDisseminate(data)}
                  size="small"
                  variant="contained"
                  color="success"
                  style={{
                    float: 'right',
                    marginTop: 50,
                    textTransform: 'none',
                  }}>
                  Disseminate Warning
                </Button>
              </Tooltip>
            </Grid>
          </Grid>

          <br />
        </AccordionDetails>
      </Accordion>
    </Fragment>
  );
}


function LatestAccordionPanel(props) {
  const { data, key, expanded, handleChange, handleDisseminate, isRoutine } =
    props;
  const [header_color, setHeaderColor] = useState(null);
  const [data_timestamp, setDataTimestamp] = useState(null);
  const [trig_source, setTriggerSource] = useState('');
  const [alert_validity, setAlertValidity] = useState(null);
  const [rel_id, setReleaseId] = useState(null);
  const [latest_rel_id, setLatestReleaseId] = useState(null);
  const [tech_info, setTechInfo] = useState(null);
  const [trig_ts, setTriggerTimestamp] = useState(null);
  const [alert_level, setAlertLevel] = useState(0);
  const [isMessageSend, setIsMessageSend] = useState(null);
  const [alert_general_status, setAlertGeneralStatus] = useState('');

  // const checkReleasedMessage = release_id => {
  //   getReleasedMessages(release_id, response => {
  //     const { status, data } = response;
  //     if (status) {
  //       setIsMessageSend(data ? true : false);
  //     }
  //   });
  // };

  useEffect(() => {
    if (isRoutine) {
      const { data_ts, release_id } = data;
      setDataTimestamp(data_ts);
      const colors = alert_level_colors.find(e => e.alert_level === 0);
      setHeaderColor(colors.color);
      setDataTimestamp(moment(data_ts).add(30, 'minutes').format('LLL'));
      data.isRoutine = true;
      data.public_alert_level = 0;
      setAlertLevel(0);
      // checkReleasedMessage(release_id);
      setAlertGeneralStatus('Routine');
    } else {
      if (data) {
        const {
          event,
          event_alert_id,
          internal_alert_level,
          releases,
          public_alert_symbol,
          is_onset_release,
          latest_event_triggers,
          ts_start,
          highest_event_alert_level,
          general_status,
        } = data;
        const { site, validity } = event;
        setAlertValidity(validity);
        console.log('latest_event_triggers', latest_event_triggers);
        const {
          info,
          internal_sym,
          ts: trigger_ts,
          release_id: latest_event_trigger_release_id,
        } = latest_event_triggers[0];
        const { alert_description, trigger_symbol } = internal_sym;
        const {
          trigger_hierarchy: { trigger_source },
        } = trigger_symbol;
        const { release_time, data_ts, trigger_list, release_id } = releases[0];
        setAlertGeneralStatus(general_status);
        // checkReleasedMessage(release_id);
        if (releases.length === 1) {
          setDataTimestamp(moment(data_ts).format('LLL'));
        } else {
          setDataTimestamp(moment(data_ts).add(30, 'minutes').format('LLL'));
        }
        setTriggerSource(trigger_source);
        setReleaseId(release_id);
        setLatestReleaseId(latest_event_trigger_release_id);
        setTechInfo(info);
        setTriggerTimestamp(trigger_ts);
        const { alert_level: alertLevel, alert_symbol } = public_alert_symbol;
        console.log(alertLevel);
        setAlertLevel(alertLevel);
        const colors = alert_level_colors.find(
          e => e.alert_level === alertLevel,
        );
        setHeaderColor(colors.color);
      }
    }
  }, [data]);

  return (
    <Accordion
      style={{ marginLeft: 70, marginRight: 70, marginBottom: 70 }}
      expanded={true}
      onChange={handleChange(`event_panel_${key}`)}
      key={`event_panel_${key}`}>
      <AccordionSummary
        style={{ backgroundColor: `${header_color}` }}
        aria-controls={`event-panel-content-${key}`}
        id={`event-panel-header-${key}`}>
        <Grid
          container
          justifyContent={'center'}
          alignItems={'center'}
          textAlign={'left'}>
          <Grid item xs={12} style={{ width: '100%' }}></Grid>
          <Grid item xs={2}>
            <Typography variant="h6">Alert level {alert_level}</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography variant="h6" style={{ textAlign: 'center' }}>
              Date and Time: {data_timestamp}
            </Typography>
            {!isRoutine && (
              <Typography variant="h6" style={{ textAlign: 'center' }}>
                Validity: {moment(alert_validity).format('LLL')}
              </Typography>
            )}
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" style={{ float: 'right' }}>
              {alert_general_status ? alert_general_status : 'Ongoing'}
            </Typography>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <br />

        {!isRoutine && latest_rel_id === rel_id ? (
          <Grid container style={{ textAlign: 'center' }}>
            <Grid item md={3}>
              <Typography variant="h6">Trigger</Typography>
              <Typography>{capitalizeFirstLetter(trig_source)}</Typography>
            </Grid>
            <Grid item md={3}>
              <Typography variant="h6">Trigger timestamp</Typography>
              <Typography>{moment(trig_ts).format('LLL')}</Typography>
            </Grid>
            <Grid item md={6}>
              <Typography variant="h6">Technical Information</Typography>
              <Typography>{tech_info}</Typography>
            </Grid>
            <Grid item md={12}>
              <Stack
                spacing={1}
                direction="row"
                justifyContent="flex-end"
                style={{ marginTop: 20 }}>
                <Tooltip
                  title={
                    isMessageSend
                      ? 'Warning sent!'
                      : 'Please disseminate warning'
                  }
                  placement="top">
                  <Button
                    size="small"
                    variant="contained"
                    style={{ textTransform: 'none' }}
                    startIcon={isMessageSend ? <Check /> : <Info />}
                    onClick={() => handleDisseminate(data)}>
                    Disseminate Warning
                  </Button>
                </Tooltip>
              </Stack>
            </Grid>
          </Grid>
        ) : (
          <Grid container style={{ textAlign: 'center' }}>
            <Grid item md={12}>
              <Typography>
                {isMessageSend ? 'Warning sent!' : 'Please disseminate warning'}
              </Typography>
            </Grid>
            <Grid item md={12}>
              <Stack
                spacing={1}
                direction="row"
                justifyContent="flex-end"
                style={{ marginTop: 20 }}>
                <Tooltip
                  title={
                    isMessageSend
                      ? 'Warning sent!'
                      : 'Please disseminate warning'
                  }
                  placement="top">
                  <Button
                    size="small"
                    style={{ textTransform: 'none' }}
                    variant="contained"
                    startIcon={isMessageSend ? <Check /> : <Info />}
                    onClick={() => handleDisseminate(data)}>
                    Disseminate Warning
                  </Button>
                </Tooltip>
              </Stack>
            </Grid>
          </Grid>
        )}
        <br />
      </AccordionDetails>
    </Accordion>
  );
}

const OpCen = () => {
  const [latestCandidatesAndAlerts, setLatestCandidatesAndAlerts] = useState(null);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [candidateList, setCandidateList] = useState([]);
  const [alertLevel, setAlertLevel] = useState(0);
  const [validityLabel, setValidityLabel] = useState(null);
  const [alertTs, setAlertTs] = useState(moment().format('LLLL'));
  const [expanded, setExpanded] = React.useState(false);
  const [is_generated, setIsGenerated] = useState(false);
  const [is_open_validation_modal, setIsOpenValidationModal] = useState(false);
  const [is_open_new_alert_modal, setIsOpenNewAlertModal] = useState(false);
  const [is_open_prompt_modal, setIsOpenPromptModal] = useState(false);
  const [is_open_release_modal, setIsOpenReleaseModal] = useState(false);
  const [is_open_disseminate_modal, setIsOpenDisseminateModal] = useState(false);
  const [alert_trigger, setAlertTrigger] = useState('');
  const [notif_message, setNotifMessage] = useState('');
  const [triggers, setTriggers] = useState([]);
  const [monitoring_releases, setMonitoringReleases] = useState(null);

  const [ewiTemplate, setTemplate] = useState([]);
  const [mdrrmoResponse, setMdrrmoResponse] = useState("N/A");
  const [lewcResponse, setLewcResponse] = useState("N/A");
  const [komunidadResponse, setKomunidadResponse] = useState("N/A");

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
      if (element.hasOwnProperty('trigger_list_arr')) {
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
      }
    });
    setTriggers(temp);
    if (temp.length != 0) {
      // setIsOpenNewAlertModal(true);
      setIsGenerated(true);
    }
  }

  useEffect(() => {
    getLatestCandidatesAndAlerts(setLatestCandidatesAndAlerts);
  }, []);

  useEffect(() => {
    if (latestCandidatesAndAlerts != null) {
      setCandidateList(JSON.parse(latestCandidatesAndAlerts['candidate_alerts']));
      setMonitoringReleases(JSON.parse(latestCandidatesAndAlerts['on_going']));
      ProcessCandidate(JSON.parse(latestCandidatesAndAlerts['candidate_alerts']));
      setTemplate(latestCandidatesAndAlerts['ewi_templates'])
    }
  }, [latestCandidatesAndAlerts]);

  useEffect(()=> {
    if (monitoring_releases) {
      if (monitoring_releases.latest.length != 0 || monitoring_releases.overdue.length !=0) {
        getCurrentAlert(monitoring_releases);
      }
    }
  }, [monitoring_releases]);

  const getCurrentAlert = () => {
    console.log("monitoring_releases:", monitoring_releases);
    if (monitoring_releases.latest.length != 0 ) {

    } else {
      setAlertLevel(monitoring_releases.overdue[0].highest_event_alert_level);
      setValidityLabel(moment(monitoring_releases.overdue[0].event.validity).format("LLL"));
      console.log("ewiTemplate:", ewiTemplate);
      let template = ewiTemplate.find(x => x.alert_level == monitoring_releases.overdue[0].highest_event_alert_level);
      if (template != -1) {
        // setMdrrmoResponse(template.);
        setLewcResponse(template.barangay_response);
        setKomunidadResponse(template.commmunity_response);
      }
    }
  }

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
        <Grid item xs={12} style={{ width: '100%', margin: 10 }}>
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
              <Divider variant="middle" style={{ padding: 10 }} />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  paddingTop: 20,
                }}>
                <Card
                  style={{
                    backgroundColor: alert_level_colors.find(e => e.alert_level === alertLevel).color ,
                    width: 500,
                  }}>
                  <Typography variant="h3">ALERT LEVEL {alertLevel}</Typography>
                </Card>
              </div>
              <Typography variant="h5">
                {
                  validityLabel ? `valid until ${validityLabel}` : ""
                }
                
              </Typography>
              <h3>Response (MDRRMO): {mdrrmoResponse}</h3>
              <h3>Response (LEWC at Barangay): {lewcResponse}</h3>
              <h3>Response (Komunidad): {komunidadResponse}</h3>
              <Divider variant="middle" style={{ paddingBottom: 10 }} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} style={{ width: '95%', marginLeft: 50, padding: 20 }}>
        <Typography variant="h4">Alerts for validation</Typography>
        <Typography variant="h7" style={{ marginLeft: 20 }}>
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
            style={{ marginLeft: 70, marginRight: 70 }}
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
                <Grid item xs={12} style={{ width: '100%' }}></Grid>
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
                      style={{ backgroundColor: 'red', float: 'right' }}
                    />
                  )}
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <br />
              <Grid container style={{ textAlign: 'center' }}>
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
                    style={{ marginTop: 20 }}>
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
        style={{ width: '95%', marginLeft: 50, padding: 10, marginTop: 30 }}>
        <Typography variant="h4">Event Monitoring</Typography>
      </Grid>
      {monitoring_releases != undefined && monitoring_releases.hasOwnProperty('latest') ? (
        monitoring_releases.latest.length != 0 ?
          monitoring_releases.latest.map((row, index) => {
              return (
                <LatestAccordionPanel
                  data={row}
                  key={index}
                  handleChange={handleChange}
                  handleDisseminate={handleDisseminate}
                  expanded={expanded}
                />
              );
            })
          :
          <div>
            <Typography
              variant="body1"
              style={{ textAlign: 'center', marginBottom: 30 }}>
              No event monitoring
            </Typography>
          </div>
      ) : (
        <div>
          <Typography
            variant="body1"
            style={{ textAlign: 'center', marginBottom: 30 }}>
            No event monitoring
          </Typography>
        </div>
      )}
{/* 

      {monitoring_releases != undefined && monitoring_releases.hasOwnProperty('routine') && monitoring_releases.routine.released_sites.length > 0 && (
        <Grid
          item
          xs={12}
          style={{width: '95%', marginLeft: 50, padding: 10, marginTop: 30}}>
          <Typography variant="h4">Routine Monitoring</Typography>
        </Grid>
      )}

      {monitoring_releases != undefined && monitoring_releases.hasOwnProperty('routine') && monitoring_releases.routine.released_sites.length > 0 &&
        monitoring_releases.routine.released_sites.map((row, index) => {
          return (
            <LatestAccordionPanel
              data={row}
              key={index}
              handleChange={handleChange}
              handleDisseminate={handleDisseminate}
              expanded={expanded}
              isRoutine={true}
            />
          );
        })}

      {monitoring_releases != undefined && monitoring_releases.hasOwnProperty('extended') && monitoring_releases.extended.length > 0 && (
        <Grid
          item
          xs={12}
          style={{width: '95%', marginLeft: 50, padding: 10, marginTop: 30}}>
          <Typography variant="h4">Extended Monitoring</Typography>
        </Grid>
      )}

      {monitoring_releases != undefined && monitoring_releases.hasOwnProperty('extended') && monitoring_releases.extended.length > 0 &&
        monitoring_releases.extended.map((row, index) => {
          return (
            <ExtendedAccordionPanel
              data={row}
              key={index}
              handleChange={handleChange}
              handleDisseminate={handleDisseminate}
              expanded={expanded}
            />
          );
        })} */}


      <ValidationModal
        isOpen={is_open_validation_modal}
        setOpenModal={setIsOpenValidationModal}
        trigger={alert_trigger}
        triggers={triggers}
        setTriggers={setTriggers}
        getLatestCandidatesAndAlerts={getLatestCandidatesAndAlerts}
        setLatestCandidatesAndAlerts={setLatestCandidatesAndAlerts}
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
        candidateList={candidateList}
        setMonitoringReleases={setMonitoringReleases}
        getLatestCandidatesAndAlerts={getLatestCandidatesAndAlerts}
        setLatestCandidatesAndAlerts={setLatestCandidatesAndAlerts}
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

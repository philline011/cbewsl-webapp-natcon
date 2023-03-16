import React, { Fragment, useState, useEffect } from 'react';
import { Grid, Card, Typography, Divider, Chip, Tooltip, responsiveFontSizes } from '@mui/material';
import moment from 'moment';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ValidationModal from './modals/ValidationModal';
import NewAlertsModal from './modals/NewAlertsModal';
import PromptModal from './modals/PromptModal';
import AlertReleaseFormModal from './modals/AlertReleaseModal';
import DisseminateModal from './modals/DisseminateModal';
import NotificationSoundFolder from '../../audio/notif_sound.mp3';
import { useNavigate } from 'react-router-dom';

// import {
//   getCandidateAlert,
//   sendMessage,
//   getReleasedMessages,
//   getTempMoms,
//   getContacts,
// } from '../../apis/AlertGeneration';

import { Cancel, Check, CheckCircle, Info, Landscape } from '@material-ui/icons';
import UpdateMomsModal from './modals/UpdateMomsModal';
import OnDemandModal from './modals/OnDemandModal';

const alert_level_colors = [
  { alert_level: 0, color: '#c5e0b4' },
  { alert_level: 1, color: '#FCEE27' },
  { alert_level: 2, color: '#F8991D' },
  { alert_level: 3, color: '#FE0000' },
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

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TempMomsTable(props) {
  const { momsData, setSelectedMomsData, setIsOpenUpdateMomsModal } = props;
  const [moms_list, setMomsList] = useState([]);

  useEffect(() => {
    if (momsData) {
      let temp = [];
      momsData.forEach((row, index) => {
        const { moms_list } = row;
        if (moms_list.length > 0) {
          temp.push(row);
        }
      });

      console.log(temp);
      setMomsList(temp);
    }
  }, []);

  const selectMoms = data => {
    console.log(data);
    setSelectedMomsData(data);
    setIsOpenUpdateMomsModal(true);
  };

  return (
    <Grid container>
      <Grid item md={12}>
        <TableContainer
          component={Paper}
          style={{
            width: 'auto',
            marginLeft: 70,
            marginRight: 70,
            marginBottom: 70,
          }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Feature Type</TableCell>
                <TableCell align="left">Feature Name</TableCell>
                <TableCell align="left">Observance Timestamp</TableCell>
                <TableCell align="left">Details</TableCell>
                <TableCell align="left">Location</TableCell>
                <TableCell align="left">Remarks</TableCell>
                <TableCell align="left">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {moms_list.length > 0 &&
                moms_list.map((row, index) => {
                  const { uploads, moms_list, temp_moms_id } = row;
                  return moms_list.map((moms_row, index) => {
                    const {
                      feature_type,
                      feature_name,
                      observance_ts,
                      remarks,
                      location,
                      report_narrative,
                    } = moms_row;
                    return (
                      <TableRow
                        key={temp_moms_id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell align="left">{feature_type}</TableCell>
                        <TableCell align="left">{feature_name}</TableCell>
                        <TableCell align="left">
                          {moment(observance_ts).format('LLL')}
                        </TableCell>
                        <TableCell align="left">{remarks}</TableCell>
                        <TableCell align="left">{location}</TableCell>
                        <TableCell align="left">{report_narrative}</TableCell>
                        <TableCell align="left">
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => selectMoms(row)}>
                            Validate
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  });
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}

function HeaderAlertInformation(props) {
  const { onGoingData, routineData, ewiTemplates } = props;
  const [alert_level, setAlertLevel] = useState(0);
  const [data_timestamp, setDataTimestamp] = useState(moment().format('LLL'));
  const [latest_triggers, setLatestTriggers] = useState([]);
  const [reponses, setResponses] = useState({
    barangay_reponse: '',
    community_reponse: '',
  });
  const [validity, setValidity] = useState(null);

  useEffect(() => {
    console.log('ON GOING', onGoingData);
    if (onGoingData.length > 0) {
      console.log('with data');
      const { highest_event_alert_level, latest_event_triggers } = onGoingData[0];
      setAlertLevel(highest_event_alert_level);
      const template = ewiTemplates.find(
        e => e.alert_level === highest_event_alert_level,
      );
      setResponses(template);
      const triggers = latest_event_triggers.map((row, index) => {
        const { internal_sym, trigger_misc } = row;
        const { trigger_symbol } = internal_sym;
        const { trigger_hierarchy } = trigger_symbol;
        const { trigger_source } = trigger_hierarchy;
        let template = ewiTemplates.find(e => e.trigger === trigger_source && e.alert_level === highest_event_alert_level);
        if (trigger_source === "on demand") {
          const { on_demand } = trigger_misc;
          const { eq_id } = on_demand;
          if (eq_id) {
            template = ewiTemplates.find(e => e.alert_level === highest_event_alert_level && e.trigger === "earthquake");
          } else {
            template = ewiTemplates.find(e => e.alert_level === highest_event_alert_level && e.trigger === "rainfall");
          }
        }
        if (template) {
          return template
        }
      });
      console.log(triggers);
      setLatestTriggers(triggers);
    } else {
      if (ewiTemplates.length > 0) {
        const template = ewiTemplates.find(e => e.alert_level === 0);
        setResponses(template);
        console.log(template)
        setLatestTriggers([template]);
        setAlertLevel(0);
      }
      // setValidity(`valid until ${moment().format("LLL")}`)
    }
  }, [onGoingData]);

  return (

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
            <Typography variant="h5">{data_timestamp}</Typography>
            <Divider variant="middle" style={{ padding: 10 }} />
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                paddingTop: 20,
              }}>
              <Card
                style={{
                  backgroundColor: alert_level_colors.find(e => e.alert_level === alert_level).color,
                  width: 500,
                }}>
                <Typography variant="h3">ALERT LEVEL {alert_level}</Typography>
              </Card>
            </div>
            <Typography variant="h5">
              {
                validity ? `valid until ${validity}` : ""
              }

            </Typography>
            <h3>Response (MDRRMO): {reponses.municipyo_response ? reponses.municipyo_response : `N/A`}</h3>
            <h3>Response (LEWC at Barangay): {reponses.barangay_response ? reponses.barangay_response : `N/A`}</h3>
            <h3>Response (Komunidad): {reponses.commmunity_response ? reponses.commmunity_response : `N/A`}</h3>
            <Divider variant="middle" style={{ paddingBottom: 10 }} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

function ExtendedAccordionPanel(props) {
  const { data, key, handleDisseminate } = props;
  const [header_color, setHeaderColor] = useState('');
  const [data_timestamp, setDataTimestamp] = useState(null);
  const [alert_level, setAlertLevel] = useState(0);
  const [ext_day, setExtDay] = useState(null);
  const [isMessageSend, setIsMessageSend] = useState(null);

  // const checkReleasedMessage = release_id => {
  //   getReleasedMessages(release_id, response => {
  //     const { status, data } = response;
  //     if (status) {
  //       setIsMessageSend(data ? true : false);
  //     }
  //   });
  // };
  useEffect(() => {
    console.log('EXTENDED DATA', data);
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
      const { data_ts, release_id } = releases[0];
      // checkReleasedMessage(release_id);
      console.log(releases);
      setDataTimestamp(data_ts);
      const { alert_level: alertLevel } = public_alert_symbol;
      console.log(alertLevel);
      setAlertLevel(alertLevel);
      const colors = alert_level_colors.find(e => e.alert_level === alertLevel);
      setHeaderColor(colors.color);
    }
  }, [data]);

  return (
    <Fragment>
      <Accordion
        style={{ marginLeft: 70, marginRight: 70, marginBottom: 70 }}
        expanded={true}
        // onChange={handleChange(`pending_panel_${key}`)}
        key={`pending_panel_${key}`}>
        <AccordionSummary
          // expandIcon={<ExpandMoreIcon />}
          aria-controls={`pending-panel-content-${key}`}
          style={{ backgroundColor: `${header_color}` }}
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
            <Grid item md={12} style={{ textAlign: 'center' }}>
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

function PendingAccordionPanel(props) {
  const {
    data,
    key,
    expanded,
    handleChange,
    navigate,
    setTriggers,
    setIsOpenValidationModal,
    setAlertTrigger,
    handleRelease,
  } = props;
  const {
    trigger_list_arr,
    release_details,
    general_status,
    public_alert_level,
  } = data;
  let data_timestamp;
  if (release_details) {
    const { data_ts } = release_details;
    data_timestamp = data_ts;
  }

  const charts = ['subsurface', 'surficial', 'rainfall', 'earthquake'];
  const [disable_generate_button, setDisableGenerateButton] = useState(true);
  const [header_color, setHeaderColor] = useState('');

  const viewChart = chart => {
    const url = `${window.location.origin}${chart}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openValidateModal = trigger => {
    console.log(trigger);
    setIsOpenValidationModal(true);
    setAlertTrigger(trigger);
  };

  useEffect(() => {
    if (general_status === 'routine' || general_status === 'extended') {
      setDisableGenerateButton(false);
    }

    if (trigger_list_arr) {
      const button_status = trigger_list_arr.find(
        e => e.validating_status === null || e.validating_status === 0,
      );
      setDisableGenerateButton(button_status);
    }
    const colors = alert_level_colors.find(
      e => e.alert_level === public_alert_level,
    );
    setHeaderColor(colors.color);
  }, [data]);

  return (
    <Fragment>
      <Accordion
        style={{ marginLeft: 70, marginRight: 70, marginBottom: 70 }}
        expanded={true}
        // onChange={handleChange(`pending_panel_${key}`)}
        key={`pending_panel_${key}`}>
        <AccordionSummary
          // expandIcon={<ExpandMoreIcon />}
          aria-controls={`pending-panel-content-${key}`}
          style={{ backgroundColor: `${header_color}` }}
          id={`pending-panel-header-${key}`}>
          <Grid
            container
            justifyContent={'center'}
            alignItems={'center'}
            textAlign={'left'}>
            <Grid item xs={4}>
              <Typography variant="h6">
                {`Alert level ${public_alert_level}`}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              {data_timestamp && (
                <Typography variant="h6">
                  Data Timestamp: {moment(data_timestamp).format('LLL')}
                </Typography>
              )}
            </Grid>
            <Grid item xs={2}>
              {general_status && (
                <Typography variant="h6" style={{ float: 'right' }}>
                  {capitalizeFirstLetter(general_status)}
                </Typography>
              )}
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <br />
          {trigger_list_arr && trigger_list_arr.length > 0 ? (
            trigger_list_arr.map((row, index) => {
              const { tech_info, trigger_type, ts_updated, validating_status } =
                row;
              const has_chart = charts.includes(trigger_type);
              return (
                <Grid container style={{ textAlign: 'center', marginBottom: 15 }}>
                  <Grid item md={2}>
                    <Typography variant="h6">Trigger</Typography>
                    <Typography>
                      {capitalizeFirstLetter(trigger_type)}
                    </Typography>
                  </Grid>
                  <Grid item md={3}>
                    <Typography variant="h6">Trigger timestamp</Typography>
                    <Typography>{moment(ts_updated).format('LLL')}</Typography>
                  </Grid>
                  <Grid item md={5}>
                    <Typography variant="h6">Technical Information</Typography>
                    <Typography>{tech_info}</Typography>
                    {has_chart && (
                      <Button
                        size="small"
                        variant="contained"
                        style={{ marginTop: 5 }}
                        onClick={() => viewChart(`/${trigger_type}`)}>
                        View Chart
                      </Button>
                    )}
                  </Grid>
                  <Grid item md={2} style={{ alignSelf: 'center' }}>
                    {(validating_status === null ||
                      validating_status === 0) && (
                        <Chip
                          icon={<Info />}
                          label="Validate"
                          clickable
                          color="primary"
                          onClick={() => openValidateModal(row)}
                        />
                      )}

                    {validating_status === 1 && (
                      <Chip
                        icon={<CheckCircle />}
                        label="Valid"
                        color="success"
                        onClick={() => openValidateModal(row)}
                      />
                    )}

                    {validating_status === -1 && (
                      <Chip
                        icon={<Cancel />}
                        label="Invalid"
                        clickable
                        color="error"
                        onClick={() => openValidateModal(row)}
                      />
                    )}
                  </Grid>
                </Grid>
              );
            })
          ) : (
            <Grid container style={{ textAlign: 'center' }}>
              <Grid item md={12}>
                {general_status === 'routine' ? (
                  <Typography variant="body1" style={{ textAlign: 'center' }}>
                    Please release routine monitoring
                  </Typography>
                ) : (
                  <Typography variant="body1" style={{ textAlign: 'center' }}>
                    {general_status === 'extended'
                      ? 'Please generate warning for extended monitoring.'
                      : 'No new triggers.'}
                  </Typography>
                )}
              </Grid>
            </Grid>
          )}
          <Grid container spacing={4}>
            <Grid item md={12}>
              <Button
                onClick={() => handleRelease(data)}
                size="small"
                variant="contained"
                color="success"
                disabled={disable_generate_button}
                style={{ float: 'right', marginTop: 50, textTransform: 'none' }}>
                Generate Warning
              </Button>
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
        if (latest_event_triggers.length > 0) {
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
function OpCen2(props) {
  const [alertLevel, setAlertLevel] = useState('1');
  const [alertTs, setAlertTs] = useState(moment().format('LLLL'));
  const [expanded, setExpanded] = React.useState(false);
  const [is_validated, setIsValidated] = useState(false);
  const [is_open_validation_modal, setIsOpenValidationModal] = useState(false);
  const [is_open_new_alert_modal, setIsOpenNewAlertModal] = useState(false);
  const [is_open_prompt_modal, setIsOpenPromptModal] = useState(false);
  const [is_open_release_modal, setIsOpenReleaseModal] = useState(false);
  const [is_open_disseminate_modal, setIsOpenDisseminateModal] =
    useState(false);
  const [alert_trigger, setAlertTrigger] = useState('');
  const [disseminate_data, setDisseminateData] = useState('');
  const [notif_message, setNotifMessage] = useState('');
  const [triggers, setTriggers] = useState([]);
  const [monitoring_releases, setMonitoringReleases] = useState([]);
  const [is_open_update_moms_modal, setIsOpenUpdateMomsModal] = useState(false);
  const [moms_data, setMomsData] = useState(null);
  const [selected_moms_data, setSelectedMomsData] = useState(null);

  const [candidate_alerts, setCandidateAlerts] = useState([]);
  const [on_going_alerts, setOnGoingAlerts] = useState([]);
  const [extended_alerts, setExtendedAlerts] = useState([]);
  const [routine, setRoutine] = useState({ released_sites: [] });
  const [cbewsl_ewi_template, setEwiTemplates] = useState([]);
  const [alert_variant, setAlertVariant] = useState('success');
  const [all_contacts, setAllContacts] = useState([]);
  const [current_user, setCurrentUser] = useState([]);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [is_open_ondemand_modal, setIsOpenOndemandModal] = useState(false);

  const navigate = useNavigate();
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
    trigger.is_event_valid = true;
    trigger.is_manually_lowered = false;
    setAlertTrigger(trigger);
    setIsOpenReleaseModal(!is_open_release_modal);
  };

  const handleSubmitRelease = (messsage, status) => {
    setIsOpenValidationModal(false);
    setNotifMessage(messsage);
    setIsOpenPromptModal(true);
    setAlertVariant(status ? 'success' : 'error');
  };

  const handleDisseminate = data => {
    setDisseminateData(data);
    setIsOpenDisseminateModal(!is_open_disseminate_modal);
  };

  // const generateDashboardData = () => {
  //   getCandidateAlert(data => {
  //     console.log(data);
  //     const { candidate_alerts, on_going, ewi_templates } = data;
      // setCandidateAlerts([JSON.parse(candidate_alerts)[1]]);

  //     const temp_candidate = JSON.parse(candidate_alerts);
  //     const temp_on_going = JSON.parse(on_going);
  //     const { latest, overdue, extended, routine: routine_data } = temp_on_going;
  //     let temp = [];
  //     temp.push(...latest);
  //     temp.push(...overdue);
  //     setOnGoingAlerts(temp);
  //     if (!routine_data.released_sites) {
  //       routine_data.released_sites = [];
  //     }
  //     setRoutine(routine_data);
  //     setEwiTemplates(ewi_templates);
  //     setExtendedAlerts(extended);
  //     if (extended.length > 0) {
  //       const extended_site = extended.find(e => e.event.site.site_id);
  //       if (extended_site) {
  //         setCandidateAlerts(
  //           temp_candidate.filter(e => e.general_status === 'extended'),
  //         );
  //       }
  //     } else {
  //       setCandidateAlerts(temp_candidate);
  //     }
  //   });
  // };

  // const generateMomsForValidation = () => {
  //   getTempMoms(data => {
  //     setMomsData(data);
  //   });
  // };

  // const getAllContacts = () => {
  //   getContacts(data => {
  //     setAllContacts(data);
  //   });
  // };

  const handleSendSMS = message => {
    setOpenBackdrop(!openBackdrop);
    console.log(disseminate_data);
    let alert_release_id;
    if (disseminate_data.isRoutine) {
      alert_release_id = disseminate_data.release_id;
    } else {
      const { releases } = disseminate_data;
      const { release_id } = releases[0];
      alert_release_id = release_id;
    }

    const recipient_user_ids = [];
    all_contacts.data.map(obj => {
      const {
        user: { user_id },
      } = obj;
      if (!recipient_user_ids.includes(user_id)) {
        recipient_user_ids.push(user_id);
      }
    });
    const {
      profile: { user_id },
    } = current_user;
    const input = {
      sender_user_id: user_id,
      recipient_user_ids,
      msg: message,
      release_id: alert_release_id,
      release_details: JSON.stringify([disseminate_data]),
    };

    console.log(input);

    // sendMessage(input, callback => {
    //   const { status, feedback } = callback;
    //   setNotifMessage(feedback);
    //   if (status) {
    //     setIsOpenDisseminateModal(false);
    //     setIsOpenPromptModal(true);
    //     setAlertVariant('success');
    //     generateDashboardData();
    //   } else {
    //     setAlertVariant('error');
    //     setIsOpenPromptModal(true);
    //   }
    //   setOpenBackdrop(false);
    // });
  };

  const openOnDemandForm = () => {
    setIsOpenOndemandModal(true);
  }

  // useEffect(() => {
  //     if (is_validated) {
  //         generateDashboardData();
  //         setIsValidated(false)
  //     }
  // }, [is_validated])

  const [audio] = useState(new Audio(NotificationSoundFolder));
  useEffect(() => {
    console.log(is_open_new_alert_modal);
    if (is_open_new_alert_modal) audio.play();
    else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [is_open_new_alert_modal]);

  // useEffect(() => {
  //   generateDashboardData();
  //   generateMomsForValidation();
  //   getAllContacts();
  //   const data = localStorage.getItem('data');
  //   setCurrentUser(JSON.parse(data));
  // }, []);

  useEffect(() => {
    console.log('candidate_alerts', candidate_alerts);
    console.log('on_going_alerts', on_going_alerts);
    console.log('extended_alerts', extended_alerts);
    console.log('routine', routine);
    console.log('ewi', cbewsl_ewi_template);
  }, [candidate_alerts, on_going_alerts, extended_alerts, cbewsl_ewi_template]);

  return (
    <Fragment>
      <HeaderAlertInformation
        onGoingData={on_going_alerts}
        routineData={routine}
        ewiTemplates={cbewsl_ewi_template}
      />

      {moms_data && moms_data.length > 0 && (
        <Grid item xs={12} style={{ width: '95%', marginLeft: 50, padding: 10 }}>
          <Typography variant="h4">Landslide Features Validation</Typography>
        </Grid>
      )}

      {moms_data && moms_data.length > 0 && (
        <TempMomsTable
          momsData={moms_data}
          setSelectedMomsData={setSelectedMomsData}
          setIsOpenUpdateMomsModal={setIsOpenUpdateMomsModal}
        />
      )}
      <Grid item xs={12} style={{ width: '95%', marginLeft: 50, padding: 10, alignItems: "center" }}>
        <Grid container>
          <Grid item md={6}>
            <Typography variant="h4">Pending Alert Validation</Typography>
          </Grid>
          <Grid item md={6}>
            <div>
              <Button
                variant="contained"
                size="small"
                onClick={openOnDemandForm}
                endIcon={<Landscape />} style={{ marginLeft: 5, float: "right", backgroundColor: '#2E2D77'}}>
                Release On-demand
              </Button>
            </div>
          </Grid>
        </Grid>
      </Grid>
      {candidate_alerts.length > 0 ? (
        candidate_alerts.map((row, index) => {
          return (
            <PendingAccordionPanel
              data={row}
              handleChange={handleChange}
              expanded={expanded}
              navigate={navigate}
              setTriggers={setTriggers}
              setAlertTrigger={setAlertTrigger}
              setIsOpenValidationModal={setIsOpenValidationModal}
              handleRelease={handleRelease}
            />
          );
        })
      ) : (
        <div>
          <Typography variant="body1" style={{ textAlign: 'center' }}>
            No pending alerts
          </Typography>
        </div>
      )}
      <Grid
        item
        xs={12}
        style={{ width: '95%', marginLeft: 50, padding: 10, marginTop: 30 }}>
        <Typography variant="h4">Event Monitoring</Typography>
      </Grid>
      {on_going_alerts.length > 0 ? (
        on_going_alerts.map((row, index) => {
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
      ) : (
        <div>
          <Typography
            variant="body1"
            style={{ textAlign: 'center', marginBottom: 30 }}>
            No event monitoring
          </Typography>
        </div>
      )}

      {routine.released_sites.length > 0 && (
        <Grid
          item
          xs={12}
          style={{ width: '95%', marginLeft: 50, padding: 10, marginTop: 30 }}>
          <Typography variant="h4">Routine Monitoring</Typography>
        </Grid>
      )}

      {routine.released_sites.length > 0 &&
        routine.released_sites.map((row, index) => {
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

      {extended_alerts.length > 0 && (
        <Grid
          item
          xs={12}
          style={{ width: '95%', marginLeft: 50, padding: 10, marginTop: 30 }}>
          <Typography variant="h4">Extended Monitoring</Typography>
        </Grid>
      )}

      {extended_alerts.length > 0 &&
        extended_alerts.map((row, index) => {
          return (
            <ExtendedAccordionPanel
              data={row}
              key={index}
              handleChange={handleChange}
              handleDisseminate={handleDisseminate}
              expanded={expanded}
            />
          );
        })}

      <Grid>
        <Backdrop
          sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 99999 }}
          open={openBackdrop}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Grid>

      <ValidationModal
        isOpen={is_open_validation_modal}
        setOpenModal={setIsOpenValidationModal}
        trigger={alert_trigger}
        triggers={triggers}
        setTriggers={setTriggers}
        alertTrigger={alert_trigger}
        handleValidation={handleValidation}
        setNotifMessage={setNotifMessage}
        capitalizeFirstLetter={capitalizeFirstLetter}
        setIsValidated={setIsValidated}
        // generateDashboardData={generateDashboardData}
      />
      <AlertReleaseFormModal
        isOpen={is_open_release_modal}
        setOpenModal={setIsOpenReleaseModal}
        trigger={alert_trigger}
        latest_overdue
        handleSubmitRelease={handleSubmitRelease}
        setNotifMessage={setNotifMessage}
        monitoringReleases={monitoring_releases}
        setMonitoringReleases={setMonitoringReleases}
        // generateDashboardData={generateDashboardData}
        capitalizeFirstLetter={capitalizeFirstLetter}
      />
      <NewAlertsModal
        isOpen={is_open_new_alert_modal}
        setOpenModal={setIsOpenNewAlertModal}
        setIsOpenValidationModal={setIsOpenValidationModal}
        triggers={triggers}
        candidateAlertsData={candidate_alerts}
        capitalizeFirstLetter={capitalizeFirstLetter}
      />
      <PromptModal
        isOpen={is_open_prompt_modal}
        setOpenModal={setIsOpenPromptModal}
        handleValidation={handleValidation}
        notifMessage={notif_message}
        alertVariant={alert_variant}
      />
      <DisseminateModal
        isOpen={is_open_disseminate_modal}
        setOpenModal={setIsOpenDisseminateModal}
        disseminateData={disseminate_data}
        triggers={triggers}
        setTriggers={setTriggers}
        handleSendSMS={handleSendSMS}
        setNotifMessage={setNotifMessage}
        monitoringReleases={monitoring_releases}
        setMonitoringReleases={setMonitoringReleases}
        capitalizeFirstLetter={capitalizeFirstLetter}
        ewiTemplates={cbewsl_ewi_template}
      />
      <UpdateMomsModal
        isOpen={is_open_update_moms_modal}
        setOpenModal={setIsOpenUpdateMomsModal}
        selectedMomsData={selected_moms_data}
        setSelectedMomsData={setSelectedMomsData}
        // generateMomsForValidation={generateMomsForValidation}
        setNotifMessage={setNotifMessage}
        setAlertVariant={setAlertVariant}
        setIsOpenPromptModal={setIsOpenPromptModal}
      />
      <OnDemandModal
        isOpen={is_open_ondemand_modal}
        setOpenModal={setIsOpenOndemandModal}
        // generateDashboardData={generateDashboardData}
      />
    </Fragment>
  );
}

export default OpCen2;
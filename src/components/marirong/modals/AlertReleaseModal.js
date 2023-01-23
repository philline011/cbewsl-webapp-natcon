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
} from '@mui/material';
import React, {Fragment, useState, useEffect} from 'react';
import { generateAlert } from "../../../apis/AlertGeneration";
import moment from 'moment';

function AlertReleaseFormModal(props) {
  const {
    isOpen,
    trigger,
    setOpenModal,
    handleSubmitRelease,
    monitoringReleases,
    setMonitoringReleases,
    candidateList,
    setTriggers,
    triggers,
  } = props;

  const releaseAlert = () => {
    setOpenModal(false);
    handleSubmitRelease('Alert generation success!');
    let temp = monitoringReleases;
    let current_trigger = {...trigger};
    current_trigger.release_id = current_trigger.id;
    temp.push(current_trigger);
    setMonitoringReleases(temp);
    let current_triggers = triggers.filter(e => e.id !== current_trigger.id);
    setTriggers(current_triggers);
    let temp_alert = candidateList[0];
    temp_alert.is_event_valid = true;
    temp_alert.is_manually_lowered = false;

    if (temp_alert.public_alert_level !== 0) {
      temp_alert.release_details.release_time = moment().format('HH:mm');
      temp_alert.release_details.with_retrigger_validation = false;
      temp_alert.release_details.comments = '';
    } else {
      try {
        temp_alert.release_details.release_time = moment().format('HH:mm');
        temp_alert.release_details.with_retrigger_validation = false;
        temp_alert.release_details.comments = '';
      } catch (e) {
        console.log(e);
        temp_alert.release_time = moment().format('HH:mm');
        temp_alert.with_retrigger_validation = false;
      }
    }
    generateAlert(temp_alert);
  };


  return (
    <Dialog
      fullWidth
      fullScreen={false}
      open={isOpen}
      aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Generate Alert</DialogTitle>
      <DialogContent>
        <Grid container style={{textAlign: 'center'}}>
          <Grid item md={12}>
            <Typography variant="body1">
              {trigger.trigger} - Alert level {trigger.alert_level}
            </Typography>

            <br />
          </Grid>
          <Grid item md={6}>
            <Typography variant="subtitle2">Trigger timestamp</Typography>
            <Typography variant="caption">{trigger.date_time}</Typography>
          </Grid>
          <Grid item md={6}>
            <Typography variant="subtitle2">Technical Information</Typography>
            <Typography variant="caption">{trigger.tech_info}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={releaseAlert} color="primary">
          Generate Alert
        </Button>
        <Button onClick={() => setOpenModal(false)} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AlertReleaseFormModal;

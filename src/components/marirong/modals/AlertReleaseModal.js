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
    generateAlert(candidateList[0]);
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

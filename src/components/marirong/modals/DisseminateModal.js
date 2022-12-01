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

function DisseminateModal(props) {
    const { isOpen, trigger, setOpenModal, handleSendSMS, monitoringReleases, setMonitoringReleases, setTriggers, triggers } = props;

    const releaseEWISms = () => {
        handleSendSMS()
    }

  const downloadEWISms = () => {
    handleSendSMS();
  };

  return (
    <Dialog
      fullWidth
      fullScreen={false}
      open={isOpen}
      aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Disseminate</DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item md={12}>
            <Typography variant="body1">
              <b>Alert level:</b> {trigger.alert_level}
            </Typography>
            <br />
            <Typography variant="body1">
              <b>Lugar:</b> {trigger.site}
            </Typography>
            <br />
            <Typography variant="body1">
              <b>Petsa at oras:</b> {trigger.date_time}
            </Typography>
            <br />
            <Typography variant="body1">
              <b>Bakit ({trigger.trigger}):</b> {trigger.waray_tech_info}
            </Typography>
            <br />
            <Typography variant="body1">
              <b>Responde (komunidad):</b> {trigger.community_response}
            </Typography>
            <br />
            <Typography variant="body1">
              <b>Responde (LEWC ngan barangay):</b> {trigger.barangay_response}
            </Typography>
            <br />
            <Typography variant="body1">
              <b>Source:</b> {trigger.source}
            </Typography>
            <br />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={downloadEWISms} color="primary">
          Download
        </Button>
        <Button onClick={() => setOpenModal(false)} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DisseminateModal;

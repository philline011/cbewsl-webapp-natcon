import {
    Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, Button, Typography, TextField, Divider,
    Grid
} from '@mui/material';
import React, { Fragment, useState, useEffect } from 'react';


function NewAlertsModal(props) {
    const { isOpen, triggers, setOpenModal, setIsOpenValidationModal } = props;

    const closeModal = () => {
        setOpenModal(false);
        setIsOpenValidationModal(false);
    }

    return (
        <Dialog
            fullWidth
            fullScreen={false}
            open={isOpen}
            aria-labelledby="form-dialog-title"

        >
            <DialogTitle id="form-dialog-title">New Alerts</DialogTitle>
            <DialogContent>
                {
                    triggers.map((row, index) => {
                        const { trigger, alert_level, tech_info, date_time, id } = row;

                        return (
                            <Fragment key={`new_alert_${id}`}>
                                <br />
                                <Grid container style={{ textAlign: "center" }}>
                                    <Grid item md={12}>
                                        <Typography variant="body1">{trigger} - Alert level {alert_level}</Typography>

                                        <br />
                                    </Grid>
                                    <Grid item md={6}>
                                        <Typography variant="subtitle2">Date and Time</Typography>
                                        <Typography variant="subtitle2">{date_time}</Typography>
                                    </Grid>
                                    <Grid item md={6}>
                                        <Typography variant="subtitle2">Technical Information</Typography>
                                        <Typography variant="caption">{tech_info}</Typography>
                                    </Grid>
                                </Grid>
                                <br />
                                <Divider />
                            </Fragment>
                        );
                    })
                }

            </DialogContent>
            <DialogActions>
                <Button onClick={closeModal} color="primary">
                    Close & Validate
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default NewAlertsModal;
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography, TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import React, { Fragment, useState, useEffect } from 'react';
import moment from 'moment';
import { updateAlertStatus } from '../../../apis/MoMs';

function ValidationModal(props) {
    const { isOpen, trigger, setOpenModal, handleValidation, triggers, setIsValidated, alertTrigger, capitalizeFirstLetter } = props;
    const [remarks, setRemarks] = useState("");
    const invalidAlert = () => {
        setOpenModal(false);
        const input = {
            remarks,
            alert_status: -1,
            trigger_id: alertTrigger.trigger_id,
            user_id: 19,
            trigger_ts: `${moment(alertTrigger.ts_updated).format("YYYY-MM-DD HH:MM:00")}`
        }
        console.log(input)
        updateAlertStatus(input, data => {
            setOpenModal(false);
            console.log(data)
            handleValidation("Invalid alert success!");
            setRemarks("");
            setIsValidated(true)
        })

    }

    const validatingAlert = () => {
        setOpenModal(false);
        const input = {
            remarks,
            alert_status: 0,
            trigger_id: alertTrigger.trigger_id,
            user_id: 19,
            trigger_ts: `${moment(alertTrigger.ts_updated).format("YYYY-MM-DD HH:MM:00")}`
        }
        console.log(input)
        updateAlertStatus(input, data => {
            setOpenModal(false);
            console.log(data)
            handleValidation("Validating alert success!");
            setRemarks("");
            setIsValidated(true)
        })
    }

    const validAlert = () => {
        const input = {
            remarks,
            alert_status: 1,
            trigger_id: alertTrigger.trigger_id,
            user_id: 19,
            trigger_ts: `${moment(alertTrigger.ts_updated).format("YYYY-MM-DD HH:MM:00")}`
        }
        console.log(input)
        updateAlertStatus(input, data => {
            setOpenModal(false);
            console.log(data)
            handleValidation("Valid alert success!");
            setRemarks("");
            setIsValidated(true)
        })
    }
    return (
        <Dialog
            fullWidth
            fullScreen={false}
            open={isOpen}
            aria-labelledby="form-dialog-title"

        >
            <DialogTitle id="form-dialog-title">{`Validate Alert`}
                <IconButton
                    aria-label="close"
                    onClick={()=> {setOpenModal(false)}}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1" style={{ marginBottom: 10 }}>{capitalizeFirstLetter(alertTrigger.trigger_type ? alertTrigger.trigger_type : '-')} - Alert level {trigger.alert_level}</Typography>
                <Typography variant="subtitle2">{alertTrigger.tech_info}</Typography>
                <TextField id="standard-basic" label="Remarks" fullWidth style={{ marginTop: 10 }} onChange={e => setRemarks(e.target.value)} />
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={validatingAlert} color="primary">
                    Validating
                </Button>
                <Button variant="contained" onClick={invalidAlert} color="error">
                    Invalid
                </Button>
                <Button variant="contained" onClick={() => validAlert("Alert validation success!")} color="success">
                    Valid
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ValidationModal;
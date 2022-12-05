import {
    Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, Button, Typography, TextField, Divider,
    Grid,
    Alert
} from '@mui/material';
import React, { Fragment, useState, useEffect } from 'react';


function PromptModal(props) {
    const { isOpen, setOpenModal, notifMessage, error, title } = props;

    const closeModal = () => {
        setOpenModal(false);
    }
    return (
        <Dialog
            fullWidth
            fullScreen={false}
            open={isOpen}
            aria-labelledby="form-dialog-title"
            disableEnforceFocus

        >
            <DialogTitle id="form-dialog-title">{(title != undefined) ? `${title}` : "Alert"}</DialogTitle>
            <DialogContent>
                <Fragment>
                    <Alert severity={(error != undefined && error == true) ? "error" : "success"}>{notifMessage}</Alert>
                </Fragment>

            </DialogContent>
            <DialogActions>
                <Button onClick={closeModal} color="secondary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default PromptModal;
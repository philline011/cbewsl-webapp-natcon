import {
    Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, Button, Typography, TextField, Divider,
    Grid,
    Alert
} from '@mui/material';
import React, { Fragment, useState, useEffect } from 'react';


function PromptModal(props) {
    const { isOpen, setOpenModal, notifMessage, error, title, confirmation, callback } = props;

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
                    <Alert severity={
                        (error != undefined && error == true) ? "error" 
                        : (confirmation != undefined && confirmation == true) ? "warning" 
                        : "success"}>
                            {notifMessage}
                    </Alert>
                </Fragment>
            </DialogContent>
            {(confirmation!=undefined && confirmation == true) ? 
            <DialogActions>
                <Button
                    color="primary"
                    onClick={()=>{
                        callback(true)
                        closeModal()
                    }} 
                >
                    Yes
                </Button>
                <Button
                    color="primary"
                    onClick={()=>{
                        callback(false)
                        closeModal()
                    }} 
                >
                    No
                </Button>
            </DialogActions>
           
            :
            <DialogActions>
                <Button onClick={closeModal} color="secondary">
                    Close
                </Button>
            </DialogActions>
            }
        </Dialog>
    )
}

export default PromptModal;
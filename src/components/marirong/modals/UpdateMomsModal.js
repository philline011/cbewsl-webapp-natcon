import {
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
    Button, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Grid
} from '@mui/material';
import React, { Fragment, useState, useEffect } from 'react';
import moment from 'moment';
import { updateMoms } from '../../../apis/MoMs';

function UpdateMomsModal(props) {
    const {
        isOpen, setOpenModal, selectedMomsData, setSelectedMomsData,
        generateMomsForValidation, setNotifMessage, generateDashboardData,
        setAlertVariant, setIsOpenPromptModal } = props;
    const [alert_level, setAlertLevel] = useState(0);

    const updateMomsInfo = () => {
        const moms_list = selectedMomsData.moms_list[0]
        moms_list.alert_level = parseInt(alert_level);

        const input = {
            site_code: selectedMomsData.site_code,
            temp_moms_id: selectedMomsData.temp_moms_id,
            uploads: selectedMomsData.uploads,
            moms_list: [moms_list]
        }
        console.log(input);
        updateMoms(input, data => {
            console.log(data)
            const { status } = data;
            setAlertVariant(status ? "success" : "error");
            if (status) {
                generateDashboardData();
                generateMomsForValidation();
                setNotifMessage("Successfully validated landslide feature!");
                setIsOpenPromptModal(true);
                cancelValidate();
            } else {
                setNotifMessage("Something went wrong, Please contact the developers.")
            }
        })
    }

    const cancelValidate = () => {
        setOpenModal(false);
        setSelectedMomsData(null);
    }
    return (
        <Dialog
            fullWidth
            fullScreen={false}
            open={isOpen}
            aria-labelledby="form-dialog-title"

        >
            <DialogTitle id="form-dialog-title">Validate landslide feature alert level</DialogTitle>
            <DialogContent>
                {
                    selectedMomsData && (
                        <Fragment>
                            <Grid container>
                                <Grid item md={12}>
                                    <FormControl fullWidth style={{ marginTop: 10 }}>
                                        <InputLabel id="alert-level">Alert level</InputLabel>
                                        <Select
                                            labelId="alert-level-label"
                                            id="alert-level"
                                            value={alert_level}
                                            label="Alert level"
                                            onChange={e => setAlertLevel(e.target.value)}
                                        >
                                            <MenuItem value={0}>Alert level 0</MenuItem>
                                            <MenuItem value={2}>Alert level 2</MenuItem>
                                            <MenuItem value={3}>Alert level 3</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            {selectedMomsData.moms_list.length > 0 && (
                                selectedMomsData.moms_list.map((row, index) => {
                                    const {
                                        feature_name, feature_type, file_name,
                                        reporter, validator, remarks, report_narrative,
                                        observance_ts, location,
                                    } = row;
                                    let files = file_name.split(",")
                                    return (
                                        <Grid container style={{ textAlign: "center", marginTop: 20 }}>
                                            <Grid item md={6}>
                                                <Typography variant="body1" gutterBottom>
                                                    Feature type
                                                </Typography>
                                                <Typography variant="body2" gutterBottom>
                                                    {feature_type}
                                                </Typography>
                                            </Grid>
                                            <Grid item md={6}>
                                                <Typography variant="body1" gutterBottom>
                                                    Feature name
                                                </Typography>
                                                <Typography variant="body2" gutterBottom>
                                                    {feature_name}
                                                </Typography>
                                            </Grid>
                                            {
                                                location !== "" && (
                                                    <Grid item md={6} style={{ marginTop: 20 }}>
                                                        <Typography variant="body1" gutterBottom>
                                                            Location
                                                        </Typography>
                                                        <Typography variant="body2" gutterBottom>
                                                            {location}
                                                        </Typography>
                                                    </Grid>
                                                )
                                            }
                                            <Grid item md={location !== "" ? 6 : 12} style={{ marginTop: 20 }}>
                                                <Typography variant="body1" gutterBottom>
                                                    Observation timestamp
                                                </Typography>
                                                <Typography variant="body2" gutterBottom>
                                                    {moment(observance_ts).format("LLL")}
                                                </Typography>
                                            </Grid>
                                            {
                                                files.length > 0 && (
                                                    <Grid item md={12} container style={{ marginTop: 20, textAlign: "center" }}>
                                                        {
                                                            files.map((file, index) => {
                                                                if (file !== "") {
                                                                    return (
                                                                        <Grid item md={12}>
                                                                            <img
                                                                                src={`${`http://127.0.0.1:7000`}/moms/${file}`}
                                                                                alt={file}
                                                                                height="auto"
                                                                                width="100%"
                                                                            />
                                                                        </Grid>
                                                                    )
                                                                }
                                                            })
                                                        }
                                                    </Grid>
                                                )
                                            }
                                            <Grid item md={6} style={{ marginTop: 20 }}>
                                                <Typography variant="body1" gutterBottom>
                                                    Landslide feature details
                                                </Typography>
                                                <Typography variant="body2" gutterBottom>
                                                    {report_narrative}
                                                </Typography>
                                            </Grid>
                                            <Grid item md={6} style={{ marginTop: 20 }}>
                                                <Typography variant="body1" gutterBottom>
                                                    Narrative of observation
                                                </Typography>
                                                <Typography variant="body2" gutterBottom>
                                                    {remarks}
                                                </Typography>
                                            </Grid>
                                            <Grid item md={6} style={{ marginTop: 20 }}>
                                                <Typography variant="body1" gutterBottom>
                                                    Reporter
                                                </Typography>
                                                <Typography variant="body2" gutterBottom>
                                                    {reporter}
                                                </Typography>
                                            </Grid>
                                            <Grid item md={6} style={{ marginTop: 20 }}>
                                                <Typography variant="body1" gutterBottom>
                                                    Validator
                                                </Typography>
                                                <Typography variant="body2" gutterBottom>
                                                    {validator}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    )
                                })
                            )}
                        </Fragment>
                    )
                }
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={cancelValidate} color="error">
                    Cancel
                </Button>
                <Button variant="contained" onClick={updateMomsInfo} color="success">
                    Validate
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default UpdateMomsModal;
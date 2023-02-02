import {
    Dialog, DialogTitle,
    DialogContent, DialogContentText,
    DialogActions, Button,
    Typography, TextField,
    Grid, FormControl,
    FormLabel, RadioGroup,
    FormControlLabel,
    Radio, Checkbox,
    InputLabel, Select,
    MenuItem
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import React, { Fragment, useState, useEffect } from 'react';
import moment from 'moment';
import { sendMessage, insertOnDemandToDb, getEarthquakeEventsForLast24hrs, checkLatestSiteEventIfHasOnDemand } from '../../../apis/MoMs';

function OnDemandModal(props) {
    const { isOpen, setOpenModal, generateDashboardData } = props;
    const [alert_level, setAlertLevel] = useState("");
    const [request_ts, setRequestTs] = useState("");
    const [reason, setReason] = useState("");
    const [tech_info, setTechInfo] = useState("");
    const [has_on_demand, setHasOnDemand] = useState(false);
    const [trigger_type, setTrigerType] = useState("");
    const [earthquake_events, setEarthquakeEvents] = useState("");
    const [earthquake_id, setEarthquakeId] = useState("0");

    const releaseOnDemand = () => {
        const input = {
            alert_level,
            approved_by: "MLGU",
            eq_id: parseInt(earthquake_id) === 0 ? null : parseInt(earthquake_id),
            request_ts: moment(request_ts).format("YYYY-MM-DD HH:mm:ss"),
            reason,
            tech_info: reason,
            reporter_id: 1232,
            site_id: 29,
        }
        console.log("input", input)
        insertOnDemandToDb(input, response => {
            const { status, message } = response;
            if (status) {
                generateDashboardData();
            }
        });
    }

    const handleChangeAlertLevel = event => {
        const { value } = event.target;
        setAlertLevel(value);
        if (value === "0") {
            setReason("");
        }
    };

    const haddleTriggerType = event => {
        const { value } = event.target;
        setTrigerType(value);
        setEarthquakeId("0");
    };

    useEffect(() => {
        const json_data = {
            start_ts: moment().format("YYYY-MM-DD HH:mm:ss"),
            end_ts: moment().subtract(1, "days")
                .format("YYYY-MM-DD HH:mm:ss")
        };
        getEarthquakeEventsForLast24hrs(json_data, response => {
            console.log(response);
            const eq_alerts = response.find(e => e.eq_id === parseInt(earthquake_id) && e.eq_alerts.length > 0);
            setEarthquakeEvents(response);
        });
        checkLatestSiteEventIfHasOnDemand(29, result => {
            setHasOnDemand(result.has_on_demand);
        });
    }, []);

    useEffect(() => {

        if (earthquake_id !== "" && earthquake_events.length > 0) {
            const selected_eq_event = earthquake_events.find(e => e.eq_id === parseInt(earthquake_id));
            console.log(selected_eq_event)
            if (selected_eq_event) {
                const { province, magnitude } = selected_eq_event;
                setReason(`Earthquake in ${province} with Magnitude ${parseFloat(magnitude)}`);
            }
        }
    }, [earthquake_id, earthquake_events])

    useEffect(() => {
        console.log(trigger_type, alert_level)
    }, [trigger_type, alert_level]);
    return (
        <Dialog
            fullWidth
            fullScreen={false}
            open={isOpen}
            aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Release on-demand warning</DialogTitle>
            <DialogContent>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <FormControl component="fieldset" style={{ display: "flex", marginTop: 16 }}>
                            <FormLabel component="legend" style={{ textAlign: "center", marginBottom: 8 }}>
                                On-demand options
                            </FormLabel>

                            <RadioGroup
                                aria-label="choose_alert_level"
                                name="choose_alert_level"
                                value={alert_level}
                                onChange={handleChangeAlertLevel}
                                row
                                style={{ justifyContent: "space-around" }}
                            >
                                <FormControlLabel
                                    value="1"
                                    control={<Radio color="primary" />}
                                    label="Raise/Extend Alert"
                                    key="d1"
                                />

                                {
                                    has_on_demand && <FormControlLabel
                                        value="0"
                                        control={<Radio color="primary" />}
                                        label="Lower/End Alert"
                                        key="d"
                                    />
                                }

                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <FormControl component="fieldset" style={{ display: "flex", marginTop: 16 }}>
                            <FormLabel component="legend" style={{ textAlign: "center", marginBottom: 8 }}>
                                Trigger type
                            </FormLabel>

                            <RadioGroup
                                aria-label="choose_trigger_type"
                                name="choose_trigger_type"
                                value={trigger_type}
                                onChange={haddleTriggerType}
                                row
                                style={{ justifyContent: "space-around" }}
                            >
                                <FormControlLabel
                                    value="rain"
                                    control={<Radio color="primary" />}
                                    label="Rainfall"
                                    key="rain"
                                />
                                <FormControlLabel
                                    value="eq"
                                    control={<Radio color="primary" />}
                                    label="Earthquake"
                                    key="eq"
                                />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    {trigger_type === "eq" && (
                        <Grid item xs={12} sm={12} md={12} lg={12} style={{ alignSelf: "center", textAlign: "center" }}>
                            <InputLabel id="demo-simple-select-label">Earthquake events</InputLabel>
                            <Select
                                labelId="eq-event-select-standard-label"
                                id="eq-event-select-standard"
                                value={earthquake_id}
                                onChange={e => setEarthquakeId(e.target.value)}
                                fullWidth
                            >
                                <MenuItem value="0">
                                    <em>None</em>
                                </MenuItem>
                                {
                                    earthquake_events.length > 0 && (
                                        earthquake_events.map((row, index) => {
                                            const { magnitude, ts, province, eq_id } = row;
                                            const timestamp = moment(ts).format("LLL");
                                            return (
                                                <MenuItem value={`${eq_id}`} key={index}>{timestamp} @ {province} with Magnitude {parseFloat(magnitude)}</MenuItem>
                                            );
                                        })
                                    )
                                }
                            </Select>
                        </Grid>
                    )
                    }
                    <Grid item xs={12} sm={12} md={12} lg={12} style={{ marginTop: 10 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                renderInput={(props) => <TextField {...props} style={{ width: "100%" }} />}
                                label="Date and Time"
                                value={request_ts}
                                onChange={(newValue) => {
                                    setRequestTs(newValue);
                                }}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} style={{ marginTop: 10 }}>
                        <TextField
                            multiline
                            rows={4}
                            value={reason}
                            onChange={event => setReason(event.target.value)}
                            id="outlined-basic" label="Reason" variant="outlined" fullWidth />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={() => setOpenModal(false)}
                    color="error">
                    Cancel
                </Button>
                <Button variant="contained" onClick={releaseOnDemand} color="primary">
                    Release On-demand
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default OnDemandModal;
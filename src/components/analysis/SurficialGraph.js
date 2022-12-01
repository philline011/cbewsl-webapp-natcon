import React, {useState, useEffect, Fragment, useRef} from 'react';
// import { Route, Link } from "react-router-dom";

import Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
// import { useSnackbar } from "notistack";

import {
  Button,
  ButtonGroup,
  Paper,
  withMobileDialog,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Typography,
  Divider,
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import {ArrowDropDown} from '@material-ui/icons';
import {isWidthDown} from '@material-ui/core/withWidth';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import SurficialTrendingGraphs from '../utils/SurficialTrendingGraph';
// import { SlideTransition, FadeTransition } from "../utils/TransitionList";
import PromptModal from '../umingan/modals/PromptModal';

// import { getSurficialPlotData, deleteSurficialData, updateSurficialData, saveChartSVG } from "../ajax";
// import { computeForStartTs } from "../../../UtilityFunctions";

// init the module
HC_exporting(Highcharts);

const hideTrending = history => e => {
  e.preventDefault();
  history.goBack();
};

function UpdateDeleteModal(props) {
  const {
    editModal,
    fullScreen,
    setEditModal,
    siteCode,
    setRedrawChart,
    chosenPoint,
    updateDeletAction,
    setOpenModal,
  } = props;
  const {is_open, ts, name, measurement, mo_id, data_id} = editModal;
  const {ts: chosen_ts, measurement: chosen_meas} = chosenPoint;

  // const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [is_delete_clicked, setDeleteClick] = useState(false);
  const [delete_quantity, setDeleteQuantity] = useState('one');
  const changeRadioValueFn = x => setDeleteQuantity(x.target.value);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    setDeleteClick(false);
  }, [is_open]);

  const changeHandlerFn = (prop, value) => x => {
    console.log('here');
    let fin_val = value;
    if (prop === 'ts') fin_val = x;
    else if (prop === 'measurement') fin_val = x.target.value;

    setEditModal({
      ...editModal,
      [prop]: fin_val,
    });
  };

  const actionHandler = action => {
    updateDeletAction(action);
    setOpenModal(true);

    document.body.style.overflow = 'auto';
  };

  return (
    <Dialog
      fullWidth
      fullScreen={fullScreen}
      open={is_open}
      aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Update surficial data</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Carefully edit the necessary fields or delete entries if needed.
        </DialogContentText>

        <Grid container spacing={2}>
          <Grid item xs={12} style={{textAlign: 'center'}}>
            <Typography variant="subtitle1" style={{fontWeight: 'bold'}}>
              {siteCode.toUpperCase()} - Marker {name}
            </Typography>
            <Typography variant="body2">
              Timestamp: {moment(chosen_ts).format('DD MMMM YYYY, HH:mm:ss')}
            </Typography>
            <Typography variant="body2">
              Measurement: {chosen_meas} cm
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" style={{fontWeight: 'bold'}}>
              EDIT
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Change marker data measurement"
              value={measurement}
              onChange={changeHandlerFn('measurement')}
              type="number"
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            Change observation timestamp (applies to the rest of the points)
          </Grid>

          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Grid item xs={12}>
              <KeyboardDateTimePicker
                required
                autoOk
                label="Observation Timestamp"
                value={moment(ts)}
                onChange={changeHandlerFn('ts')}
                ampm={false}
                placeholder="2010/01/01 00:00"
                format="YYYY/MM/DD HH:mm"
                mask="__/__/____ __:__"
                clearable
                disableFuture
                fullWidth
              />
            </Grid>
          </MuiPickersUtilsProvider>

          <Grid item xs={12}>
            <TextField
              label="Remarks"
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              type="text"
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} style={{textAlign: 'right'}}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => actionHandler('edit')}>
              Update Data
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" style={{fontWeight: 'bold'}}>
              DELETE
            </Typography>
          </Grid>

          <Grid item xs={12}>
            Be careful on deleting marker data. Delete only IF REALLY NEEDED.
          </Grid>

          <Grid item xs={12}>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="gender"
                name="gender1"
                value={delete_quantity}
                onChange={changeRadioValueFn}>
                <FormControlLabel
                  value="one"
                  control={<Radio />}
                  label="Delete measurement of this marker only"
                />
                <FormControlLabel
                  value="all"
                  control={<Radio />}
                  label="Delete all measurements from given marker observation"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} style={{textAlign: 'right'}}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => setDeleteClick(true)}>
              Delete Data
            </Button>
          </Grid>

          {is_delete_clicked && (
            <Grid item xs={12} style={{textAlign: 'right'}}>
              <ButtonGroup
                variant="contained"
                size="small"
                color="secondary"
                aria-label="small contained button group">
                <Button disabled>Are you sure?</Button>
                <Button onClick={() => actionHandler('delete')}>Yes</Button>
                <Button onClick={() => setDeleteClick(false)}>No</Button>
              </ButtonGroup>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={changeHandlerFn('is_open', false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

// eslint-disable-next-line max-params
function prepareOptions(
  input,
  data,
  width,
  setEditModal,
  setChosenPointCopy,
  is_end_of_shift,
) {
  const subtext = '';
  const {site_code, timestamps} = input;
  const {start, end} = timestamps;
  const start_date = moment(start, 'YYYY-MM-DD HH:mm:ss');
  const end_date = moment(end, 'YYYY-MM-DD HH:mm:ss');

  const font_size = isWidthDown(width, 'sm') ? '1rem' : '0.90rem';

  let min_x = start_date;
  if (is_end_of_shift && data.length > 0) {
    const {data: meas_row} = data[0];
    min_x = moment(meas_row[0].x);
  }

  return {
    title: {
      text: `<b>Surficial Data History Chart of ${site_code.toUpperCase()}</b>`,
      style: {fontSize: font_size},
      margin: 36,
      y: 18,
    },
    time: {timezoneOffset: -8 * 60},
    series: data,
    chart: {
      type: 'line',
      zoomType: 'x',
      panning: true,
      panKey: 'shift',
      height: 400,
      resetZoomButton: {
        position: {
          x: 0,
          y: -30,
        },
      },
      spacingTop: 24,
      spacingRight: 24,
    },
    subtitle: {
      text: `${subtext}As of: <b>${moment(end_date).format(
        'D MMM YYYY, HH:mm',
      )}</b>`,
      style: {fontSize: '0.75rem'},
    },
    yAxis: {
      title: {
        text: '<b>Displacement (cm)</b>',
      },
    },
    xAxis: {
      min: Date.parse(min_x),
      max: Date.parse(end_date),
      type: 'datetime',
      dateTimeLabelFormats: {
        month: '%e. %b %Y',
        year: '%b',
      },
      title: {
        text: '<b>Date</b>',
      },
    },
    tooltip: {
      shared: true,
      crosshairs: true,
    },
    plotOptions: {
      line: {
        marker: {
          enabled: true,
        },
        dashStyle: 'ShortDash',
      },
      series: {
        marker: {
          radius: 3,
        },
        cursor: 'pointer',
        point: {
          events: {
            click() {
              const {
                data_id,
                x,
                y,
                mo_id,
                series: {name},
              } = this;

              const obj = {
                data_id,
                name,
                mo_id,
                ts: moment(x),
                measurement: y,
              };

              setChosenPointCopy(obj);

              setEditModal({
                ...obj,
                is_open: true,
              });
            },
          },
        },
      },
    },
    exporting: {
      buttons: {
        contextButton: {
          menuItems: [
            'viewFullscreen',
            'separator',
            'downloadPNG',
            'downloadJPEG',
            'downloadPDF',
            'downloadSVG',
            {
              text: 'Download CSV',
              textKey: 'downloadCSV',
              onclick: function () {
                console.log('PRINT ME');
              },
            },
          ],
        },
      },
    },
    loading: {
      showDuration: 100,
      hideDuration: 1000,
    },
    credits: {
      enabled: false,
    },
  };
}

function createSurficialGraph(options, chartRef) {
  const temp = (
    <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
  );

  return temp;
}

function SurficialGraph(props) {
  let surficial = require('./../data/surficial.json');

  const {
    width,
    site_code = 'mar',
    // match: { params: { site_code: 'lpa' } },
    fullScreen,
    disableBack,
    disableMarkerList,
    saveSVG,
    input,
    currentUser,
    isEndOfShift,
  } = props;

  let ts_end = moment().subtract(26, 'days').format('YYYY-MM-DD HH:mm:ss'); //ts.subtract customized for the sample data

  const computeForStartTs = () => {
    const ts_format = 'YYYY-MM-DD HH:mm:ss';
    const ts_start = moment(ts_end).subtract(30, 'days').format(ts_format);
    return ts_start;
  };
  const ts_start = computeForStartTs();

  const disable_marker_list =
    typeof disableMarkerList === 'undefined' ? false : disableMarkerList;

  const is_end_of_shift =
    typeof isEndOfShift === 'undefined' ? false : isEndOfShift;

  const chartRef = useRef(null);
  const [timestamps, setTimestamps] = useState({start: ts_start, end: ts_end});

  const [to_redraw_chart, setRedrawChart] = useState(true);
  const [surficial_data, setSurficialData] = useState(surficial);
  const [trending_data, setTrendingData] = useState([]);
  const [is_open_prompt, setIsOpenPrompt] = useState(false);
  const [notif_message, setNotifMessage] = useState('');
  const [marker_action, setMarkerAction] = useState(null);

  const [chosen_point, setChosenPointCopy] = useState({
    data_id: null,
    mo_id: null,
    name: null,
    ts: null,
    measurement: 0,
  });

  const [edit_modal, setEditModal] = useState({
    data_id: null,
    mo_id: null,
    name: null,
    ts: null,
    measurement: 0,
    is_open: false,
  });

  useEffect(() => {
    if (marker_action === 'edit') {
      setNotifMessage('Edit marker data success!');
    } else if (marker_action === 'delete') {
      setNotifMessage('Delete marker data success!');
    }

    if (marker_action) {
      setIsOpenPrompt(true);
      setEditModal({
        ...edit_modal,
        is_open: false,
      });
    }
  }, [marker_action]);

  const input_obj = {site_code, timestamps};
  const options = prepareOptions(
    input_obj,
    surficial_data,
    width,
    setEditModal,
    setChosenPointCopy,
    is_end_of_shift,
  );
  const graph_component = createSurficialGraph(options, chartRef);

  return (
    <Fragment>
      <Paper style={{marginTop: 24}}>{graph_component}</Paper>

      <UpdateDeleteModal
        chosenPoint={chosen_point}
        editModal={edit_modal}
        setEditModal={setEditModal}
        fullScreen={fullScreen}
        siteCode={site_code}
        setRedrawChart={setRedrawChart}
        updateDeletAction={setMarkerAction}
        setOpenModal={setIsOpenPrompt}
      />
      <PromptModal
        isOpen={is_open_prompt}
        setOpenModal={setIsOpenPrompt}
        notifMessage={notif_message}
      />
      {/* 
            <Route  render={
                props => <SurficialTrendingGraphs 
                    {...props}
                    timestamps={timestamps}
                    siteCode={site_code}
                    hideTrending={hideTrending}
                    trendingData={trending_data}
                    setTrendingData={setTrendingData}
                />} 
            /> */}
    </Fragment>
  );
}

export default withMobileDialog()(SurficialGraph);

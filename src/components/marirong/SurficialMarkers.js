import React, {useEffect, useState} from 'react';
import {Grid, Container, Button, Typography, Box, FormControl, InputLabel, MenuItem, Select} from '@mui/material';
import FabMuiTable from '../utils/MuiTable';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import moment from 'moment';
import FormControlLabel from '@mui/material/FormControlLabel';
import {getSurficialData, sendMeasurement} from '../../apis/SurficialMeasurements';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import PromptModal from './modals/PromptModal';

const SurficialMarkers = (props) => {
  const [open, setOpen] = useState(false);
  const [weather, setWeather] = useState('');

  const [surficialData, setSurficialData] = useState()
  const [markers, setMarkers] = useState([]);

  const [openPrompt, setOpenPrompt] = useState(false)
  const [promptTitle, setPromptTitle] = useState("")
  const [notifMessage, setNotifMessage] = useState("")
  const [errorPrompt, setErrorPrompt] = useState(false)
  const [confirmation, setConfirmation] = useState(false)

  const [measurement, setMeasurement] = useState({
    date: new Date(),
    time: new Date(),
    A: "",
    B: "",
    C: "",
    D: "",
    weather: "",
    reporter: "",
    type: ""
  })

  useEffect(() => {
    fetchAll()
  }, [])


  const fetchAll = () => {
    let endDate = moment().format('YYYY-MM-DD HH:mm:00')
    let startDate = moment().subtract(3,'M').format('YYYY-MM-DD HH:mm:00')

    let submitData = {
      startDate: startDate,
      endDate: endDate
    }

    getSurficialData(submitData, (response)=>{
      setSurficialData(response)
      makeTable(response)
    })

    
  }

  const makeTable = (data) => {
    let surficial = data
    let tempTable = []

    console.log("2",surficial)
    surficial.map(marker => {
      marker.data.map((m, i) => {
        if(tempTable.some(((e) => e.timestamp == m.x))){
          switch(marker.marker_name){
            case 'A':
              tempTable[i].markerA = m.y
              break;
            case 'B':
              tempTable[i].markerB = m.y
              break;
            case 'C':
              tempTable[i].markerC = m.y
              break;
            case 'D':
              tempTable[i].markerD = m.y
              break;
          }
        }
        else{
          switch(marker.marker_name){
            case 'A':
              tempTable.push({
                timestamp: m.x,
                date: moment.unix(m.x/1000).format("MMMM DD, YYYY"),
                time: moment.unix(m.x/1000).format("hh:mm"),
                person: m.observer_name,
                markerA: m.y,
                markerB: "",
                markerC: "",
                markerD: ""
              })
              break;
            case 'B':
              tempTable.push({
                timestamp: m.x,
                date: moment.unix(m.x/1000).format("MMMM DD, YYYY"),
                time: moment.unix(m.x/1000).format("hh:mm"),
                person: m.observer_name,
                markerA: "",
                markerB: m.y,
                markerC: "",
                markerD: ""
              })
              break;
            case 'C':
              tempTable.push({
                timestamp: m.x,
                date: moment.unix(m.x/1000).format("MMMM DD, YYYY"),
                time: moment.unix(m.x/1000).format("hh:mm"),
                person: m.observer_name,
                markerA: "",
                markerB: "",
                markerC: m.y,
                markerD: ""
              })
              break;
            case 'D':
              tempTable.push({
                timestamp: m.x,
                date: moment.unix(m.x/1000).format("MMMM DD, YYYY"),
                time: moment.unix(m.x/1000).format("hh:mm"),
                person: m.observer_name,
                markerA: "",
                markerB: "",
                markerC: "",
                markerD: m.y
              })
              break;
          }
        }
          
      })
    })

    setMarkers(tempTable)
    // fillDataTable(whichPage)
  }

  const [incomplete, setIncomplete] = useState(false)
  const checkRequired = () => {
    if(measurement.date != "" 
      && measurement.time != ""
      && measurement.reporter != ""
      && measurement.type != ""
      && measurement.weather != ""
      && measurement.A != "" && measurement.B != ""
      && measurement.C != "" && measurement.D != "") 
        return true
    else return false
  }

  const handleSubmit = () => {
    console.log(measurement)
    let valid = checkRequired()
    console.log(valid)
    if(valid){
      let dateString = `${moment(measurement.date).format("YYYY-MM-DD")} ${moment(new Date(measurement.time)).format("hh:mm:00 A")}`
      let submitData = {
        date: dateString,
        marker: {
          A: measurement.A,
          B: measurement.B,
          C: measurement.C,
          D: measurement.D
        },
        panahon: measurement.weather,
        reporter: measurement.reporter,
        type: measurement.type
      }

      sendMeasurement(submitData, (response)=>{
        if(response.status == true){
          setOpen(false)
          setOpenPrompt(true)
          setErrorPrompt(false)
          setPromptTitle("Success")
          setNotifMessage("Ground measurements succesfully sent!")
          fetchAll()
        }
        else{
          setOpenPrompt(true)
          setErrorPrompt(true)
          setPromptTitle("Fail")
          setNotifMessage("Ground measurements sending failed!")
        }
      })
    }
    else{
      setIncomplete(true)

    }
    
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    {name: 'date', label: 'Date'},
    {name: 'time', label: 'Time'},
    {name: 'markerA', label: 'A'},
    {name: 'markerB', label: 'B'},
    {name: 'markerC', label: 'C'},
    {name: 'markerD', label: 'D'},
    // {name: 'weather', label: 'Weather'},
    {name: 'person', label: 'Nag-sukat'},
  ];

  const options = {
    filter: true,
    selectableRows: 'multiple',
    selectableRowsOnClick: true,
    filterType: 'checkbox',
    responsive: 'vertical',
    onRowsDelete: rowsDeleted => {
      // const idsToDelete = rowsDeleted.data.map (item => item.dataIndex)
      // handleMuiTableBatchDelete(idsToDelete.sort());
    },
  };
  const dummyData = [
    {
      date: '2022-09-06',
      time: '7:30AM',
      markerA: '10cm',
      markerB: '12cm',
      markerC: '14cm',
      markerD: '15cm',
      weather: 'Maulap',
      person: 'Jek',
    },
    {
      date: '2022-09-08',
      time: '6:30AM',
      markerA: '10cm',
      markerB: '12cm',
      markerC: '14cm',
      markerD: '15cm',
      weather: 'Maulan',
      person: 'John',
    },
    {
      date: '2022-09-10',
      time: '7:20AM',
      markerA: '10cm',
      markerB: '12cm',
      markerC: '14cm',
      markerD: '15cm',
      weather: 'Maaraw',
      person: 'Phin',
    },
  ];

  return (
    <Container>
      <PromptModal
        isOpen={openPrompt}
        error={errorPrompt}
        title={promptTitle}
        setOpenModal={setOpenPrompt}
        notifMessage={notifMessage}
        confirmation={confirmation}
        callback={ (response) => {

          
        }}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          Enter new surficial marker measurements
        </DialogTitle>
        <DialogContent>
          <FormControl error={(incomplete==true && measurement.type == "") ? true : false}>
            <FormLabel id="demo-row-radio-buttons-group-label">Type</FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              onChange={(e)=>{
                  let temp = {...measurement}
                  temp.type = e.target.value
                  setMeasurement(temp)
              }}
            >
              <FormControlLabel value="ROUTINE" control={<Radio />} label="Routine" />
              <FormControlLabel value="EVENT" control={<Radio />} label="Event" />
            </RadioGroup>
            <FormHelperText>{(incomplete && measurement.type == "") ? "This field is required" : ""}</FormHelperText>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box flexDirection={"row"} style={{paddingTop: 10}}>
              <DatePicker
                label="Date"
                value={measurement.date}
                onChange={(e) => {
                  let temp = {...measurement}
                  temp.date = moment(new Date(e)).format("YYYY-MM-DD")
                  setMeasurement(temp)
                }}
                renderInput={(params) => <TextField style={{width: '49%', marginRight: '2%'}} {...params} />}
              />
              <TimePicker
                label="Time"
                value={measurement.time}
                onChange={(e) => {
                  let temp = {...measurement}
                  console.log(e)
                  temp.time = e
                  console.log(temp)
                  setMeasurement(temp)
                }}
                renderInput={(params) => <TextField style={{width: '49%'}} {...params} />}
              />
            </Box>
          </LocalizationProvider>
          <Box
            container
            flexDirection={'row'}
            paddingTop={2}
            paddingBottom={2}
            align="center"
            justifyContent={"space-between"}>
              <TextField
                autoFocus
                error={(incomplete && measurement.A == "") ? true : false}
                helperText={(incomplete && measurement.A == "") ? "required" : ""}
                label="Marker A"
                variant="outlined"
                style={{width: "23%", marginRight: "1%"}}
                onChange={e => {
                  let temp = {...measurement}
                  temp.A = e.target.value
                  setMeasurement(temp)
                }}
              />
              <TextField
                autoFocus
                error={(incomplete && measurement.B == "") ? true : false}
                helperText={(incomplete && measurement.B == "") ? "required" : ""}
                label="Marker B"
                variant="outlined"
                style={{width: "23%", marginLeft: "1%", marginRight: "1%"}}
                onChange={e => {
                  let temp = {...measurement}
                  temp.B = e.target.value
                  setMeasurement(temp)
                }}
              />
              <TextField
                autoFocus
                error={(incomplete && measurement.C == "") ? true : false}
                helperText={(incomplete && measurement.C == "") ? "required" : ""}
                label="Marker C"
                variant="outlined"
                style={{width: "23%", marginLeft: "1%", marginRight: "1%"}}
                onChange={e => {
                  let temp = {...measurement}
                  temp.C = e.target.value
                  setMeasurement(temp)
                }}
              />
              <TextField
                autoFocus
                error={(incomplete && measurement.D == "") ? true : false}
                helperText={(incomplete && measurement.D == "") ? "required" : ""}
                label="Marker D"
                variant="outlined"
                style={{width: "23%", marginLeft: "1%", marginRight: "1%"}}
                onChange={e => {
                  let temp = {...measurement}
                  temp.D = e.target.value
                  setMeasurement(temp)
                }}
              />
          </Box>
          <FormControl fullWidth style={{width: '100%', paddingBottom: 15}}
            error={(incomplete && measurement.weather == "") ? true : false}
          >
            <InputLabel id="demo-simple-select-label">Weather</InputLabel>
            <Select
              error={(incomplete && measurement.weather == "") ? true : false}
              helperText={(incomplete && measurement.weather == "") ? "required" : ""}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Weather"
              value={measurement.weather}
              onChange={e => {
                let temp = {...measurement}
                temp.weather = e.target.value
                setMeasurement(temp)
              }}
            >
              <MenuItem value={'Maaraw'}>Maaraw</MenuItem>
              <MenuItem value={'Maulap'}>Maulap</MenuItem>
              <MenuItem value={'Maulan'}>Maulan</MenuItem>
              <MenuItem value={'Makulimlim'}>Makulimlim</MenuItem>
              <MenuItem value={'Maambon'}>Maambon</MenuItem>
            </Select>
            <FormHelperText>{(incomplete && measurement.weather == "") ? "Required" : ""}</FormHelperText>
          </FormControl>
          <TextField
            error={(incomplete && measurement.reporter == "") ? true : false}
            helperText={(incomplete && measurement.reporter == "") ? "required" : ""}
            id="filled-helperText"
            label="Reporter"
            placeholder="Ex: Juan Dela Cruz"
            variant="outlined"
            style={{width: '100%'}}
            value={measurement.reporter}
            onChange={e => {
              let temp = {...measurement}
              temp.reporter = e.target.value
              setMeasurement(temp)
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
          <Button variant="contained"
            onClick={e => {
              handleSubmit()
            }} 
          >
            Send Measurements
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={4} sx={{mt: 2, mb: 6, padding: '2%'}}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4">Surficial Markers</Typography>
            </Grid>
            <Grid item xs={12}>
              <FabMuiTable
                data={{
                  columns: columns,
                  rows: markers,
                }}
                options={options}
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container align="center">
                <Grid item xs={12}>
                  <Button variant="contained" onClick={handleClickOpen}>
                    Add surficial marker measurement
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};
export default SurficialMarkers;

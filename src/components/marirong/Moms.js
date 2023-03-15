import React, { useState, useEffect } from 'react';
import { Grid, Container, Button, Typography, FormControl } from '@mui/material';
import FabMuiTable from '../utils/MuiTable';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { getFeatures, getInstances, insertMomsEntry, getMomsInstances, getMomsFeatures } from '../../apis/MoMs';
import moment from 'moment';

const Moms = (props) => {
  const [open, setOpen] = useState(false);
  const [feature, setFeature] = useState('');

  const [datetimestamp, setDateTimestamp] = useState(new Date());
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(null);
  const [selectedFeatureName, setSelectedFeatureName] = useState("");
  const [selectedAlertLevel, setSelectedAlertLevel] = useState(0);
  const [featureDetails, setFeatureDetails] = useState("")
  const [featureLocation, setFeatureLocation] = useState("");
  const [reporter, setReporter] = useState("");
  const [featureName, setFeatureName] = useState({
    name: "",
    instance_id: 0
  })
  const [featureNames, setFeatureNames] = useState([
    {
      name: "New Instance",
      instance_id: 0
    }
  ])

  const [instances, setInstances] = useState([])
  const [instanceID, setInstanceID] = useState(null);

  const [existingFeatureName, setExistingFeatureName] = useState(false)

  useEffect(() => {
    let check = featureNames.find((o) => o.name === featureName.name)
    if (check) setExistingFeatureName(true)
    else setExistingFeatureName(false)
  }, [featureName]);


  // useEffect(() => {
  //   reloadDataTable();
  // }, []);

  // const reloadDataTable = () => {
  //   getMomsInstances((response) => {
  //     console.log("getMomsInstances repsonse:", response.data);
  //   });
  //   getMomsFeatures((response) => {
  //     console.log("getMomsFeatures repsonse:", response.data);
  //   });
  // }

  const feature_list = [
    {
      feature_id: 1,
      feature: 'Crack',
      details:
        'Ilang crack ang nakita?: ' +
        '\nGaano kahaba?: ' +
        '\nGaano kalapad?: ' +
        '\nAno ang lalim nito?: ' +
        '\nAno ang oryentasyon o direksyon?: ' +
        '\nGaano kalaki ang pagbabago? (Kung luma): '
    },
    {
      feature_id: 2,
      feature: 'Scarp',
      details:
        'Ilang scarp ang nakita?: ' +
        '\nGaano kahaba?: ' +
        '\nGaano kalapad?: ' +
        '\nAno ang taas nito?: ' +
        '\nAno ang oryentasyon o direksyon?: ' +
        '\nGaano kalaki ang pagbabago?(Kung luma): '

    },
    {
      feature_id: 3,
      feature: 'Seepage',
      details:
        'Gaano kabilis/kalakas ang daloy ng tubig?: ' +
        '\nGaano karami ang tubig na umaagos?: ' +
        '\nAno ang kulay ng tubig?: ' +
        '\nBagong seepage o dati na?: '
    },
    {
      feature_id: 4,
      feature: 'Ponding',
      details:
        'Gaano kalaki ang ponding?: ' +
        '\nMayroon bang kalapit na iba pang landslide feature?: ' +
        '\nBagong ponding o dati pa?: '
    },
    {
      feature_id: 5,
      feature: 'Tilted/Split Trees',
      details:
        'Saang direksyon nakatagilid/nakatabingi/nahati ang puno?: ' +
        '\nPara sa split trees, gaano kalaki ang hati?: '
    },
    {
      feature_id: 6,
      feature: 'Damaged Structures',
      details:
        'Mayroon bang mga paglubong sa sahig o pagtagilid nng mga dingding?: ' +
        '\nSaan nakita ang crack at ano ang oryentasyon nito?: '
    },
    {
      feature_id: 7,
      feature: 'Slope Failure',
      details:
        'Saang bahagi ng slope ito na-obserbahan?: ' +
        '\nGaano kalayo ang narating ng pagguho ng lupa?: ' +
        '\nMayroon bang mga naapektuhang istruktura?: ' +
        '\nGaano ito kataas at kalapad?: '
    },
    {
      feature_id: 8,
      feature: 'Bulging/Depression',
      details:
        'Ilan ang nakitang pag-umbok o paglubog ng lupa?: ' +
        '\nGaano ito kalaki?: ' +
        '\nMayroon bang kalapit na iba pang landslide feature?: '
    },
  ];

  useEffect(() => {
    setFeatureName("")

    getFeatures((response) => {
      let tempData = response.data;

      tempData.map(feature => {
        if (feature.feature_id == selectedFeatureIndex) {
          let tempFeatureNames = [
            {
              name: "New Instance",
              instance_id: 0
            }
          ]

          console.log("feature:", feature)
          if (feature.instances.length > 0) {
            feature.instances.map(instance => {
              tempFeatureNames.push({
                instance_id: instance.instance_id,
                name: instance.feature_name
              })
            })
          }

          setFeatureNames(tempFeatureNames)
        }
      });
    })

  }, [selectedFeatureIndex]);

  useEffect(() => {
    reloadTable()
  }, [props])


  const reloadTable = () => {
    getInstances((response) => {
      if (response) {
        setInstances(response)
      }
    })

  }

  const handleChange = event => {
    setFeature(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    setOpen(false);

    let moms_entry = {
      site_code: "mar",
      moms_list: [
        {
          alert_level: 2,
          instance_id: featureName.instance_id,
          feature_name: featureName.name,
          feature_type: (feature_list.find((o) => o.feature_id == selectedFeatureIndex)).feature,
          report_narrative: featureDetails,
          observance_ts: moment(datetimestamp).format("YYYY-MM-DD HH:mm:ss"),
          remarks: featureDetails,
          reporter_id: 1,
          validator_id: 1,
          location: featureLocation,
          iomp: 1,
          file_name: ""
        }
      ],
      uploads: []
    };

    console.log("moms_entry:", moms_entry);

    insertMomsEntry(moms_entry, (response) => {
      console.log("response:", response);
    });
  }

  return (
    <Container>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Enter new manifestation of movement
        </DialogTitle>
        <DialogContent>
          <Grid item xs={12} style={{ paddingTop: 10 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Date"
                value={datetimestamp}
                onChange={(e) => {
                  setDateTimestamp(e);
                }}
                renderInput={(params) => <TextField style={{ width: '100%', paddingBottom: 10 }} {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth style={{ width: '100%', paddingBottom: 15 }}
            >
              <InputLabel id="demo-simple-select-label">Alert Levels</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Alert level"
                onChange={e => {
                  setSelectedAlertLevel(e.target.value);
                }}
              >
                <MenuItem key={0} value={0}>Alert level 0</MenuItem>
                <MenuItem key={2} value={2}>Alert level 2</MenuItem>
                <MenuItem key={3} value={3}>Alert level 3</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth style={{ width: '100%', paddingBottom: 15 }}
            >
              <InputLabel id="demo-simple-select-label">Feature Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Feature Type"
                value={selectedFeatureIndex}
                onChange={e => {
                  setSelectedFeatureIndex(e.target.value);
                  setSelectedFeatureName(selectedFeatureIndex != null ? (feature_list.find((o) => o.feature_id == selectedFeatureIndex)).feature : "");
                }}
              >
                {
                  feature_list && feature_list.map((row, index) => (
                    <MenuItem key={index} value={row.feature_id}>{row.feature}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
            {selectedFeatureIndex != null &&
              <FormControl fullWidth style={{ width: '100%', paddingBottom: 15 }}
              >
                <InputLabel id="demo-simple-select-label">Feature Name</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Feature Name"
                  value={featureName.name}
                  onChange={e => {
                    console.log("e.target.value:", e.target.value);
                    setFeatureName(e.target.value)
                  }}
                >
                  {
                    featureNames.map((row, index) => (
                      <MenuItem key={index} value={row}>{row.name}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            }
          </Grid>

          {featureName.instance_id == 0 &&
            <Grid item xs={12}>
              <TextField
                error={existingFeatureName ? true : false}
                helperText={existingFeatureName ? `This feature name already exists for the same feature type` : ""}
                id="outlined-required"
                label="Feature Name"
                variant="outlined"
                style={{ width: '100%', paddingBottom: 10 }}
                onChange={e => {
                  setFeatureName({
                    name: e.target.value,
                    instance_id: 0
                  })
                }}
              />
            </Grid>
          }
          <Grid item xs={12}>
            <TextField
              id="outlined-required"
              label="Description"
              variant="outlined"
              style={{ width: '100%', paddingBottom: 10 }}
              value={featureDetails}
              onChange={e => {
                setFeatureDetails(e.target.value)
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-required"
              label="Location"
              variant="outlined"
              style={{ width: '100%', paddingBottom: 10 }}
              value={featureLocation}
              onChange={e => {
                setFeatureLocation(e.target.value)
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-required"
              label="Reporter"
              variant="outlined"
              style={{ width: '100%', paddingBottom: 10 }}
              value={reporter}
              onChange={e => {
                setReporter(e.target.value)
              }}
            />
          </Grid>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>


      <Grid container spacing={4} sx={{ mt: 2, mb: 6, padding: '2%' }}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4">Manifestations of Movement</Typography>
            </Grid>
            <Grid item xs={12}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Feature Type</TableCell>
                    <TableCell>Feature Name</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Last Observance Timestamp</TableCell>
                    <TableCell>Alert Level</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {instances.map((row) => (
                    <Row key={row.date} row={row} />
                  ))}
                </TableBody>
              </Table>
              {/* <FabMuiTable
                data={{
                  columns: columns,
                  rows: dummyData,
                }}
                options={options}
              /> */}
            </Grid>
            <Grid item xs={12}>
              <Grid container align="center">
                <Grid item xs={12}>
                  <Button sx={{ backgroundColor: '#2E2D77'}}
                  variant="contained" onClick={handleClickOpen}>
                    Add manifestations of movement
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

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">{row.feature.feature_type}</TableCell>
        <TableCell>{row.feature_name}</TableCell>
        <TableCell>{row.location}</TableCell>
        <TableCell>{row.moms[0].observance_ts}</TableCell>
        <TableCell>{row.moms[0].op_trigger}</TableCell>
        <TableCell>action eme</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Instances
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Observance Timestamp</TableCell>
                    <TableCell>Narrative</TableCell>
                    <TableCell>Report Timestamp</TableCell>
                    <TableCell>Reporter</TableCell>
                    <TableCell>Validator</TableCell>
                    <TableCell>Remarks</TableCell>
                    <TableCell>Alert Level</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.moms.map((element) => (
                    <TableRow key={element.moms_id}>
                      <TableCell component="th" scope="row">{element.observance_ts}</TableCell>
                      <TableCell>{element.narrative.narrative}</TableCell>
                      <TableCell>{element.narrative.timestamp}</TableCell>
                      <TableCell>{`${element.reporter.first_name} ${element.reporter.last_name}`}</TableCell>
                      <TableCell>{`${element.validator.first_name} ${element.validator.last_name}`}</TableCell>
                      <TableCell>{element.remarks}</TableCell>
                      <TableCell>{element.op_trigger}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
export default Moms;

import React, {useState, useEffect, Fragment} from 'react';
import {Grid, Container, Button, Typography, Modal, Divider, Stack, TextField, InputLabel,
  Select, MenuItem, FormControl, Box, Checkbox
} from '@mui/material';
import FabMuiTable from '../utils/MuiTable';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment';
import FormControlLabel from '@mui/material/FormControlLabel';
import {getAllHouseholds, 
  getSummary, addHousehold, 
  editHousehold, deleteHousehold,
  getPregnant, getComorbid, getDisabled} from '../../apis/CapacityAndVulnerability'
import PromptModal from './modals/PromptModal';

const CaV = () => {

  const [householdData, setHouseholdData] = useState([])
  const [vulnerableCount, setVulnerableCount] = useState({
    pregnant: 0,
    disabled: 0,
    comorbid: 0
  })
  const [pregnantList, setPregnantList] = useState([])
  const [disabledList, setDisabledList] = useState([])
  const [comorbidList, setComorbidList] = useState([])
  const [listDisplay, setListDisplay] = useState()

  useEffect(() => {
    fetchAll()

  }, []);

  const fetchAll = () => {
    let households = []
    let tempVulnerableCount = {
      pregnant: 0,
      disabled: 0,
      comorbid: 0
    }
    let tempPregnantList = []
    let tempDisabledList = []
    let tempComorbidList = []
    
    getAllHouseholds((response)=>{
      if(response.status){
        response.data.map((household) => {
          households.push({
            house_hold_no: household.household_id,
            head: household.household_head,
            count: household.members.length,
            birthday: household.birthdate,
            gender: household.gender,
            pregnant: household.pregnant,
            disability: household.disability,
            comorbidity: household.comorbidity,
            members: household.members,
            id: household.id
          })
        })
        setHouseholdData(households)
      }
    })

    console.log(households)

    getSummary((response)=>{
      if(response.status){
        tempVulnerableCount.pregnant = response.pregnant_count
        tempVulnerableCount.disabled = response.disability_count
        tempVulnerableCount.comorbid = response.comorbidity_count
        setVulnerableCount(tempVulnerableCount)
      }
    })

    getPregnant((response)=>{
      if(response.status){
        response.data.map((household) => {
          let members = JSON.parse(household.members)
          tempPregnantList.push({
            house_hold_no: household.household_id,
            head: household.household_head,
            count: members.length,
            birthday: household.birthdate,
            gender: household.gender,
            pregnant: household.pregnant,
            disability: household.disability,
            comorbidity: household.comorbidity,
            members: members,
            id: household.id
          })
        })
        setPregnantList(tempPregnantList)
      }
    })

    getDisabled((response)=>{
      if(response.status){
        response.data.map((household) => {
          let members = JSON.parse(household.members)
          tempDisabledList.push({
            house_hold_no: household.household_id,
            head: household.household_head,
            count: members.length,
            birthday: household.birthdate,
            gender: household.gender,
            pregnant: household.pregnant,
            disability: household.disability,
            comorbidity: household.comorbidity,
            members: members,
            id: household.id
          })
        })
        setDisabledList(tempDisabledList)
      }
    })

    getComorbid((response)=>{
      if(response.status){
        response.data.map((household) => {
          let members = JSON.parse(household.members)
          tempComorbidList.push({
            house_hold_no: household.household_id,
            head: household.household_head,
            count: members.length,
            birthday: household.birthdate,
            gender: household.gender,
            pregnant: household.pregnant,
            disability: household.disability,
            comorbidity: household.comorbidity,
            members: members,
            id: household.id
          })
        })
        setComorbidList(tempComorbidList)
      }
    })

  }

  const columns = [
    {name: 'house_hold_no', label: 'Household #'},
    {name: 'head', label: 'Household Head'},
    {name: 'count', label: 'Member Count'},
    {name: 'actions', label: 'Actions'},
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


  //Dummy dialog and data
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openModal, setOpenModal] = useState(false);
  const closeModal = () => setOpenModal(false);

  const [openPrompt, setOpenPrompt] = useState(false)
  const [promptTitle, setPromptTitle] = useState("")
  const [notifMessage, setNotifMessage] = useState("")
  const [errorPrompt, setErrorPrompt] = useState(false)
  const [confirmation, setConfirmation] = useState(false)
  
  const dummyDialogData = [
    {
      house_hold_no: 1,
      head: 'Marissa Aleleng',
      count: 1,
      actions: 'Wife of Mr. Aleleng',
    },
    {house_hold_no: 5, head: 'Gretchen Bubule', count: 1, actions: 'N/A'},
  ];

  const [householdHead, setHouseholdHead] = useState({
    id: "",
    name:"",
    birthday: new Date(),
    gender: "",
    pregnant: false,
    disability: null,
    comorbidity: null,
    disabled: false,
    comorbid: false
  })
  const [householdMembers, setHouseholdMembers] = useState([])

  const initialize = () => {
    setHouseholdHead({
      id: "",
      name:"",
      birthday: new Date(),
      gender: "",
      pregnant: false,
      disability: null,
      comorbidity: null,
      disabled: false,
      comorbid: false
    })
    setHouseholdMembers([])
    setConfirmation(false)
  }

  const handleAddMember = () => {
    let tempHouseholdMembers = [...householdMembers]
    tempHouseholdMembers.push({
      household_member: "",
      birthday: new Date(),
      gender: "",
      pregnant: false,
      disability: null,
      comorbidity: null,
      disabled: false,
      comorbid: false
    })
    setHouseholdMembers(tempHouseholdMembers)
  }

  const handleSubmit = () => {
    let tempMembers = []
    console.log("household members",householdMembers)
    householdMembers.map((item) => {
      tempMembers.push({
        household_member: item.household_member,
        birthdate: moment(item.birthday).format("YYYY-MM-DD"),
        gender: item.gender,
        pregnant: item.pregnant,
        disability: (item.disabled == true) ? item.disability : null,
        comorbidity: (item.comorbid == true) ? item.comorbidity : null
      })
    })

    let submitData = {
      id: householdHead.primaryID,
      household_id: householdHead.id,
      household_head: householdHead.name,
      birthdate: moment(householdHead.birthday).format("YYYY-MM-DD"),
      gender: householdHead.gender,
      pregnant: householdHead.pregnant,
      disability: (householdHead.disabled == true) ? householdHead.disability : null,
      comorbidity: (householdHead.comorbid == true) ? householdHead.comorbidity : null,
      members: tempMembers
    }

    console.log("submit data uwu",submitData)

    if(action=="add"){
      addHousehold(submitData, (response) => {
        if(response.status == true){
          initialize()
          setOpenModal(false)
          setOpenPrompt(true)
          setErrorPrompt(false)
          setPromptTitle("Success")
          setNotifMessage(response.message)
          fetchAll()
        }
        else{
          setOpenPrompt(true)
          setErrorPrompt(true)
          setPromptTitle("Fail")
          setNotifMessage(response.message)
        }
      })
    }
    else if(action=="edit"){
      editHousehold(submitData, (response) => {
        if(response.status == true){
          initialize()
          setOpenModal(false)
          setOpenPrompt(true)
          setErrorPrompt(false)
          setPromptTitle("Success")
          setNotifMessage(response.message)
          fetchAll()
        }
        else{
          setOpenPrompt(true)
          setErrorPrompt(true)
          setPromptTitle("Fail")
          setNotifMessage(response.message)
        }
      })
    }

  }

  const [action, setAction] = useState('')

  const handleEdit = (response) => {
    console.log("edit")
    console.log(response)
    setAction('edit')

    setHouseholdHead({
      id: response.house_hold_no,
      name: response.head,
      birthday: response.birthday,
      gender: response.gender,
      pregnant: response.pregnant,
      disability: response.disability,
      comorbidity: response.comorbidity,
      disabled: response.disability != null ? true : false,
      comorbid: response.comorbidity != null ? true : false,
      primaryID: response.id
    })

    let tempMembers = []
    response.members.map((item) => {
      tempMembers.push({
        household_member: item.household_member,
        birthdate: moment(item.birthday).format("YYYY-MM-DD"),
        gender: item.gender,
        pregnant: item.pregnant,
        disability: item.disability,
        comorbidity: item.comorbidity,
        disabled: item.disability != null ? true : false,
        comorbid: item.comorbidity != null ? true : false,
      })
    })
    setHouseholdMembers(tempMembers)

    setOpenModal(true)
  }

  const [deleteID,setDeleteID] = useState(null)

  const confirmDelete = (response) => {
    setAction("delete")
    console.log("Confirm",response)
    setOpenPrompt(true)
    setErrorPrompt(false)
    setPromptTitle("Are you sure you want to delete this household?")
    setNotifMessage("This household information will be deleted immediately.")
    setConfirmation(true)
    setDeleteID(response)
  }

  const handleDelete = () => {
    console.log(deleteID.id)

    deleteHousehold({id: deleteID.id}, (response) => {
      if(response.status == true){
        initialize()
        setOpenModal(false)
        setOpenPrompt(true)
        setErrorPrompt(false)
        setPromptTitle("Success")
        setNotifMessage(response.message)
        fetchAll()
      }
      else{
        setOpenPrompt(true)
        setErrorPrompt(true)
        setPromptTitle("Fail")
        setNotifMessage(response.message)
        initialize()
      }
      console.log(response)
    })
  }

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
          if(response == true) {
            if(action=="delete"){
              handleDelete()
            }
          }
          else if(response == false){
            // setDeleteID(null)
          }
          
        }}
      />
      <Grid container spacing={4} sx={{mt: 2, mb: 6, padding: '2%'}}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4">Household Summary</Typography>
            </Grid>
            <Grid item xs={12}>
              <FabMuiTable
                data={{
                  columns: columns,
                  rows: householdData,
                }}
                onEdit={handleEdit}
                onDelete={confirmDelete}
                buttons="update-delete"
                // options={options}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid container sx={{mt: 2, mb: 6, padding: '2%'}}>
          <Grid item xs={12} sm={12} md={12} lg={7}>
              <Button
                  variant="contained"
                  style={{float: 'right', mx: 1, backgroundColor: '#2E2D77'}}
                  onClick={e => {

                      setAction("add")
                      setOpenModal(true);
                  }}>
                  Add Household
              </Button>
              
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4">Vulnerable Household</Typography>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{minWidth: '100%'}}>
                <CardContent>
                  <Typography
                    sx={{fontSize: 16}}
                    color="text.secondary"
                    gutterBottom>
                    Pregnant
                  </Typography>
                  <Typography variant="h5" component="div"></Typography>
                  <Typography variant="body2">
                    No. of pregnant women: {vulnerableCount.pregnant}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" 
                    onClick={()=>{
                      setListDisplay("pregnant")
                      handleOpen()
                    }}>
                    View details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{minWidth: '100%'}}>
                <CardContent>
                  <Typography
                    sx={{fontSize: 14}}
                    color="text.secondary"
                    gutterBottom>
                    Person with disability
                  </Typography>
                  <Typography variant="h5" component="div"></Typography>
                  <Typography variant="body2">
                    No. of PWDs: {vulnerableCount.disabled}
                  </Typography>
                </CardContent>
                <CardActions>
                <Button size="small" 
                    onClick={()=>{
                      setListDisplay("disabled")
                      handleOpen()
                    }}>
                    View details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{minWidth: '100%'}}>
                <CardContent>
                  <Typography
                    sx={{fontSize: 14}}
                    color="text.secondary"
                    gutterBottom>
                    Person with comorbidity
                  </Typography>
                  <Typography variant="h5" component="div"></Typography>
                  <Typography variant="body2">
                    No. of people with comorbidities: {vulnerableCount.comorbid}
                  </Typography>
                </CardContent>
                <CardActions>
                <Button size="small" 
                    onClick={()=>{
                      setListDisplay("comorbid")
                      handleOpen()
                    }}>
                    View details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{minWidth: '100%'}}>
                <CardContent>
                  <Typography
                    sx={{fontSize: 14}}
                    color="text.secondary"
                    gutterBottom>
                    Senior Citizens
                  </Typography>
                  <Typography variant="h5" component="div"></Typography>
                  <Typography variant="body2">
                    No. of Senior Citizen: 0
                  </Typography>
                </CardContent>
                <CardActions>
                <Button size="small" 
                    onClick={()=>{
                      setListDisplay("disabled")
                      handleOpen()
                    }}>
                    View details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{minWidth: '100%'}}>
                <CardContent>
                  <Typography
                    sx={{fontSize: 14}}
                    color="text.secondary"
                    gutterBottom>
                    Childrens
                  </Typography>
                  <Typography variant="h5" component="div"></Typography>
                  <Typography variant="body2">
                    No. of Children (Ages 6 to 12): 0
                  </Typography>
                </CardContent>
                <CardActions>
                <Button size="small" 
                    onClick={()=>{
                      setListDisplay("disabled")
                      handleOpen()
                    }}>
                    View details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{minWidth: '100%'}}>
                <CardContent>
                  <Typography
                    sx={{fontSize: 14}}
                    color="text.secondary"
                    gutterBottom>
                    Childrens
                  </Typography>
                  <Typography variant="h5" component="div"></Typography>
                  <Typography variant="body2">
                    No. of Children (Ages 0 to 5): 2
                  </Typography>
                </CardContent>
                <CardActions>
                <Button size="small" 
                    onClick={()=>{
                      setListDisplay("disabled")
                      handleOpen()
                    }}>
                    View details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          {'Vulnerable household details'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">

            List of households with {(listDisplay=="pregnant") ? "pregnant woman" 
              : (listDisplay=="disabled") ? "PWD/s "
              : (listDisplay=="comorbid") ? "person/s with comorbidity"
              : ""}
          </DialogContentText>
          <FabMuiTable
            data={{
              columns: columns,            
              rows: 
              (listDisplay=="pregnant") ? pregnantList 
              : (listDisplay=="disabled") ? disabledList 
              : (listDisplay=="comorbid") ? comorbidList
              : [],
            }}
            onEdit={handleEdit}
            onDelete={confirmDelete}
            buttons="update-delete"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog
          fullWidth
          fullScreen={false}
          maxWidth='xs'
          open={openModal}
          aria-labelledby="form-dialog-title"

      >
        <DialogTitle id="form-dialog-title">{action=="add" ? "Add New Household" : "Edit Household"}</DialogTitle>
        <DialogContent style={{paddingTop: 10}}>
          <TextField
            id="filled-helperText"
            label="Household ID"
            required
            placeholder="####"
            variant="outlined"
            style={{width: '100%', paddingBottom: 10}}
            value={householdHead.id}
            onChange={e => {
              let temp = {...householdHead}
              temp.id = e.target.value
              setHouseholdHead(temp)
            }}
          />
          <TextField
            id="filled-helperText"
            label="Household Head Name"
            placeholder="Ex. Juan Dela Cruz"
            required
            variant="outlined"
            style={{width: '100%', paddingBottom: 10}}
            value={householdHead.name}
            onChange={e => {
              let temp = {...householdHead}
              temp.name = e.target.value
              setHouseholdHead(temp)
            }}
          />
          <Box flexDirection={'row'}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Birthday"
                value={householdHead.birthday}
                onChange={(e) => {
                  let temp = {...householdHead}
                  temp.birthday = moment(new Date(e)).format("YYYY-MM-DD")
                  setHouseholdHead(temp)
                }}
                renderInput={(params) => <TextField style={{width: '49.2%', paddingBottom: 10, marginRight: '1.6%'}} {...params} />}
              />
            </LocalizationProvider>

            <FormControl fullWidth style={{width: '49.2%', paddingBottom: 10}}>
              <InputLabel id="demo-simple-select-label">Gender</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Gender"
                value={householdHead.gender}
                onChange={e => {
                  let temp = {...householdHead}
                  temp.gender = e.target.value
                  setHouseholdHead(temp)
                }}
              >
                <MenuItem value={"F"}>Female</MenuItem>
                <MenuItem value={"M"}>Male</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <FormControlLabel
            control={<Checkbox 
              checked={householdHead.pregnant}
              onChange={e => {
                let temp = {...householdHead}
                temp.pregnant = e.target.checked
                setHouseholdHead(temp)
              }}
            />} 
            label="Pregnant"
            style={{width:'100%'}}
          />
          <FormControlLabel
            control={<Checkbox
              checked={householdHead.disabled}
              onChange={e => {
                let temp = {...householdHead}
                temp.disabled = e.target.checked
                setHouseholdHead(temp)
              }}    
            />} 
            label="Disabled"
            style={{width:'100%'}}
          />
          {householdHead.disabled &&
          <TextField
            id="filled-helperText"
            label="Disability"
            helperText="Specify the disability"
            placeholder="Disability"
            variant="outlined"
            style={{width: '100%', paddingBottom: 10}}
            value={householdHead.disability}
            onChange={e => {
              let temp = {...householdHead}
              temp.disability = e.target.value
              setHouseholdHead(temp)
            }}
          />}
          <FormControlLabel
            control={<Checkbox 
              checked={householdHead.comorbid}
              onChange={e => {
                let temp = {...householdHead}
                temp.comorbid = e.target.checked
                setHouseholdHead(temp)
              }}    
            />} 
            label="With Comorbidity"
            style={{width:'100%'}}
          />
          {householdHead.comorbid &&
            <TextField
              id="filled-helperText"
              label="Comorbidity"
              helperText="Specify the comorbidity"
              placeholder="Comorbidity"
              variant="outlined"
              style={{width: '100%', paddingBottom: 10}}
              value={householdHead.comorbidity}
              onChange={e => {
                let temp = {...householdHead}
                temp.comorbidity = e.target.value
                setHouseholdHead(temp)
              }}
            />}

          {householdMembers.length>0 &&
            householdMembers.map((item, index) => (
              <div style={{paddingTop: 20, paddingBottom: 20}}>
                <Button variant="contained" color="error"
                  onClick={e => {
                    let temp = [...householdMembers]
                    temp.splice(index,1)
                    setHouseholdMembers(temp)
                  }} 
                >
                  Remove
                </Button>
                <Typography variant='subtitle1' style={{fontWeight: 'bold', paddingTop: 10}}>Household Member # {index+1}</Typography>
                <TextField
                  id="filled-helperText"
                  label="Household Member Name"
                  placeholder="Ex. Juan Dela Cruz"
                  variant="outlined"
                  style={{width: '100%', paddingBottom: 10}}
                  value={householdMembers[index].household_member}
                  onChange={e => {
                    let temp = [...householdMembers]
                    temp[index].household_member = e.target.value
                    setHouseholdMembers(temp)
                  }}
                />
                <Box flexDirection={'row'}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Birthday"
                      value={householdMembers[index].birthday}
                      onChange={(e) => {
                        let temp = [...householdMembers]
                        temp[index].birthday = moment(new Date(e)).format("YYYY-MM-DD")
                        setHouseholdMembers(temp)
                      }}
                      renderInput={(params) => <TextField style={{width: '49.2%', paddingBottom: 10, marginRight: '1.6%'}} {...params} />}
                    />
                  </LocalizationProvider>

                  <FormControl fullWidth style={{width: '49.2%', paddingBottom: 10}}>
                    <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Gender"
                      value={householdMembers[index].gender}
                      onChange={e => {
                        let temp = [...householdMembers]
                        temp[index].gender = e.target.value
                        setHouseholdMembers(temp)
                      }}
                    >
                      <MenuItem value={"F"}>Female</MenuItem>
                      <MenuItem value={"M"}>Male</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <FormControlLabel
                  control={<Checkbox
                    checked={householdMembers[index].pregnant}
                    onChange={e => {
                      let temp = [...householdMembers]
                      temp[index].pregnant = e.target.checked
                      setHouseholdMembers(temp)
                    }}    
                  />} 
                  label="Pregnant" 
                  style={{width:'100%'}}
                />
                <FormControlLabel
                  control={<Checkbox
                    checked={householdMembers[index].disabled}
                    onChange={e => {
                      let temp = [...householdMembers]
                      temp[index].disabled = e.target.checked
                      setHouseholdMembers(temp)
                    }}    
                  />} 
                  label="Disabled" 
                  style={{width:'100%'}}
                />
                {householdMembers[index].disabled &&
                <TextField
                  id="filled-helperText"
                  label="Disability"
                  helperText="Specify the disability"
                  placeholder="Disability"
                  variant="outlined"
                  style={{width: '100%', paddingBottom: 10}}
                  value={householdMembers[index].disability}
                  onChange={e => {
                    let temp = [...householdMembers]
                    temp[index].disability = e.target.value
                    setHouseholdMembers(temp)
                  }}
                />}
                <FormControlLabel
                  control={<Checkbox
                    checked={householdMembers[index].comorbid}
                    onChange={e => {
                      let temp = [...householdMembers]
                      temp[index].comorbid = e.target.checked
                      setHouseholdMembers(temp)
                    }}    
                  />} 
                  label="With Comorbidity" 
                  style={{width:'100%'}}
                />
                {householdMembers[index].comorbid &&
                <TextField
                  id="filled-helperText"
                  label="Comorbidity"
                  helperText="Specify the comorbidity"
                  placeholder="Comorbidity"
                  variant="outlined"
                  style={{width: '100%', paddingBottom: 10}}
                  value={householdMembers[index].comorbidity}
                  onChange={e => {
                    let temp = [...householdMembers]
                    temp[index].comorbidity = e.target.value
                    setHouseholdMembers(temp)
                  }}
                />}
              </div>
            ))
            
          }
          <Button variant="contained"
            onClick={e => {
              handleAddMember()
            }} 
            style={{ backgroundColor: '#2E2D77'}}
          >
            Add Member
          </Button>

          

        </DialogContent>
        <DialogActions>
          <Button 
            variant="text"
            color="error"
            onClick={e => {
              initialize()
              setOpenModal(false)
            }} 
          >
              Cancel
          </Button>
          <Button variant="contained"
            onClick={e => {
              handleSubmit()
            }}
            style={{ backgroundColor: '#2E2D77'}}
          >
            {action=="add" ? "Add Household" : "Edit Household"}
          </Button>
        </DialogActions>
      </Dialog>

     
    </Container>
  );
};

export default CaV;

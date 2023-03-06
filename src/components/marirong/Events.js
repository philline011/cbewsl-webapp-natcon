import React, {useMemo, div, useState, useEffect, Fragment} from 'react';
import {Calendar, momentLocalizer, Views} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Grid,
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Container,
  Divider,
  Modal,
  Stack,
  TextField,
  TextareaAutosize,
  CardActionArea,
  IconButton,
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import MarirongHeader from '../utils/MarirongHeader';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FabMuiTable from '../utils/MuiTable';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddActivity from './AddActivity';
import PromptModal from './modals/PromptModal';
import { getEvents, deleteEvent } from '../../apis/EventsManagement'
import { STORAGE_URL } from '../../config';

const localizer = momentLocalizer(moment);

const Events = (props) => {

  const [activity, setActivity] = useState([]);

  useEffect(() => {
    getAllEvents()
  },[])

  const getAllEvents = () => {
    getEvents((response) => {
      console.log(response)
      if(response.status){
        setActivity(response.data)
      }
    })
  }

  const columns = [
    {name: 'title', label: 'Activity name'},
    {name: 'desc', label: 'Activity details'},
    {name: 'start', label: 'Start date'},
    {name: 'end', label: 'End date'},
    {name: 'actions', labek: 'Actions'},
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

  const [calendarEvent, setCalendarEvent] = useState([]);
  const [slotInfo, setSlotInfo] = useState([]);
  const [openAddActivityModal, setOpenAddActivityModal] = useState(false)
  const [activityAction, setActivityAction] = useState("")

  const [openPrompt, setOpenPrompt] = useState(false)
  const [promptTitle, setPromptTitle] = useState("")
  const [notifMessage, setNotifMessage] = useState("")
  const [errorPrompt, setErrorPrompt] = useState(false)
  const [confirmation, setConfirmation] = useState(false)

  useEffect(() => {
    getAllEvents()
  },[calendarEvent])

  const {views} = useMemo(
    () => ({
      views: {
        month: true,
      },
    }),
    [],
  );

  const [deleteID,setDeleteID] = useState(null)

  const confirmDelete = (response) => {
    setActivityAction("delete")
    console.log("Confirm",response)
    setOpenPrompt(true)
    setErrorPrompt(false)
    setPromptTitle("Are you sure you want to delete this event?")
    setNotifMessage("This event will be deleted immediately.")
    setConfirmation(true)
    setDeleteID(response)
  }

  const handleDelete = () => {
    deleteEvent({activity_id: calendarEvent.id}, (response) => {
      if(response.status == true){
        setOpenPrompt(true)
        setErrorPrompt(false)
        setPromptTitle("Success")
        setNotifMessage("Activity successfully deleted!", response.message)
        setConfirmation(false)
        getAllEvents()
      }
      else{
        setOpenPrompt(true)
        setErrorPrompt(true)
        setPromptTitle("Fail")
        setNotifMessage(response.message)
        setConfirmation(false)
      }
      console.log(response)
    })
  }

  const ActivityCard = () => {
    const [editModal, setEditModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);

    const closeEditModal = () => {
      let id = calendarEvent.id;
      let current_activities = activity.filter(e => e.id !== id);
      current_activities.push(calendarEvent);
      setActivity(current_activities);
    };
    const editCard = () => {
      setEditModal(true);
    };
    const editActivity = (field, value) => {
      calendarEvent[field] = value;
      setCalendarEvent(calendarEvent);
    };

    const deleteCard = () => {
      let id = calendarEvent.id;
      let current_activities = activity.filter(e => e.id !== id);
      setActivity(current_activities);
      setCalendarEvent([]);
    };

    const viewCardOpen = () => {
      setViewModal(true)
      console.log(calendarEvent.id)
    };
    const viewCardClose = () => setViewModal(false);

    return (
      <div>
        {calendarEvent.id !== undefined ? (
          <Fragment>
            <Card sx={{mb: 1}}>
              <CardActionArea onClick={viewCardOpen}>
                <CardContent sx={{pl: 0}}>
                  <Grid sx={{display: 'flex', flexDirection: 'row'}}>
                    <Grid>
                      <Container>
                        <CircleIcon color="warning" fontSize="large" />
                      </Container>
                    </Grid>
                    <Grid>
                      <Typography variant="h5" component="div">
                        {calendarEvent.title}
                      </Typography>
                      <Typography sx={{mb: 1}} color="text.secondary">
                        {moment(calendarEvent.start).format('LLL')} -{' '}
                        {moment(calendarEvent.end).format('LLL')}
                      </Typography>
                      <Typography variant="body1">{calendarEvent.place}</Typography>
                      <Typography variant="body1">{calendarEvent.note}</Typography>
                      <Fragment>
                            {calendarEvent.file && (
                              <Box mt={2} textAlign="center">
                                <div style={{marginBottom: 10}}>Uploaded Image:</div>
                                <img
                                  src={`${STORAGE_URL}/${calendarEvent.file}`}
                                  alt={calendarEvent.file}
                                  height="auto"
                                  width="100%"
                                />
                              </Box>
                            )}
                      </Fragment>
                    </Grid>
                  </Grid>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Grid container direction='row' justifyContent='center'>
                  <Button
                    startIcon={<DeleteIcon />}
                    color="error"
                    onClick={() => {
                      confirmDelete()
                    }}
                    sx={{marginRight: 2}}>
                    Delete
                  </Button>
                  <Button startIcon={<EditIcon />} 
                    onClick={() => {
                      setOpenAddActivityModal(true)
                      setActivityAction("edit")
                    }}
                  >
                    Edit
                  </Button>
                </Grid>
              </CardActions>
            </Card>
        <Modal open={viewModal}>
        <Box sx={modalStyle}>
          <Grid container>
            <Grid item xs={11}>
              <Typography variant="h6" component="h2">
                Activity for {moment(calendarEvent.start).format('LL')}
              </Typography>
            </Grid>
            <Grid item xs={1}>
                <IconButton onClick={viewCardClose}>
                    <CloseIcon/>
                </IconButton>
            </Grid>
          </Grid>
          <Typography sx={{ mt: 2 }}>
            <b>Activity name:</b>&nbsp;{calendarEvent.title}<br/>
            <b>Activity place:</b>&nbsp;{calendarEvent.place}<br/>
            <b>Activity note:</b>&nbsp;{calendarEvent.note}<br/>
          </Typography>
        </Box>
      </Modal>
          </Fragment>
      ): (
        <Card>
          <CardContent sx={{pl: 0}}>
            <Grid sx={{display: 'flex', flexDirection: 'row'}}>
              <Grid>
                <Container>
                  <CircleIcon color="primary" fontSize="large" />
                </Container>
              </Grid>
              <Grid>
                <Typography sx={{mb: 1}} color="text.secondary">
                  {moment(calendarEvent.start).format('LL')}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
       </div>
    );
  };

  return (
    <Grid container>
      <AddActivity 
        slotInfo={slotInfo} 
        openModal={openAddActivityModal} 
        setOpenModal={setOpenAddActivityModal} 
        calendarEvent={calendarEvent}
        action={activityAction}
        getAllEvents={getAllEvents}
      />
      <PromptModal
        isOpen={openPrompt}
        error={errorPrompt}
        title={promptTitle}
        setOpenModal={setOpenPrompt}
        notifMessage={notifMessage}
        confirmation={confirmation}
        callback={ (response) => {
          if(response == true) {
            if(activityAction=="delete"){
              handleDelete()
            }
          }
          else if(response == false){
            // setDeleteID(null)
          }
          
        }}
      />
      <Grid item xs={9} sm={9} md={9} lg={9} sx={{padding: 4}}>
        <Calendar
          selectable={true}
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="month"
          events={activity}
          startAccessor="start"
          endAccessor="end"
          modalStyle={{height: '90vh'}}
          views={views}
          selected
          onSelectEvent={setCalendarEvent}
          onSelectSlot={e => {
            setSlotInfo(e)
          }}
        />
      </Grid>
      <Grid item xs={3} sm={3} md={3} lg={3} sx={{padding: 2}}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            m: 2,
            marginLeft: 0,
            marginTop: 1,
            borderRadius: 2,
            padding: 2,
            maxWidth: '100%',
            height: 650,
            backgroundColor: '#ebf6ff',
          }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            component="div"
            sx={{mb: 1}}>
            {' '}
            Activity Details{' '}
          </Typography>
          <Divider />
          <Box>
            <Card sx={{mb: 1}}>
              <CardContent sx={{alignItems: 'center', mt: 1}}>
                  <Button variant="outlined" sx={{}} 
                    onClick={() => {
                      setOpenAddActivityModal(true)
                      setActivityAction("add")
                    }}
                  >
                    <Typography style={{fontWeight: 'bold'}}>
                      Add Activity for {moment(slotInfo.start).format('LL')}
                    </Typography>
                  </Button>
              </CardContent>
            </Card>
            <ActivityCard />
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} sx={{padding: 2}}>
        <Typography variant="h5" sx={{marginBottom: 4}}>
          Summary of activities
        </Typography>
        <FabMuiTable
          data={{
            columns: columns,
            rows: activity,
          }}
          options={options}
        />
      </Grid>
    </Grid>
  );
};

export default Events;

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxWidth: 500,
};

import React, {useMemo, div, useState, useEffect} from 'react';
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
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import MarirongHeader from '../utils/MarirongHeader';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import AddCircleOutlined from '@mui/icons-material/AddCircleOutlined';
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

  // const eventsData = [
  //   {
  //     // id: 1,
  //     start: '2023-01-08 08:05',
  //     end: '2023-01-08 15:45',
  //     title: 'LEWC training',
  //     desc: 'Datalogger system maintenance training',
  //     // action: 'click',
  //   },
  //   {
  //     // id: 2,
  //     start: '2023-01-15 09:10',
  //     end: '2023-01-17 15:30',
  //     title: 'Community Risk Assessment',
  //     desc: 'CRA with the Brgy. Marirong Community',
  //     action: 'click',
  //   },
  //   {
  //     // id: 3,
  //     start: '2023-01-20 09:30',
  //     end: '2023-01-20 12:00',
  //     title: 'Stakeholder meeting',
  //     desc: 'Landslide preparedness drill',
  //     action: 'click',
  //   },
  // ];

  const [calendarEvent, setCalendarEvent] = useState([]);
  const [slotInfo, setSlotInfo] = useState([]);
  const [openAddActivityModal, setOpenAddActivityModal] = useState(false)
  const [activityAction, setActivityAction] = useState("")

  const [openPrompt, setOpenPrompt] = useState(false)
  const [promptTitle, setPromptTitle] = useState("")
  const [notifMessage, setNotifMessage] = useState("")
  const [errorPrompt, setErrorPrompt] = useState(false)
  const [confirmation, setConfirmation] = useState(false)


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
        setNotifMessage(response.message)
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

    return (
      <Card sx={{mb: 1}}>
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
              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
                paddingTop={2}>
                <Button
                  startIcon={<DeleteIcon />}
                  color="error"
                  onClick={() => {
                    confirmDelete()
                  }}>
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
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
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
                    Add Activity for {moment(slotInfo.start).format('LL')}
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

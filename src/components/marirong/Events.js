import React, {useMemo, div, useState} from 'react';
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
import LipataHeader from '../utils/LipataHeader';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import AddCircleOutlined from '@mui/icons-material/AddCircleOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FabMuiTable from '../utils/MuiTable';

const localizer = momentLocalizer(moment);

const Events = () => {
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

  const eventsData = [
    {
      id: 1,
      start: '2022-09-08 08:05',
      end: '2022-09-08 15:45',
      title: 'LEWC training',
      desc: 'Datalogger system maintenance training',
      action: 'click',
    },
    {
      id: 2,
      start: '2022-09-15 09:10',
      end: '2022-09-15 15:30',
      title: 'Community Risk Assessment',
      desc: 'CRA with the Brgy. Marirong Community',
      action: 'click',
    },
    {
      id: 3,
      start: '2022-09-20 09:30',
      end: '2022-09-20 12:00',
      title: 'Stakeholder meeting',
      desc: 'Landslide preparedness drill',
      action: 'click',
    },
  ];

  const [calendarEvent, setCalendarEvent] = useState([]);
  const [slotInfo, setSlotInfo] = useState([]);
  const [activity, setActivity] = useState(eventsData);

  const {views} = useMemo(
    () => ({
      views: {
        month: true,
      },
    }),
    [],
  );

  const AddActivity = () => {
    const [openModal, setOpenModal] = useState(false);
    const [timePicker, setTimePicker] = useState(null);
    const [activityName, setActivityName] = useState('');
    const [activityDesc, setActivityDesc] = useState('');
    const [isConfirm, setIsConfirm] = useState(false);

    const handleOpen = () => {
      setOpenModal(true);
      setIsConfirm(false);
    };

    const handleClose = () => {
      setOpenModal(false);
    };

    const handleSubmit = () => {
      setIsConfirm(!isConfirm);
    };

    const handleActivity = () => {
      let activity_length = activity.length;
      setOpenModal(false);
      let temp = [...activity];
      temp.push({
        id: activity_length + 1,
        start: moment(slotInfo.start).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(slotInfo.end).format('YYYY-MM-DD HH:mm:ss'),
        title: activityName,
        desc: activityDesc,
        action: 'click',
      });
      setActivity(temp);
    };

    return (
      <Card sx={{mb: 1}}>
        <CardContent sx={{alignItems: 'center', mt: 1}}>
          <Button variant="outlined" sx={{}} onClick={handleOpen}>
            Add Activity for {moment(slotInfo.start).format('LL')}
          </Button>
          <Modal
            open={openModal}
            onClose={handleClose}
            aria-labelledby="title"
            aria-describedby="description">
            {!isConfirm ? (
              <div>
                <Box sx={modalStyle}>
                  <Typography
                    id="title"
                    variant="h5"
                    component="h4"
                    marginBottom={2}>
                    Activity for {moment(slotInfo.start).format('LL')}
                  </Typography>
                  <Divider />
                  <Stack spacing={1} paddingTop={2}>
                    <TextField
                      label="Name of activity"
                      variant="outlined"
                      value={activityName}
                      onChange={e => setActivityName(e.target.value)}
                      fullWidth
                    />
                    <TextField
                      label="Description of activity"
                      variant="standard"
                      value={activityDesc}
                      onChange={e => setActivityDesc(e.target.value)}
                      multiline
                      fullWidth
                    />
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="flex-end"
                    paddingTop={5}>
                    <Button
                      variant="text"
                      color="error"
                      startIcon={<DoNotDisturbIcon />}
                      onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      endIcon={<AddCircleOutlined />}
                      onClick={handleSubmit}>
                      Add activity
                    </Button>
                  </Stack>
                </Box>
              </div>
            ) : (
              <div style={{overflowWrap: 'anywhere'}}>
                <Box sx={modalStyle}>
                  <h1>Are you sure?</h1>
                  <Divider />
                  <h3>Activity Name: </h3>
                  {activityName}
                  <h3>Activity Description:</h3>
                  <Typography variant="body1" gutterBottom>
                    {activityDesc}
                  </Typography>
                  <Divider />
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="flex-end"
                    paddingTop={2}>
                    <Button onClick={handleActivity}>Yes</Button>
                    <Button onClick={handleSubmit}>No</Button>
                  </Stack>
                </Box>
              </div>
            )}
          </Modal>
        </CardContent>
      </Card>
    );
  };

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
              <Typography variant="body1">{calendarEvent.desc}</Typography>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
                paddingTop={2}>
                <Button
                  startIcon={<DeleteIcon />}
                  color="error"
                  onClick={deleteCard}>
                  Delete
                </Button>
                <Button startIcon={<EditIcon />} onClick={editCard}>
                  Edit
                </Button>
              </Stack>
              <Modal
                open={editModal}
                onClose={closeEditModal}
                aria-labelledby="title">
                <div>
                  <Box sx={modalStyle}>
                    <Typography
                      id="title"
                      variant="h5"
                      component="h4"
                      marginBottom={2}>
                      Edit activity details for{' '}
                      {moment(calendarEvent.start).format('LL')}
                    </Typography>
                    <h4>Activity name:</h4>
                    <TextField
                      defaultValue={calendarEvent.title}
                      onChange={e => editActivity('title', e.target.value)}
                    />
                    <h4>Activity description:</h4>
                    <TextField
                      defaultValue={calendarEvent.desc}
                      onChange={e => editActivity('desc', e.target.value)}
                      multiline
                    />
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="flex-end"
                      paddingTop={2}>
                      <Button onClick={() => setEditModal(false)} color="error">
                        Cancel
                      </Button>
                      <Button onClick={closeEditModal}>Accept edit</Button>
                    </Stack>
                  </Box>
                </div>
              </Modal>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  return (
    <Grid container>
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
          onSelectSlot={setSlotInfo}
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
            <AddActivity />
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

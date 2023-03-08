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
  IconButton,
  Tooltip,
} from '@mui/material';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import AddCircleOutlined from '@mui/icons-material/AddCircleOutlined';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { addEvent } from '../../apis/EventsManagement'
import PromptModal from './modals/PromptModal';
import { SentimentDissatisfied } from '@mui/icons-material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const localizer = momentLocalizer(moment);
const AddActivity = (props) => {

    const {slotInfo, openModal, setOpenModal, action, calendarEvent, getAllEvents, setEditElement} = props

    const [eventName, setEventName] = useState("")
    const [eventPlace, setEventPlace] = useState("")
    const [eventNote, setEventNote] = useState("")
    const [eventStartDate, setEventStartDate] =useState()
    const [eventEndDate, setEventEndDate] =useState()
    const [eventID, setEventID] = useState(0)
    const [selectedImage, setSelectedImage] = useState(null)
    const [imageUrl, setImageUrl] = useState(null)
      
    // const [openModal, setOpenModal] = useState(false);
    const [isConfirm, setIsConfirm] = useState(false);

    const [openPrompt, setOpenPrompt] = useState(false)
    const [notifMessage, setNotifMessage] = useState("")
    const [errorPrompt, setErrorPrompt] = useState(false)

    useEffect(() => {
        if(action=="add"){
            resetValues()
        }
        else if(action=="edit"){
            console.log(calendarEvent)
            setEventName(calendarEvent.title)
            setEventPlace(calendarEvent.place)
            setEventNote(calendarEvent.note)
            setEventStartDate(new Date(calendarEvent.start))
            setEventEndDate(new Date(calendarEvent.end))
            setEventID(calendarEvent.id)
            setImageUrl(calendarEvent.file)
            setIsConfirm(false)
        }
    },[props])

    useEffect(() => {
        if (selectedImage) {
          const file = URL.createObjectURL(selectedImage);
          setImageUrl(file);
        }
      }, [selectedImage]);

    const handleOpen = () => {
        setOpenModal(true);
        setIsConfirm(false);
    };

    const resetValues = () => {
        setEventID(0);
        setEventName('');
        setEventPlace('');
        setEventNote('');
        setImageUrl(null);
        setEventStartDate(slotInfo.start)
        setEventEndDate(slotInfo.start)
    }

    const handleClose = () => {
        setOpenModal(false);
        resetValues();
        setEditElement(null)
    };

    const handleSubmit = () => {
        setIsConfirm(!isConfirm);
    };

    const handleActivity = () => {

        const formData = new FormData();
        formData.append('activity_id', action === "add" ? 0 : eventID);
        formData.append('start_date', moment(eventStartDate).format('YYYY-MM-DD HH:mm:ss'));
        formData.append('end_date', moment(eventEndDate).format('YYYY-MM-DD HH:mm:ss'))
        formData.append('activity_name', eventName);
        formData.append('activity_place', eventPlace);
        formData.append('activity_note', eventNote);
        formData.append('file', selectedImage);
        console.log(formData)
        setIsConfirm(false)

        addEvent(formData, (response) => {
            if(response.status){
                console.log(formData)
                setOpenPrompt(true)
                setErrorPrompt(false)
                setNotifMessage(response.feedback)
                setOpenModal(false);
                getAllEvents()
                setEditElement(null)
            }
            else{
                setOpenPrompt(true)
                setErrorPrompt(true)
                setNotifMessage(response.feedback)
                setOpenModal(false);
                setEditElement(null)
            }
        })
        
    };

    return (
        <Card sx={{mb: 1}}>
            <PromptModal
                isOpen={openPrompt}
                error={errorPrompt}
                setOpenModal={setOpenPrompt}
                notifMessage={notifMessage}
            />
            
            <Modal
                open={openModal}
                onClose={handleClose}
                aria-labelledby="title"
                aria-describedby="description">
                {!isConfirm ? (
                    <div>
                    <Box sx={modalStyle}>
                        <Stack
                            direction="row"
                            spacing={7}>
                            <Typography
                                id="title"
                                variant="h5"
                                component="h4">
                                Activity for {action === "add" ? moment(slotInfo.start).format('LL')
                                        : moment(calendarEvent.start).format('LL')}
                            </Typography>
                            <input
                                accept="image/*"
                                type="file"
                                id="select-image"
                                style={{display: 'none'}}
                                onChange={e => setSelectedImage(e.target.files[0])}
                            />
                                <Tooltip title="Add a photo">
                                    <IconButton color="primary">
                                        <label htmlFor="select-image">
                                            <AddPhotoAlternateIcon fontSize='medium'/>
                                        </label> 
                                    </IconButton>
                                </Tooltip>
                        </Stack>
                        <Divider />
                        <Stack spacing={1} paddingTop={2}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Box flexDirection={"row"} style={{paddingTop: 10}}>
                            <DateTimePicker
                                label="Event Start"
                                value={eventStartDate}
                                onChange={(e) => {
                                    setEventStartDate(moment(new Date(e)).format("YYYY-MM-DD HH:mm:ss"))
                                }}
                                renderInput={(params) => <TextField style={{width: '49%', marginRight: '2%'}} {...params} />}
                            />
                            <DateTimePicker
                                label="Event End"
                                value={eventEndDate}
                                onChange={(e) => {
                                    setEventEndDate(moment(new Date(e)).format("YYYY-MM-DD HH:mm:ss"))
                                }}
                                renderInput={(params) => <TextField style={{width: '49%'}} {...params} />}
                            />
                            </Box>
                        </LocalizationProvider>
                        <TextField
                            id="outlined-required"
                            placeholder="Ex: CBEWS-L Seminar"
                            label="Name of Activity"
                            variant="outlined"
                            value={eventName}
                            // style={{width: '100%', paddingBottom: 10}}
                            onChange={e => {
                            e.preventDefault()
                            setEventName(e.target.value)
                            }}
                        />
                        <TextField
                            id="outlined-required"
                            placeholder="Ex: Brgy. Hall"
                            label="Place of Activity"
                            variant="outlined"
                            value={eventPlace}
                            // style={{width: '100%', paddingBottom: 10}}
                            onChange={e => {
                            setEventPlace(e.target.value)
                            }}
                        />
                        <TextField
                            id="outlined-required"
                            placeholder="**additional info**"
                            label="Description"
                            variant="outlined"
                            value={eventNote}
                            multiline
                            rows = {3}
                            // style={{width: '100%', paddingBottom: 10}}
                            onChange={e => {
                            setEventNote(e.target.value)
                            }}
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
                            {action=="add" ? "Add Activity" : "Edit Activity"}
                        </Button>
                        </Stack>
                    
                    <Divider sx={{marginTop: 2, marginBottom: 2}}/>
                    {imageUrl && selectedImage && (
                        <Box mt={2} textAlign="center">
                            <div style={{marginBottom: 10}}>Preview:</div>
                            <img
                            src={imageUrl}
                            alt={selectedImage.name}
                            height="auto"
                            width="50%"
                            />
                        </Box>
                    )}
                    </Box>
                    </div>
                ) : (
                    <div style={{overflowWrap: 'anywhere'}}>
                    <Box sx={modalStyle}>
                        <h1>Are you sure?</h1>
                        <Divider />
                        <h3>Activity Name: </h3>
                        {eventName}
                        <h3>Activity Place: </h3>
                        {eventPlace}
                        <h3>Activity Description:</h3>
                        <Typography variant="body1" gutterBottom>
                        {eventNote}
                        </Typography>
                        <Divider />
                        <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="flex-end"
                        paddingTop={2}>
                        <Button onClick={()=>{handleActivity()}}>Yes</Button>
                        <Button onClick={()=>{handleSubmit()}}>No</Button>
                        </Stack>
                    </Box>
                    </div>
                )}
            </Modal>
        </Card>
    );
};

export default AddActivity;


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
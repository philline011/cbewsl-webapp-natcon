import { Fragment, useEffect, useState } from 'react';
import {FormControl, IconButton, Avatar, Button, 
        Container, Grid, Typography, Card, TextField,
        CardActions, CardContent, CardMedia, InputLabel, 
        MenuItem, Select, Tooltip} from '@mui/material'
import UMIDrone from '../../assets/umi_drone.png';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DesktopDatePicker} from '@mui/x-date-pickers/DesktopDatePicker';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import moment from 'moment';
import { updateProfile } from '../../apis/ProfileUpdating';
import { STORAGE_URL } from '../../config';


const ProfileSettings = () => {

    const [userID, setUserID] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [suffix, setSuffix] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [designation, setDesignation] = useState('');
    const [birthdate, setBirthdate] = useState(null);
    const [mobileNum, setMobileNum] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    const handleGender = event => {
        setGender(event.target.value);
      };
    
    const handleDesignation = event => {
        setDesignation(event.target.value);
      };

    const handleBday = newValue => {
        setBirthdate(newValue);
      };

    const handleSuffix = event => {
        setSuffix(event.target.value);
      };

    useEffect(() => {
       if (profilePicture) {
         const file = URL.createObjectURL(profilePicture);
         setImageUrl(file);
       }
     }, [profilePicture]);

    // useEffect(() => {
    //     const data = localStorage.getItem('credentials');
    //     const parse_data = JSON.parse(data);
    //     const first_name = parse_data.user.first_name ? parse_data.user.first_name : parse_data.user.firstname;
    //     const last_name = parse_data.user.last_name ? parse_data.user.last_name : parse_data.user.lastname;
    //     const middle_name = parse_data.user.middle_name ? parse_data.user.middle_name : parse_data.user.middlename;
    //     const suffix = parse_data.user.suffix;
    //     const gender = parse_data.user.sex ? parse_data.user.sex : parse_data.user.gender;
    //     const address = parse_data.profile.address ? parse_data.profile.address : parse_data.user.address;
    //     const designation = parse_data.profile.designation_details.id;
    //     const birthday = parse_data.user.birthday ? parse_data.user.birthday : parse_data.user.kaarawan;
    //     const mobile_no = parse_data.mobile_no ? parse_data.mobile_no : parse_data.user.mobile_number;
    //     const user_id = parse_data.profile.user_id;
    //     const profile_picture = parse_data.profile.pic_path !== "" ? `${STORAGE_URL}/${parse_data.profile.pic_path}` : "";
    //     setFirstName(first_name);
    //     setLastName(last_name);
    //     setMiddleName(middle_name);
    //     setSuffix(suffix);
    //     setGender(gender);
    //     setAddress(address);
    //     setDesignation(designation);
    //     setBirthdate(birthday);
    //     setMobileNum(mobile_no);
    //     setUserID(user_id);
    //     setImageUrl(profile_picture)
    //   }, []);

    const designation_list = [
        {id: 1, designation: 'LEWC'},
        {id: 2, designation: 'BLGU'},
        {id: 3, designation: 'MLGU'},
        {id: 4, designation: 'PLGU'},
      ];

    const handleUpdate = () => {
        const updatedBday = moment(new Date(birthdate)).format('YYYY-MM-DD');
        const designation_id = designation_list.find(e => e.id === parseInt(designation)).id;
        console.log(profilePicture.name)
        const form_data = new FormData();
        form_data.append('id', userID);
        form_data.append('firstname', firstName);
        form_data.append('middlename', middleName);
        form_data.append('lastname', lastName);
        form_data.append('suffix', suffix);
        form_data.append('gender', gender);
        form_data.append('address', address);
        form_data.append('designation_id', designation_id);
        form_data.append('kaarawan', updatedBday);
        form_data.append('nickname', firstName);
        form_data.append('mobile_number', mobileNum);
        form_data.append('file', profilePicture);
        

        const input = {
            first_name: firstName,
            last_name: lastName,
            middle_name: middleName,
            suffix: suffix,
            sex: gender,
            birthday: updatedBday,
            nickname: firstName,
        }
        const prof_input = {
            address: address,
            designation_id: designation_id,
            pic_path: profilePicture.name,
        }
        
        // updateProfile(form_data, data => {
        //     const {status, message} = data;
        //     if (status) {
        //         const credentials = localStorage.getItem('credentials')
        //         const parsed_credentials = JSON.parse(credentials);
        //         const updated_input = {
        //             ...parsed_credentials
        //         }
        //         console.log(parsed_credentials)
        //         updated_input.user = {...updated_input.user, ...input}
        //         updated_input.profile = {...updated_input.profile, ...prof_input}
        //         localStorage.setItem('credentials', JSON.stringify(updated_input))
        //         window.location.reload(true)
        //         console.log("Success!", message)
        //     } else {
        //         console.log("Failed!", message)
        //     }

        // })
      }

    return (
        <Fragment>
            <Container maxWidth="md">
                <Grid container style={{paddingTop: '10%'}}>
                        <Card sx={{ maxWidth: 800}}>
                            <CardMedia
                                component="img"
                                alt="lewc"
                                image={UMIDrone}
                                height="200"
                            />
                            <CardContent>
                                <Grid container>
                                    <Grid item xs={3} 
                                        sx={{marginTop: -10, marginBottom: 5}}
                                        justify="center">
                                            <input
                                                accept="image/*"
                                                type="file"
                                                id="select-image"
                                                style={{display: 'none'}}
                                                onChange={e =>
                                                    setProfilePicture(e.target.files[0])}
                                            />
                                            <Tooltip title="Edit profile picture">
                                                    <IconButton>
                                                    <label htmlFor="select-image">
                                                    <Avatar
                                                        sx={{ bgcolor: 'gray', width: 150, height: 150}}
                                                        alt={firstName}
                                                        src={imageUrl}
                                                        />
                                                        </label>
                                                    </IconButton>
                                            </Tooltip>
                                    </Grid>
                                    <Grid item xs={9} justifyContent='flex-start'>
                                        <Typography variant='h4'>{firstName}&nbsp;{lastName}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography>First Name</Typography>
                                        <TextField id="outlined-basic" 
                                                variant="outlined"
                                                value={firstName}
                                                onChange={e => setFirstName(e.target.value)}
                                                fullWidth/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography>Last Name</Typography>
                                        <TextField id="outlined-basic" 
                                                variant="outlined" 
                                                value={lastName}
                                                onChange={e => setLastName(e.target.value)}
                                                fullWidth/>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Typography>Middle Name</Typography>
                                        <TextField id="outlined-basic" 
                                                variant="outlined" 
                                                value={middleName}
                                                onChange={e => setMiddleName(e.target.value)}
                                                fullWidth />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography>Suffix</Typography>
                                        <FormControl fullWidth >
                                            <Select
                                                labelId="demo-simple-select-label"
                                                value={suffix}
                                                onChange={handleSuffix}>
                                                    <MenuItem value={''}>{'<none>'}</MenuItem>
                                                    <MenuItem value={'Jr'}>Jr</MenuItem>
                                                    <MenuItem value={'Sr'}>Sr</MenuItem>
                                                    <MenuItem value={'II'}>II</MenuItem>
                                                    <MenuItem value={'III'}>III</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography>Gender</Typography>
                                        <FormControl fullWidth>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                value={gender}
                                                onChange={handleGender}>
                                                    <MenuItem value={'Male'}>Male</MenuItem>
                                                    <MenuItem value={'Female'}>Female</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography>Designation</Typography>
                                        <FormControl fullWidth>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                value={designation}
                                                onChange={handleDesignation}>
                                                    <MenuItem value={'1'}>LEWC</MenuItem>
                                                    <MenuItem value={'2'}>BLGU</MenuItem>
                                                    <MenuItem value={'3'}>MLGU</MenuItem>
                                                    <MenuItem value={'4'}>PLGU</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography>Address</Typography>
                                        <TextField id="outlined-basic" 
                                                variant="outlined"
                                                value={address}
                                                onChange={e => setAddress(e.target.value)}
                                                fullWidth 
                                                multiline 
                                                rows={2}/>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography>Birthdate</Typography>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DesktopDatePicker
                                                inputFormat="YYYY/MM/DD"
                                                value={birthdate}
                                                required
                                                onChange={handleBday}
                                                renderInput={params => <TextField {...params} />}
                                            />
                                            </LocalizationProvider>
                                    </Grid>
                                </Grid>
                            </CardContent>
                            <CardActions>
                                <Grid container justifyContent='center'>
                                    <Button variant='contained' onClick={handleUpdate}>
                                        Save
                                    </Button>
                                </Grid>
                            </CardActions>
                        </Card>
                    </Grid>
            </Container>
        </Fragment>
    )
}

export default ProfileSettings;
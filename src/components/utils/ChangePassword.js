import { Fragment, useEffect, useState } from 'react';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import Button from '@mui/material/Button';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import { VerifyOldPassword, UpdatePassword } from '../../apis/UserManagement';

const ChangePassword = () => {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isOldPassCorrect, setIsOldPassCorrect] = useState(false);

    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    const handleSave = () => {

        let credentials = JSON.parse(localStorage.getItem('credentials'));
        VerifyOldPassword(oldPass, credentials.user.user_id, (response)=> {
            if (response.status === true) {
                if (newPass === confirmPass) {
                    UpdatePassword(credentials.user.user_id, newPass, (response)=> {
                        if (response.status === true) {
                            setOldPass('');
                            setNewPass('');
                            setConfirmPass('');
                        }
                    });
                } else {
                    console.log("DI MATCH");
                }
            } else {
                console.log("DI MATCH")
            }
        });
    }

    return (
        <Fragment>
            <Container maxWidth="sm">
                <Grid container spacing={5} sx={{textAlign: 'center', width: '100%'}} 
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    style={{ minHeight: '60vh' }}>
                    <Grid item xs={12}>
                        <Typography variant="h3" style={{fontWeight: 500}}>
                            Change Password
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel htmlFor="outlined-basic" sx={{textAlign: 'left'}}>Old Password</InputLabel>
                        <OutlinedInput id="outlined-basic" 
                            onChange={(e)=> { setOldPass(e.target.value)}}
                            type={showOldPassword ? 'text' : 'password'}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => { setShowOldPassword(!showOldPassword)}} 
                                    onMouseDown={() => { }}
                                    edge="end"
                                >
                                {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            }
                            sx={{width: '50vh'}}/>
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel htmlFor="outlined-basic-new" sx={{textAlign: 'left'}}>New Password</InputLabel>
                        <OutlinedInput id="outlined-basic-new" 
                            onChange={(e)=> { setNewPass(e.target.value)}}
                            type={showNewPassword ? 'text' : 'password'}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => { setShowNewPassword(!showNewPassword)}} 
                                    onMouseDown={() => { }}
                                    edge="end"
                                >
                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            }
                            sx={{width: '50vh'}}/>
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel htmlFor="outlined-basic-confirm" sx={{textAlign: 'left'}}>Confirm Password</InputLabel>
                        <OutlinedInput id="outlined-basic-confirm" 
                            onChange={(e)=> { setConfirmPass(e.target.value)}}
                            type={showConfirmPassword ? 'text' : 'password'}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => { setShowConfirmPassword(!showConfirmPassword)}} 
                                    onMouseDown={() => { }}
                                    edge="end"
                                >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            }
                            sx={{width: '50vh'}}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" sx={{width: '20vh'}} onClick={handleSave}>Save</Button>
                    </Grid>
                </Grid>
            </Container>
        </Fragment>
    )
}

export default ChangePassword;
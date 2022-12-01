import React, {Fragment, useState} from 'react';
import {
  Grid,
  Typography,
  Button,
  Box,
  Modal,
  TextField,
  Checkbox,
  FormLabel,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
} from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const Feedback = () => {
    const [issue, setIssue] = useState('');

    const handleChange = (event) => {
        setIssue(event.target.value);
    };
    return(
        <Grid item xs={12} sx={{padding: 8}}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <Box elevato>
                    <Typography variant="h5" sx={{marginBottom: 4}}>
                        Feedback
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                       <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography>
                                    {"<Name>"}
                                </Typography>
                                <Typography>
                                    {"<Stakeholders Group>"}
                                </Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Subject</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={issue}
                                        label="Subject"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={"CBEWS-L Web app"}>CBEWS-L Web app</MenuItem>
                                        <MenuItem value={"Monitoring Operations"}>Monitoring Operations</MenuItem>
                                        <MenuItem value={"Suggestions"}>Suggestions</MenuItem>
                                        <MenuItem value={"Others"}>Others</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                            <TextField
                                id="standard-multiline-static"
                                label="Concern"
                                multiline
                                rows={10}
                                defaultValue="E.g. Dashboard not working"
                                variant="outlined"
                                style={{width: '100%'}}
                            />
                            </Grid>
                       </Grid>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Submit Feedback</Button>
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    )
}

export default Feedback;
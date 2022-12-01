import React, {Fragment} from 'react';
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
  Divider,
  IconButton
} from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import FolderIcon from '@mui/icons-material/Folder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DeleteIcon from '@mui/icons-material/Delete';

const Resources = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [directory, setDirectory] = React.useState([]);
  const [isList, setList] = React.useState(false);
  const [files, setFiles] = React.useState(Array(10).fill({'name':'filename', 'size': '100kb'}));

  return (
    <Grid item xs={12} sx={{padding: 8}}>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Box>
          <Typography variant="h5" sx={{marginBottom: 4, textAlign: directory.length == 0 ? 'left':'right'}}>
            {
                
                directory.length == 0 ? "Resources" : "PATH: "+directory.map((path) => (
                    `/${path}`
                ))
            }
            {
                directory.length != 0 &&             
                    <IconButton onClick={()=> {
                        setList(!isList);
                    }} arial-label="edit" component="span">
                        <ViewModuleIcon style={{height: 50, width: 50}}/>
                    </IconButton>
            }
          </Typography>
          <Button
                variant="contained"
                sx={{float: 'right', mx: 1}}
                onClick={e => {

                }}>
                Upload File
           </Button>
          {
            directory.length != 0 && 
            <IconButton onClick={()=> {
                let temp = [...directory];
                temp.pop()
                setDirectory(temp);
            }} arial-label="edit" component="span">
                <ArrowBackIcon style={{height: 50, width: 50}}/>
            </IconButton>
          }
        </Box>
      </Grid>
      {
        directory.length == 0 ? 
        <Grid item xs={12}>
        <Grid container align="center">
            <Grid item xs={3} md={3} lg={3}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <IconButton onClick={()=> {
                            let temp = [...directory];
                            temp.push("ADVISORIES")
                            setDirectory(temp);
                        }} arial-label="edit" component="span">
                            <FolderIcon style={{height: 200, width: 200}}/>
                        </IconButton>
                        <Typography style={{fontWeight: 'bold'}}>ADVISORIES</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <IconButton onClick={()=> {
                            let temp = [...directory];
                            temp.push("REPORTS")
                            setDirectory(temp);
                        }} arial-label="edit" component="span">
                            <FolderIcon style={{height: 200, width: 200}}/>
                        </IconButton> 
                        <Typography style={{fontWeight: 'bold'}}>REPORTS</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={3} md={3} lg={3}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <IconButton onClick={()=> {
                            let temp = [...directory];
                            temp.push("COMMUNICATIONS")
                            setDirectory(temp);
                        }} arial-label="edit" component="span">
                            <FolderIcon style={{height: 200, width: 200}}/>
                        </IconButton>
                        <Typography style={{fontWeight: 'bold'}}>COMMUNICATIONS</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <IconButton onClick={()=> {
                            let temp = [...directory];
                            temp.push("RESOURCE CAPABILITIES")
                            setDirectory(temp);
                        }} arial-label="edit" component="span">
                            <FolderIcon style={{height: 200, width: 200}}/>
                        </IconButton> 
                        <Typography style={{fontWeight: 'bold'}}>RESOURCE CAPABILITIES</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={3} md={3} lg={3}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <IconButton onClick={()=> {
                            let temp = [...directory];
                            temp.push("IEC MATERIALS")
                            setDirectory(temp);
                        }} arial-label="edit" component="span">
                            <FolderIcon style={{height: 200, width: 200}}/>
                        </IconButton>
                        <Typography style={{fontWeight: 'bold'}}>IEC MATERIALS</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <IconButton onClick={()=> {
                            let temp = [...directory];
                            temp.push("RISK ASSESSMENTS")
                            setDirectory(temp);
                        }} arial-label="edit" component="span">
                            <FolderIcon style={{height: 200, width: 200}}/>
                        </IconButton>
                        <Typography style={{fontWeight: 'bold'}}>RISK ASSESSMENTS</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={3} md={3} lg={3}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <IconButton onClick={()=> {
                            let temp = [...directory];
                            temp.push("PLANS")
                            setDirectory(temp);
                        }} arial-label="edit" component="span">
                            <FolderIcon style={{height: 200, width: 200}}/>
                        </IconButton>
                        <Typography style={{fontWeight: 'bold'}}>PLANS</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <IconButton onClick={()=> {
                            let temp = [...directory];
                            temp.push("OTHERS")
                            setDirectory(temp);
                        }} arial-label="edit" component="span">
                            <FolderIcon style={{height: 200, width: 200}}/>
                        </IconButton> 
                        <Typography style={{fontWeight: 'bold'}}>OTHERS</Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
      </Grid>
      :
      <Grid container spacing={2}>
        {
            isList == false ?
                files.map((data)=> (
                    <Grid item xs={3}>
                        <Card sx={{ maxWidth: 345 }} variant="outlined">
                            <CardMedia
                                component="img"
                                height="140"
                                image="/pngegg.png"
                                alt="PDF"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {`${data.name}_${directory[0]}`}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {data.size}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small">Download</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))
            :
            <List style={{width: '100%', padding: 50}}>
                {
                    files.map((data)=> (
                        <React.Fragment>
                            <ListItem >
                                <ListItemButton>
                                    <Grid container spacing={2}>
                                        <Grid item xs={2}>
                                            <PictureAsPdfIcon style={{width: 50, height: 50}}/>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography style={{padding : 10}}>File Name: {`${data.name}_${directory[0]}`}</Typography>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Typography style={{padding : 10}}>File Size:{`${data.size}`}</Typography>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <DeleteIcon style={{width: 50, height: 50}}/>
                                        </Grid>
                                    </Grid>
                                </ListItemButton>
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))
                }
            </List>
        }
      </Grid>
      }
    </Grid>
  );
};

export default Resources;

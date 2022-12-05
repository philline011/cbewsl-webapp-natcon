import React from 'react';
import {Grid, Button} from '@mui/material';
import LipataHazardMap from '../../assets/lipata_hazard_map.jpg';
import MarirongHeader from '../utils/MarirongHeader';

const Assessment = () => {
  const download = e => {
    console.log(e.target.href);
    fetch(e.target.href, {
      method: 'GET',
      headers: {},
    })
      .then(response => {
        response.arrayBuffer().then(function (buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'image.jpg'); //or any other extension
          document.body.appendChild(link);
          link.click();
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
  return (
    <Grid>
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        sx={{marginTop: 2, textAlign: 'center'}}>
        <img
          src={LipataHazardMap}
          alt="lipata-hazard-map-png"
          style={{objectFit: 'contain', height: '100%', width: '95%'}}
        />
      </Grid>
      <Grid container sx={{mt: 2, mb: 6, padding: '2%'}}>
        <Grid item xs={12} sm={12} md={12} lg={6}>
          <Button variant="outlined" sx={{mx: 1}}>
            {' '}
            Add Household{' '}
          </Button>
          <Button variant="outlined" sx={{mx: 1}}>
            {' '}
            Add Location{' '}
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6}>
          <Button variant="outlined" sx={{float: 'right', mx: 1}}>
            Share
          </Button>
          <Button variant="outlined" sx={{float: 'right', mx: 1}}>
            Print
          </Button>
          <Button
            variant="outlined"
            sx={{float: 'right', mx: 1}}
            onClick={e => download(e)}>
            Download
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Assessment;

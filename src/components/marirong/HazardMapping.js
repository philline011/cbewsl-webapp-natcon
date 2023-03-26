import React, {useState, useCallback, useEffect} from 'react';
import {Grid, Container, Button, Typography} from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import useEmblaCarousel from 'embla-carousel-react'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { getFilesFromFolder, uploadHazardMaps } from '../../apis/Misc';
import { STORAGE_URL } from '../../config';
import hazard_map_umi from '../../assets/hazard_map_umi.jpg'
const itemData = [
    {
      img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      title: 'Hazard Map 10',
      author: 'January 1, 2023',
      rows: 2,
      cols: 2,
      featured: true,
    },
    {
        img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
        title: 'Hazard Map 10',
        author: 'January 1, 2023',
        rows: 2,
        cols: 2,
    },
    {
        img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
        title: 'Hazard Map 10',
        author: 'January 1, 2023',
        rows: 2,
        cols: 2,
    },
    {
        img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
        title: 'Hazard Map 10',
        author: 'January 1, 2023',
        rows: 2,
        cols: 2,
    },
    {
        img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
        title: 'Hazard Map 10',
        author: 'January 1, 2023',
        rows: 2,
        cols: 2,
    },
    {
      img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      title: 'Hazard Map 10',
      author: 'January 1, 2023',
      rows: 2,
      cols: 2,
    },
    {
      img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
      title: 'Basketball',
      author: '@tjdragotta',
    },
    {
      img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
      title: 'Fern',
      author: '@katie_wasserman',
    },
    {
      img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
      title: 'Mushrooms',
      author: '@silverdalex',
      rows: 2,
      cols: 2,
    },
    {
      img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
      title: 'Tomato basil',
      author: '@shelleypauls',
    },
    {
      img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
      title: 'Sea star',
      author: '@peterlaster',
    },
    {
      img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
      title: 'Bike',
      author: '@southside_customs',
      cols: 2,
    },
  ];

const HazardMapping = (props) => {


    return(
            <Grid container style={{padding: "20px"}}>
                <Grid item xs={4} md={4}>
                    <Typography style={{marginTop: "34px"}}>Uploaded hazard maps</Typography>
                    <ImageList sx={{ height: 650 }}>
                        {itemData.map((item) => (
                            <ImageListItem key={item.img}>
                            <img
                                src={hazard_map_umi}
                                alt="hazard-map-umi"
                                loading="lazy"
                            />
                            <ImageListItemBar
                                title={item.title}
                                subtitle={item.author}
                                actionIcon={
                                <IconButton
                                    sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                    aria-label={`info about ${item.title}`}
                                >
                                    <InfoIcon />
                                </IconButton>
                                }
                            />
                            </ImageListItem>
                        ))}
                    </ImageList>
                    <div style={{textAlign: "center"}}>
                        <a href={hazard_map_umi} style={{textDecoration: "none"}} download>
                            <Button
                                variant="contained"
                                style={{ backgroundColor: '#2E2D77'}}
                                    >
                                Download
                            </Button>
                        </a>
                    </div>

                </Grid>
                <Grid item xs={8} md={8}>
                    <img
                        src={hazard_map_umi}
                        alt="hazard-map-umi"
                        style={{
                            objectFit: 'contain',
                            height: 'auto',
                            width: '100%',
                        }}
                    />
                </Grid>
                
            </Grid>
    )
}

export default HazardMapping;
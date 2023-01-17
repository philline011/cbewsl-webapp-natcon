import React from 'react';
import {Grid, Container, Button} from '@mui/material';
import MARHazardMap from '../../assets/hazard_map_01.jpg'
import { useSnackbar } from "notistack";
import useEmblaCarousel from 'embla-carousel-react'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const HazardMapping = () => {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const handleDownload = () => {
        enqueueSnackbar('Succesfully Downloaded');
    };

    const handleUpload = () => {
        const formData = new FormData()
    }

    const [emblaRef] = useEmblaCarousel()

    return(
        <Container>
            <Grid>
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    sx={{marginTop: 2, textAlign: 'center'}}>
                    <div className="embla" ref={emblaRef}>
                        <div className="embla__container">
                            <div className="embla__slide">
                                <TransformWrapper>
                                    <TransformComponent>
                                        <img
                                            src={MARHazardMap}
                                            alt="lipata-hazard-map-png"
                                            style={{objectFit: 'contain', height: '100%', width: '95%'}}
                                        />
                                    </TransformComponent>
                                </TransformWrapper>
                            </div>
                        </div>
                    </div>
                  
                </Grid>
                <Grid container sx={{mt: 2, mb: 6, padding: '2%'}}>
                    <Grid item xs={12} sm={12} md={12} lg={7}>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="raised-button-file"
                            multiple
                            type="file"
                            onChange={e => {
                                console.log("chosen",e.target.value)
                            }}
                        />
                        <label htmlFor="raised-button-file">
                            <Button variant="contained" component="span" sx={{float: 'right', mx: 1}}>
                                Upload
                            </Button>
                        </label> 
                        <Button
                            variant="contained"
                            sx={{float: 'right', mx: 1}}
                            onClick={e => {
                                handleDownload()
                            }}>
                            Download
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    )
}

export default HazardMapping;
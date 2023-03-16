import React, {useState, useCallback, useEffect} from 'react';
import {Grid, Container, Button} from '@mui/material';
import useEmblaCarousel from 'embla-carousel-react'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { getFilesFromFolder, uploadHazardMaps } from '../../apis/Misc';
import { STORAGE_URL } from '../../config';
import hazard_map_umi from '../../assets/hazard_map_umi.jpg'


const HazardMapping = (props) => {

    // const directory = `${STORAGE_URL}/assets`
    // const [images, setImages] = useState([]);
    // const handleOpenFolder = () => {
    //     getFilesFromFolder("assets", (response)=> {
    //         setImages(response)
    //     });
    // }

    // useEffect(() => {
    //    handleOpenFolder()
    //   }, [])


    // const {slides, options} = props
    // const [selectedIndex, setSelectedIndex] = useState(0)
    // const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options)
    // const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    //     containScroll: 'keepSnaps',
    //     dragFree: false,
    // })
    
    // const Thumb = (props) => {
    //         const { selected, imgSrc, index, onClick, } = props
    //         return (
    //         <div
    //             className={"embla-thumbs__slide".concat(
    //             selected ? "embla-thumbs__slide--selected" : "",
    //             )}
    //         >
    //             <button
    //             onClick={onClick}
    //             className="embla-thumbs__slide__button"
    //             type="button"
    //             >
    //             <img
    //                 className="embla-thumbs__slide__img"
    //                 src={imgSrc}
    //                 alt="Your alt text"
    //             />
    //             </button>
                
    //         </div>
    //         )
    //     }

    // const onThumbClick = useCallback(
    //     (index) => {
    //       if (!emblaMainApi || !emblaThumbsApi) return
    //       if (emblaThumbsApi.clickAllowed()) emblaMainApi.scrollTo(index)
    //     },
    //     [emblaMainApi, emblaThumbsApi],
    //   )

    // const onSelect = useCallback(() => {
    //     if (!emblaMainApi || !emblaThumbsApi) return
    //     setSelectedIndex(emblaMainApi.selectedScrollSnap())
    //     emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap())
    //   }, [emblaMainApi, emblaThumbsApi, setSelectedIndex])

    // useEffect(() => {
    //     if (!emblaMainApi) return
    //     onSelect()
    //     emblaMainApi.on('select', onSelect)
    //     emblaMainApi.on('reInit', onSelect)
    //   }, [emblaMainApi, onSelect])

      
    // const handleUpload = (uploadImage) => {
    //     const formData = new FormData();
    //     formData.append('file', uploadImage);

    //     uploadHazardMaps(formData, data => {
    //         const {status, message} = data;
    //         if (status) {
    //             const credentials = localStorage.getItem('credentials')
    //             const parsed_credentials = JSON.parse(credentials);
    //             const updated_input = {...parsed_credentials, img_length: images.length + 1}
    //             localStorage.setItem('credentials', JSON.stringify(updated_input))
    //             window.location.reload(true)
    //         } else {
    //             console.log("Error upload", message)
    //         }
    //     })
    // }

    return(
            <Grid container>
                {/* <TransformWrapper> */}
                <Grid item xs={12} sm={12} md={12} lg={12} sx={{textAlign: "center", marginTop: 1}}>
                {/* <TransformComponent> */}
                <div
                    style={{
                    height: 'auto',
                    width: '100%',
                }}
                >
                                       
                    <img
                        src={hazard_map_umi}
                        alt="hazard-map-umi"
                        style={{
                            objectFit: 'contain',
                            height: 'auto',
                            width: 1000,
                        }}
                    />
                                     
                </div>
               
                {/* </TransformComponent> */}
                </Grid>
                {/* </TransformWrapper> */}
                <Grid item xs={12} sm={12} md={12} lg={12} sx={{textAlign: "center", marginTop: 1, marginBottom: 1}}>
                
                <a href={hazard_map_umi} 
                                download
                                >
                            <Button
                                variant="contained"
                                style={{ backgroundColor: '#2E2D77'}}
                                    >
                                Download
                            </Button>
                </a>
                


                    {/* <div className="embla">
                        <div className="embla__viewport" ref={emblaMainRef}>
                            <div className="embla__container">
                                { 
                                    slides.map((index) => (
                                        <div className="embla__slide" key={index}>
                                            <TransformWrapper>
                                                <TransformComponent>
                                                    {images.length > 0 && (
                                                        <img
                                                        className="embla__slide__img"
                                                        src={`${directory}/${images[index].filename}${images[index].extension}`}
                                                        alt="Your alt text"
                                                        />
                                                    )}
                                                </TransformComponent>
                                            </TransformWrapper>    
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                            <div className="embla-thumbs">
                                <div className="embla-thumbs__viewport" ref={emblaThumbsRef}>
                                    <div className="embla-thumbs__container">
                                        {images.map((value, index) => (
                                            <Thumb
                                                onClick={() => 
                                                    onThumbClick(index)
                                                    }
                                                selected={index === selectedIndex}
                                                index={index}
                                                imgSrc={`${directory}/${value.filename}${value.extension}`}
                                                key={index}
                                            />
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div> */}
                </Grid>
                {/* <Grid container sx={{mt: 2, mb: 6, padding: '2%'}}> */}
                    {/* <Grid item xs={12} sm={12} md={12} lg={7}>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="raised-button-file"
                            type="file"
                            onChange={e => {
                                handleUpload(e.target.files[0])
                            }}
                        />
                        <label htmlFor="raised-button-file">
                            <Button variant="contained" 
                                    component="span" 
                                    sx={{float: 'right', mx: 1,
                                     backgroundColor: '#2E2D77'}}
                                    >
                                Upload
                            </Button>
                        </label>
                        {images.length > 0 && (
                            <a href={`${STORAGE_URL}/${images[selectedIndex].filename}${images[selectedIndex].extension}`} 
                                target="_blank" 
                                rel="noreferrer"
                                >
                            <Button
                                variant="contained"
                                sx={{float: 'right', mx: 1}}
                                >
                                Download
                            </Button>
                        </a>
                        )} 
                    </Grid> */}
                {/* </Grid> */}
            </Grid>
    )
}

export default HazardMapping;
import React, {
    Fragment, useState, useEffect,
    useRef, createRef
} from "react";

import { createTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import { Grid, Paper, Hidden, AppBar, Typography } from "@material-ui/core";
import { Button } from '@mui/material';
import moment from "moment";
import { Tab, Tabs } from "@mui/material";
import { Save } from "@material-ui/icons";
import L from "leaflet";
import "leaflet/dist/leaflet.css"
import { Map as LeafletMap, TileLayer, Marker, Popup, Circle, CircleMarker, Pane } from "react-leaflet";
import MarkerIcon from "leaflet/dist/images/marker-icon.png";
import ShadowIcon from "leaflet/dist/images/marker-shadow.png";
import RetinaIcon from "leaflet/dist/images/marker-icon-2x.png";

const marker = L.icon({
    iconUrl: MarkerIcon,
    shadowUrl: ShadowIcon,
    iconRetinaUrl: RetinaIcon,
    iconSize: [25, 41],
    // [18, 31], // [25, 41], // size of the icon
    shadowSize: [41, 41],
    // [31, 31], // [41, 41], // size of the shadow
    iconAnchor: [12, 41],
    // [12, 31], // [12, 41], // point of the icon which will correspond to marker's location
    shadowAnchor: [12, 41],
    // [12, 31], // [12, 41], // the same for the shadow
    popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
    tooltipAnchor: [16, -28]
});

const getMuiTheme = createTheme({
    overrides: {
        MUIDataTableBodyCell: {
            root: {
                whiteSpace: "nowrap"
            }
        }
    }
});

const eq_ev_tbl_columns = [
    { name: "Timestamp" },
    { name: "Magnitude" },
    { name: "Issuer" },
    {
        name: "eq_id",
        options: {
            display: false,
            viewColumns: false,
            filter: false
        }
    }
];

const eq_al_tbl_columns = [
    { name: "Timestamp" },
    { name: "Magnitude" },
    {
        name: "eq_id",
        options: {
            display: false,
            viewColumns: false,
            filter: false
        }
    },
    {
        name: "Sites",
        options: {
            filter: false
        }
    }
];

function prepareSiteAddress(site_details, include_site_code = true, position = "end", scope = "province") {
    const { purok, sitio, barangay, municipality, province, site_code } = site_details;
    let address = "";

    if (sitio !== null && sitio !== "") address = `Sitio ${sitio}, `;
    if (purok !== null && purok !== "") address += `Purok ${purok}, `;

    address += `Brgy. ${barangay}`;
    if (scope !== "barangay") address += `, ${municipality}`;
    if (scope === "province") address += `, ${province}`;

    if (include_site_code) {
        const upper_sc = site_code.toUpperCase();
        if (position === "end")
            address += ` (${upper_sc})`;
        else
            address = `${upper_sc} (${address})`;
    }

    return address;
}

function EarthquakeMap(props) {
    const { eqEvents } = props;
    const sites = require("./../data/sites.json")
    const state = {
        lat: 11.154057,
        lng: 122.483825,
        zoom: 9
    };


    let position = [state.lat, state.lng];
    let { zoom } = state;
    const ref = useRef();
    const is_one = eqEvents.length === 1;
    const [show_popup, setShowPopUp] = useState(false);
    useEffect(() => {
        if (is_one) setShowPopUp(true); console.log("is one")
    }, [eqEvents]);

    useEffect(() => {
        if (show_popup) {
            if (ref !== null) ref.current.leafletElement.openPopup(); console.log(ref.current.leafletElement)
            setShowPopUp(false);
        }
    }, [show_popup]);

    const rule = /\.0*$|(?<=\.[0-9]{0,2147483646})0*$/;

    return (
        <LeafletMap style={{ height: "71vh", width: "100%" }} center={position} zoom={zoom}>
            <TileLayer
                attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'
                id="mapbox.streets"
                url="https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw"
            />
            {
                eqEvents.map((event, i) => {
                    const {
                        latitude, longitude, magnitude,
                        depth, critical_distance, eq_id, processed
                    } = event;
                    const center = [latitude, longitude];
                    const distance = critical_distance === null ? 0 : parseFloat(critical_distance);

                    return (
                        <Fragment key={eq_id}>
                            <Circle center={center} fillColor="blue" radius={distance * 1000} />
                            <Marker icon={marker} position={center} ref={is_one ? ref : createRef()}>
                                <Popup>
                                    Magnitude: <strong>{magnitude.replace(rule, "")}</strong> <br />
                                    Depth: <strong>{depth.replace(rule, "")}</strong> <br />
                                    Critical Distance: <strong>{distance} km</strong> <br />
                                    Processed: <strong>{processed ? "Yes" : "No"}</strong>
                                </Popup>
                            </Marker>
                        </Fragment>
                    );
                })
            }

            <Pane style={{ zIndex: 550 }}>{
                sites.map(site => (
                    <CircleMarker
                        key={site.site_id}
                        center={[site.latitude, site.longitude]}
                        fillColor="green"
                        fillOpacity={1}
                        color="black"
                        weight={1}
                        radius={4}
                        bringToFront
                    >
                        <Popup>
                            <strong>{site.site_code.toUpperCase()}</strong> <br />
                            {prepareSiteAddress(site, false)}
                        </Popup>
                    </CircleMarker>
                ))
            }</Pane>
        </LeafletMap>
    )
}


function EarthquakeChart(props) {
    const eq = require("./../data/eq.json")
    const { eqEvents, eqAlertsPagination, eqAlerts } = eq;
    const [tab_value, setTabValue] = useState(0);
    const change_tab_value = (event, new_value) => setTabValue(new_value);
    const [eq_al_tbl_pagination, setEqAlTblPage] = useState({ limit: 5, offset: 0, count: 0 });

    const [chosen_events, setChosenEvents] = useState([]);
    const [eq_ev_tbl_data, setEqEventsTable] = useState([]);

    useEffect(() => {
        setChosenEvents([...eqEvents]);
        const table_data = eqEvents.map(d => [
            moment(d.ts).format("D MMM YYYY, HH:mm"),
            parseFloat(d.magnitude),
            d.issuer.toUpperCase(),
            d.eq_id
        ]);
        setEqEventsTable([...table_data]);
    }, [eqEvents]);

    const select_map_event = (eq_id, collection) => {
        const event = collection.filter(ev => ev.eq_id === eq_id);
        setChosenEvents([...event]);
    };

    const [eq_al_tbl_data, setEqAlertsTable] = useState([]);
    useEffect(() => {
        const table_data = eqAlerts.map(d => {
            const { eq_alerts } = d;
            const sites = eq_alerts.map(a => a.site.site_code.toUpperCase());

            return [
                moment(d.ts).format("D MMM YYYY, HH:mm"),
                parseFloat(d.magnitude),
                d.eq_id,
                sites.join(", ")
            ];
        });

        setEqAlertsTable([...table_data]);
    }, [eqAlerts]);

    const eq_ev_tbl_options = {
        textLabels: {
            body: {
                noMatch: "No data"
            }
        },
        selectableRows: "none",
        rowsPerPage: 5,
        rowsPerPageOptions: [],
        print: false,
        download: false,
        search: false,
        filter: false,
        viewColumns: false,
        responsive: "standard",
        onRowClick(data, meta, e) {
            select_map_event(data[3], eqEvents);
        }
    };

    const eq_al_tbl_options = {
        textLabels: {
            body: {
                noMatch: "No data"
            }
        },
        selectableRows: "none",
        count: eqAlertsPagination.count,
        rowsPerPage: 3,
        rowsPerPageOptions: [],
        print: false,
        download: false,
        viewColumns: false,
        responsive: "standard",
        serverSide: true,
        onChangePage: page => {
            const { limit } = eqAlertsPagination;
            const offset = page * limit;
            setEqAlTblPage({ ...eqAlertsPagination, offset });
        },
        onRowClick(data, meta, e) {
            select_map_event(data[2], eqAlerts);
        }
    };
    return (
        <Fragment>
            <Grid container spacing={2} style={{ marginTop: 30 }}>
                <Grid item md={6} container>
                    <EarthquakeMap eqEvents={eqEvents} />
                </Grid>
                <Grid item md={6} container>
                    <AppBar position="static">
                        <Tabs
                            value={tab_value}
                            onChange={change_tab_value}
                            variant="fullWidth"
                        >
                            <Tab style={{ color: "white" }} label="EQ Events" />
                            <Tab style={{ color: "white" }} label="EQ Alerts" />
                        </Tabs>
                        {
                            tab_value === 0 && (
                                <MuiThemeProvider theme={getMuiTheme}>
                                    <MUIDataTable
                                        title="Latest Earthquake Events"
                                        columns={eq_ev_tbl_columns}
                                        options={eq_ev_tbl_options}
                                        data={eq_ev_tbl_data}
                                        style={{ height: 465 }}
                                    />
                                </MuiThemeProvider>
                            )
                        }
                        {
                            tab_value === 1 && (
                                <MuiThemeProvider theme={getMuiTheme}>
                                    <MUIDataTable
                                        title={
                                            <Typography
                                                variant="body1"
                                            >
                                                Earthquake Alerts
                                            </Typography>
                                        }
                                        columns={eq_al_tbl_columns}
                                        options={eq_al_tbl_options}
                                        data={eq_al_tbl_data}
                                    />
                                </MuiThemeProvider>
                            )
                        }
                    </AppBar>
                </Grid>
            </Grid>
            {/* <Grid item md={12} container align="right">
                <Grid container>
                    <Grid item md={12} align="right" style={{paddingTop: 20}}>
                        <Button
                            variant="contained"
                            sx={{float: 'right', mx: 1}}
                            onClick={e => {

                            }}>
                            Download CSV
                        </Button>
                    </Grid>
                </Grid>
            </Grid> */}
        </Fragment>
    )
}


export default EarthquakeChart;
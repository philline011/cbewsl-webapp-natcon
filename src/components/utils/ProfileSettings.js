import { Fragment } from 'react';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const ProfileSettings = () => {
    return (
        <Fragment>
            <Container maxWidth="sm">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography>
                            Profile Settings
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Fragment>
    )
}

export default ProfileSettings;
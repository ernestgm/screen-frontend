// @mui
import {Helmet} from 'react-helmet-async';
import {
    Stack,
    Container,
    Grid, Typography, Divider,
} from '@mui/material';
import useMessagesSnackbar from "../../hooks/messages/useMessagesSnackbar";
import PROJECT_CONFIG from "../../config/config";
import SlidesDataTable from "./SlidesDataTable";
import Iconify from '../../components/iconify';



// ----------------------------------------------------------------------

const NAME_PAGE = 'Slides';
export default function SlidesPage() {
    useMessagesSnackbar();

    return (
        <>
            <Helmet>
                <title> {NAME_PAGE} | {PROJECT_CONFIG.NAME} </title>
            </Helmet>

            <Container>
                <Stack
                  direction="row"
                  divider={<Divider orientation="vertical" flexItem />}
                  spacing={2}
                  sx={{padding: "15px 0"}}
                >
                    <Iconify width="35px" icon="simple-icons:slides"/>
                    <Typography variant="h4" gutterBottom>
                        {NAME_PAGE}
                    </Typography>
                </Stack>
                <Stack>
                    <Grid item xs={12} md={6} lg={8}>
                        <SlidesDataTable />
                    </Grid>
                </Stack>
            </Container>
        </>
    );
}

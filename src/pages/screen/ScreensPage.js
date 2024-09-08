// @mui
import {Helmet} from 'react-helmet-async';
import {
    Stack,
    Container,
    Grid, Typography,
} from '@mui/material';
import useMessagesSnackbar from "../../hooks/messages/useMessagesSnackbar";
import PROJECT_CONFIG from "../../config/config";
import ScreenDataTable from "./ScreenDataTable";



// ----------------------------------------------------------------------

const NAME_PAGE = 'Screens';
export default function ScreensPage() {
    useMessagesSnackbar();

    return (
        <>
            <Helmet>
                <title> {NAME_PAGE} | {PROJECT_CONFIG.NAME} </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        {NAME_PAGE}
                    </Typography>
                </Stack>
                <Stack>
                    <Grid item xs={12} md={6} lg={8}>
                        <ScreenDataTable />
                    </Grid>
                </Stack>
            </Container>
        </>
    );
}

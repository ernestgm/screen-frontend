// @mui
import {Helmet} from 'react-helmet-async';
import {
    Stack,
    Container,
    Grid, Typography, Button,
} from '@mui/material';
import useMessagesSnackbar from "../../hooks/messages/useMessagesSnackbar";
import PROJECT_CONFIG from "../../config/config";
import LogsDataTable from "./LogsDataTable";



// ----------------------------------------------------------------------

const NAME_PAGE = 'Logs';
export default function LogsPage() {
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
                        <LogsDataTable />
                    </Grid>
                </Stack>
            </Container>
        </>
    );
}

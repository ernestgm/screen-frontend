// @mui
import {Helmet} from 'react-helmet-async';
import {
    Stack,
    Container,
    Grid, Typography, Button,
} from '@mui/material';
import {useParams} from "react-router-dom";
import useMessagesSnackbar from "../../hooks/messages/useMessagesSnackbar";
import PROYECT_CONFIG from "../../config/config";
import AreasDataTable from "../business/table/AreasDataTable";
import MarqueeDataTable from "./MarqueeDataTable";



// ----------------------------------------------------------------------

const NAME_PAGE = 'Marquees';
export default function MarqueesPage() {
    const {id} = useParams();
    useMessagesSnackbar();

    return (
        <>
            <Helmet>
                <title> {NAME_PAGE} | {PROYECT_CONFIG.NAME} </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        {NAME_PAGE}
                    </Typography>
                </Stack>
                <Stack>
                    <Grid item xs={12} md={6} lg={8}>
                       <MarqueeDataTable />
                    </Grid>
                </Stack>
            </Container>
        </>
    );
}

import {useEffect, useState} from 'react';
// @mui
import {Helmet} from 'react-helmet-async';
import {
    Stack,
    Container,
    Grid,
} from '@mui/material';
import useApiHandlerStore from "../../zustand/useApiHandlerStore";
import useMessagesSnackbar from "../../hooks/messages/useMessagesSnackbar";
import PROYECT_CONFIG from "../../config/config";
import ScreenDataTable from "../areas/table/ScreenDataTable";


// ----------------------------------------------------------------------

const NAME_PAGE = 'Screens';
export default function ScreensPage() {
    useMessagesSnackbar();

    return (
        <>
            <Helmet>
                <title> {NAME_PAGE} | {PROYECT_CONFIG.NAME} </title>
            </Helmet>

            <Container>
                <Stack>
                    <Grid item xs={12} md={6} lg={8}>
                        <ScreenDataTable />
                    </Grid>
                </Stack>
            </Container>
        </>
    );
}

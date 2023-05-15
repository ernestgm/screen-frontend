import {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
// @mui
import {Helmet} from 'react-helmet-async';
import {
    Stack,
    Container,
    Typography,
    Grid,
} from '@mui/material';
import useApiHandlerStore from "../../zustand/useApiHandlerStore";
import useMessagesSnackbar from "../../hooks/messages/useMessagesSnackbar";
import PROYECT_CONFIG from "../../config/config";
import ScreenDataTable from "../areas/table/ScreenDataTable";
import Iconify from "../../components/iconify";


// ----------------------------------------------------------------------

const NAME_PAGE = 'Screens';
const URL_GET_AREA = PROYECT_CONFIG.API_CONFIG.AREA.GET;
const URL_TABLES_PAGE = '/dashboard/business/details/';

export default function ScreensPage() {
    const showSnackbarMessage = useMessagesSnackbar();
    const {api} = useApiHandlerStore((state) => state);
    const [area, setArea] = useState({
        business_id : '',
        created_at : '',
        id: '',
        name: '',
        screens: []
    })

    useEffect(() => {

    }, [])

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

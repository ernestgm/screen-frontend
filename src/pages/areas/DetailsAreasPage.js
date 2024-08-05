import {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
// @mui
import {Helmet} from 'react-helmet-async';
import {
    Stack,
    Container,
    Typography,
    Grid,
} from '@mui/material';
import BackButton from "../../sections/@dashboard/app/AppBackButton";
import useApiHandlerStore from "../../zustand/useApiHandlerStore";
import useMessagesSnackbar from "../../hooks/messages/useMessagesSnackbar";
import PROYECT_CONFIG from "../../config/config";
import {AppWidgetSummary} from "../../sections/@dashboard/app";
import TitlePageDetails from "../../sections/@dashboard/app/TitlePageDetails";
import ScreenDataTable from "./table/ScreenDataTable";
import Iconify from "../../components/iconify";


// ----------------------------------------------------------------------

const NAME_PAGE = 'Area Details';
const URL_GET_AREA = PROYECT_CONFIG.API_CONFIG.AREA.GET;
const URL_TABLES_PAGE = '/dashboard/business/details/';

export default function DetailsAreasPage() {
    const showSnackbarMessage = useMessagesSnackbar();
    const {id} = useParams();
    const {api} = useApiHandlerStore((state) => state);
    const [area, setArea] = useState({
        business_id : '',
        created_at : '',
        id: '',
        name: '',
        screens: []
    })

    const getAreaDetails = async () => {
        const response = await api.__get(`${URL_GET_AREA}${id}`, null, (msg) => {
            showSnackbarMessage(msg, 'error');
        }, () => {getAreaDetails()});
        if (response.data) {
            setArea(response.data);
        }
    }

    useEffect(() => {
        getAreaDetails();
    }, [])

    return (
        <>
            <Helmet>
                <title> {NAME_PAGE} | {PROYECT_CONFIG.NAME} </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="left" justifyContent="space-between" mb={5}>
                    <Stack>
                        <BackButton path={`${URL_TABLES_PAGE}${area.business_id}`}/>
                    </Stack>
                    <Typography variant="h4" gutterBottom>
                        {NAME_PAGE}
                    </Typography>
                </Stack>
                <Grid container spacing={2} mb={5}>
                    <Grid item xs={12} sm={12} md={12}>
                        <TitlePageDetails title={area.name} createdAt={area.created_at} icon={'fluent-mdl2:build-queue'}/>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}

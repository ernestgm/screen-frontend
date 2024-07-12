import {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
// @mui
import {Helmet} from 'react-helmet-async';
import {
    Stack,
    Container,
    Typography,
    Grid, Button, Card,
} from '@mui/material';
import BackButton from "../../sections/@dashboard/app/AppBackButton";
import useApiHandlerStore from "../../zustand/useApiHandlerStore";
import useMessagesSnackbar from "../../hooks/messages/useMessagesSnackbar";
import PROYECT_CONFIG from "../../config/config";
import TitlePageDetails from "../../sections/@dashboard/app/TitlePageDetails";
import ImageDataTable from "./ImageDataTable";
import Iconify from "../../components/iconify";



// ----------------------------------------------------------------------

const NAME_PAGE = 'Screen Details';
const URL_GET_PAGE = PROYECT_CONFIG.API_CONFIG.SCREEN.GET;
const URL_TABLES_PAGE = '/dashboard/area/details/';
const URL_CREATE_IMAGE = '/dashboard/image/create/';

export default function DetailsScreenPage() {
    const navigate = useNavigate();
    const showSnackbarMessage = useMessagesSnackbar();
    const {id} = useParams();
    const {api} = useApiHandlerStore((state) => state);
    const [screen, setScreen] = useState({
        area_id : '',
        created_at : '',
        id: '',
        name: '',
        code: '',
        area: {
            business: {
                name: '',
                user: {
                    name: '',
                    lastname: ''
                }
            }
        },
        description: '',
        screens: []
    })

    const getPageDetails = async () => {
        const response = await api.__get(`${URL_GET_PAGE}${id}`, null, (msg) => {
            showSnackbarMessage(msg, 'error');
        });
        if (response) {
            setScreen(response.data);
        }
    }

    useEffect(() => {
        getPageDetails();
    }, [])

    const handleClickNew = () => {
        navigate(`${URL_CREATE_IMAGE}${id}`, {replace: true});
    }

    return (
        <>
            <Helmet>
                <title> {NAME_PAGE} | {PROYECT_CONFIG.NAME} </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="left" justifyContent="space-between" mb={5}>
                    <Stack>
                        <BackButton path={`${URL_TABLES_PAGE}${screen.area_id}`}/>
                    </Stack>
                    <Typography variant="h4" gutterBottom>
                        {NAME_PAGE}
                    </Typography>
                </Stack>
                <Grid container spacing={2} mb={5}>
                    <Grid item xs={12} sm={6} md={6}>
                        <TitlePageDetails
                            title={screen.name}
                            description={screen.description}
                            createdAt={screen.created_at}
                            icon={'material-symbols:live-tv-outline-rounded'}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <Card
                            sx={{
                                py: 3,
                                px: 5,
                                boxShadow: 0,
                                textAlign: 'left',
                                color: (theme) => theme.palette.primary.darker,
                                bgcolor: (theme) => theme.palette.primary.lighter,
                            }}
                        >
                            <Typography variant="h4" gutterBottom>
                                Device Code: { screen.code }
                            </Typography>
                            <Typography variant="h4" gutterBottom>
                                Business Name: { screen.area.business.name }
                            </Typography>
                            <Typography variant="h4" gutterBottom>
                                Owner: { screen.area.business.user.name } { screen.area.business.user.lastname }
                            </Typography>

                        </Card>
                    </Grid>
                </Grid>
                <Stack>
                    <Stack direction="row" alignItems="left" justifyContent="space-between" mb={5}>
                        <Typography variant="h4" gutterBottom>
                            Image List
                        </Typography>
                        <Button variant="outlined" onClick={handleClickNew} startIcon={<Iconify icon="eva:plus-fill"/>}>
                            New Image
                        </Button>
                    </Stack>
                    <Grid item xs={12} md={6} lg={8}>
                        <ImageDataTable screen={id} />
                    </Grid>
                </Stack>
            </Container>
        </>
    );
}

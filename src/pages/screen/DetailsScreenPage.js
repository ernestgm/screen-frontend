import {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
// @mui
import {Helmet} from 'react-helmet-async';
import {
    Stack,
    Container,
    Typography,
    Grid, Button, Card, ListItem,
} from '@mui/material';
import BackButton from "../../sections/@dashboard/app/AppBackButton";
import useApiHandlerStore from "../../zustand/useApiHandlerStore";
import useMessagesSnackbar from "../../hooks/messages/useMessagesSnackbar";
import PROJECT_CONFIG from "../../config/config";
import TitlePageDetails from "../../sections/@dashboard/app/TitlePageDetails";
import ImageDataTable from "./ImageDataTable";
import Iconify from "../../components/iconify";
import useNavigateTo from "../../hooks/navigateTo";



// ----------------------------------------------------------------------

const NAME_PAGE = 'Screen Details';
const URL_GET_PAGE = PROJECT_CONFIG.API_CONFIG.SCREEN.GET;
const URL_TABLES_PAGE = '/dashboard/business/details/';
const URL_MENU_SCREEN_PAGE = '/dashboard/screens';
const URL_CREATE_IMAGE = '/dashboard/image/create/';

export default function DetailsScreenPage() {
    const {navigateTo} = useNavigateTo();
    const showSnackbarMessage = useMessagesSnackbar();
    const {id, menu} = useParams();
    const {api} = useApiHandlerStore((state) => state);
    const [screen, setScreen] = useState({
        area_id : '',
        business_id: '',
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
        business: {
            name: '',
            user: {
                name: '',
                lastname: ''
            }
        },
        devices: [],
        description: '',
        screens: []
    })

    const getPageDetails = async () => {
        const response = await api.__get(`${URL_GET_PAGE}${id}`, (msg) => {
            showSnackbarMessage(msg, 'error');
        }, () => { getPageDetails() });
        if (response !== undefined && response.data) {
            setScreen(response.data);
        }
    }

    useEffect(() => {
        getPageDetails();
    }, [])

    const handleClickNew = () => {
        navigateTo(`${URL_CREATE_IMAGE}${id}`);
    }

    return (
        <>
            <Helmet>
                <title> {NAME_PAGE} | {PROJECT_CONFIG.NAME} </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="left" justifyContent="space-between" mb={5}>
                    <Stack>
                        {
                            menu ? (<BackButton path={`${URL_MENU_SCREEN_PAGE}`}/>) : (<BackButton path={`${URL_TABLES_PAGE}${screen.business_id}`}/>)
                        }
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
                        <Card
                            sx={{
                                py: 3,
                                px: 5,
                                mt:2,
                                boxShadow: 0,
                                textAlign: 'left',
                                color: (theme) => theme.palette.primary.darker,
                                bgcolor: (theme) => theme.palette.primary.lighter,
                            }}
                        >
                            <Typography variant="h4" gutterBottom>
                                Business Name: { screen.business.name }
                            </Typography>
                            <Typography variant="h4" gutterBottom>
                                Owner: { screen.business.user.name } { screen.business.user.lastname }
                            </Typography>

                        </Card>
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
                                Active on { screen.devices.length } Device(s)
                            </Typography>
                            { screen.devices.map((device) => (
                                <ListItem key={device.id}>
                                    <Stack direction="column" alignItems="left" justifyContent="space-between">
                                        <Typography variant="caption" gutterBottom>
                                            <b>Name:</b> { device.name }
                                        </Typography>
                                        <Typography variant="caption" gutterBottom>
                                            <b>Code:</b>  {device.code}
                                        </Typography>
                                    </Stack>
                                </ListItem>
                            ))}
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

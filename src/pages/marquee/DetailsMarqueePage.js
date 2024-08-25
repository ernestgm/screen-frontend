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
import PROYECT_CONFIG from "../../config/config";
import TitlePageDetails from "../../sections/@dashboard/app/TitlePageDetails";
import Iconify from "../../components/iconify";
import useNavigateTo from "../../hooks/navigateTo";
import AdDataTable from "./AdDataTable";



// ----------------------------------------------------------------------

const NAME_PAGE = 'Marquee Details';
const URL_GET_PAGE = PROYECT_CONFIG.API_CONFIG.MARQUEE.GET;
const URL_TABLES_PAGE = '/dashboard/business/details/';
const URL_MENU_MARQUEE_PAGE = '/dashboard/marquees';
const URL_CREATE_IMAGE = '/dashboard/image/create/';

export default function DetailsMarqueePage() {
    const {navigateTo} = useNavigateTo();
    const showSnackbarMessage = useMessagesSnackbar();
    const {id} = useParams();
    const {api} = useApiHandlerStore((state) => state);
    const [marquee, setMarquee] = useState({
        business_id: '',
        created_at : '',
        id: '',
        name: '',
        bg_color: '',
        text_color: '',
        business: {
            name: '',
        },
        devices: [],
    })

    const getPageDetails = async () => {
        const response = await api.__get(`${URL_GET_PAGE}${id}`, (msg) => {
            showSnackbarMessage(msg, 'error');
        }, () => { getPageDetails() });
        if (response.data) {
            setMarquee(response.data);
        }
    }

    useEffect(() => {
        getPageDetails();
    }, [])

    return (
        <>
            <Helmet>
                <title> {NAME_PAGE} | {PROYECT_CONFIG.NAME} </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="left" justifyContent="space-between" mb={5}>
                    <Stack>
                        {
                            <BackButton path={`${URL_MENU_MARQUEE_PAGE}`}/>
                        }
                    </Stack>
                    <Typography variant="h4" gutterBottom>
                        {NAME_PAGE}
                    </Typography>
                </Stack>
                <Grid container spacing={2} mb={5}>
                    <Grid item xs={12} sm={6} md={6}>
                        <TitlePageDetails
                            title={marquee.name}
                            description=''
                            createdAt={marquee.created_at}
                            icon={'material-symbols:rtt'}
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
                                Business Name: { marquee.business.name }
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
                                Active on { marquee.devices.length } Device(s)
                            </Typography>
                            { marquee.devices.map((device) => (
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
                    <Grid item xs={12} sm={12} md={12}>
                        <Card
                            sx={{
                                p: 2,
                                boxShadow: 0,
                                textAlign: 'center',
                                color: marquee.text_color,
                                bgcolor: marquee.bg_color,
                            }}
                        >
                            <Typography variant="h4" gutterBottom>
                                Your marquee use this color palette
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>
                <Stack>
                    <Grid item xs={12} md={6} lg={8}>
                        <AdDataTable marquee={id} />
                    </Grid>
                </Stack>
            </Container>
        </>
    );
}

import {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
// @mui
import {Helmet} from 'react-helmet-async';
import {
    Card,
    Stack,
    Container,
    Typography,
    Grid,
} from '@mui/material';
import BackButton from "../../sections/@dashboard/app/AppBackButton";
import useApiHandlerStore from "../../zustand/useApiHandlerStore";
import useMessagesSnackbar from "../../hooks/messages/useMessagesSnackbar";
import PROYECT_CONFIG from "../../config/config";
import BusinessDetailsCard from "../../sections/@dashboard/business/BusinessDetailsCard";
import {MapContainer} from "../../components/map";
import AreasDataTable from "./table/AreasDataTable";


// ----------------------------------------------------------------------

const NAME_PAGE = 'Business Details';
const URL_GET_BUSINESS = PROYECT_CONFIG.API_CONFIG.BUSINESS.GET;
const URL_CREATE = '/business';
const URL_TABLES_PAGE = '/dashboard/business';
const URL_GET_ITEM_FOR_UPDATE = '/business/';

export default function DetailsBusinessPage() {
    const showSnackbarMessage = useMessagesSnackbar();
    const {id} = useParams();
    const {api} = useApiHandlerStore((state) => state);

    const [business, setBusiness] = useState({
        id: 0,
        cover: `/assets/images/covers/cover_4.jpg`,
        title: '',
        description: '',
        createdAt: '',
        view: 0,
        comment: 0,
        share: 0,
        favorite: 0,
        author: {
            name: '',
            avatarUrl: `/assets/images/avatars/avatar_4.jpg`,
        },
        geolocation: {
            address: '',
            latitude: '',
            longitude: ''
        }
    });

    const getBusinessDetails = async () => {
        const response = await api.__get(`${URL_GET_BUSINESS}${id}`, null, (msg) => {
            showSnackbarMessage(msg, 'error');
        });
        if (response) {
            const data = response.data;
            setBusiness((oldData) => (
                {
                    ...oldData,
                    id: data.id,
                    title: data.name,
                    description: data.description,
                    createdAt: data.created_at,
                    author: {
                        name: `${data.user.name} ${data.user.lastname}`,
                        avatarUrl: oldData.author.avatarUrl,
                    },
                    geolocation: {
                        address: data.geolocation ? data.geolocation.address : '',
                        latitude: data.geolocation ? data.geolocation.latitude : '',
                        longitude: data.geolocation ? data.geolocation.longitude : ''
                    }
                }
            ))
        }
    }

    useEffect(() => {
        getBusinessDetails();
    }, [])

    return (
        <>
            <Helmet>
                <title> {NAME_PAGE} | {PROYECT_CONFIG.NAME} </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="left" justifyContent="space-between" mb={5}>
                    <Stack>
                        <BackButton path={URL_TABLES_PAGE}/>
                    </Stack>
                    <Typography variant="h4" gutterBottom>
                        {NAME_PAGE}
                    </Typography>
                </Stack>
                <Grid container spacing={2} mb={5}>
                    <Grid item xs={12} md={5} lg={5}>
                        {business && <BusinessDetailsCard business={business}/>}
                    </Grid>

                    <Grid item xs={12} md={7} lg={7}>
                        {business.geolocation.address !== "" && <>
                            <Grid item xs={12} md={12} lg={12}>
                                <Typography variant="h6" gutterBottom>
                                    Address: {business.geolocation.address}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} sx={{
                                width: '100%',
                                height: '85%',
                            }}>
                                <Card sx={{
                                    width: '100%',
                                    height: '100%',
                                }}>
                                    <MapContainer map geolocation={business.geolocation}/>
                                </Card>
                            </Grid>
                        </>
                        }
                    </Grid>
                </Grid>
                <Stack>
                    <Grid item xs={12} md={6} lg={8}>
                        <AreasDataTable business={id}/>
                    </Grid>
                </Stack>
            </Container>
        </>
    );
}

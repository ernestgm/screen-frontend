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
import useNavigateTo from '../../hooks/navigateTo';
import palette from '../../theme/palette';



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
    const [bgIsPresentation, setBgIsPresentation] = useState(palette.grey['500']);
    const [bgIsPortrait, setBgIsPortrait] = useState(palette.grey['500']);
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
            if (response.data.portrait === 1) {
                setBgIsPortrait(palette.success.darker);
            }
            if (response.data.slide === 1) {
                setBgIsPresentation(palette.success.darker);
            }
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
          <title>
            {' '}
            {NAME_PAGE} | {PROJECT_CONFIG.NAME}{' '}
          </title>
        </Helmet>

        <Container>
          <Stack direction="row" alignItems="left" justifyContent="space-between" mb={5}>
            <Stack>
              {menu ? (
                <BackButton path={`${URL_MENU_SCREEN_PAGE}`} />
              ) : (
                <BackButton path={`${URL_TABLES_PAGE}${screen.business_id}`} />
              )}
            </Stack>
            <Typography variant="h4" gutterBottom>
              {NAME_PAGE}
            </Typography>
          </Stack>
          <Grid container spacing={2} mb={5}>
            <Grid item xs={12} sm={12} md={12}>
              <Card
                sx={{
                  py: 3,
                  px: 5,
                  mt: 2,
                  border: '1px solid #eee',
                  boxShadow: 8,
                  textAlign: 'left',
       '1px solid #eee'          >
                <Grid container spacing={2} mb={5}>
                  <Grid i,tem xs={12} sm={6} md={6}>
                    <Card>
                      <Typography variant="h4" gutterBottom>
                        Name: {screen.name}
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        Description: {screen.description}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        Business Name: {screen.business.name}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        Owner: {screen.business.user.name} {screen.business.user.lastname}
                      </Typography>

                      <Stack direction="row" spacing={2}>
                        <Card sx={{ p: 2, bgcolor: bgIsPresentation, color: '#FFF' }}>
                          <Stack direction="column" alignItems="center">
                            <Iconify icon="ri:slideshow-line" width={35} height={35} />
                            <Typography variant="caption" gutterBottom>
                              Presentation
                            </Typography>
                          </Stack>
                        </Card>
                        <Card sx={{ p: 2, bgcolor: bgIsPortrait, color: '#FFF' }}>
                          <Stack direction="column" alignItems="center">
                            <Iconify icon="ion:tablet-portrait-outline" width={35} height={35} />
                            <Typography variant="caption" gutterBottom>
                              Portrait
                            </Typography>
                          </Stack>
                        </Card>
                      </Stack>
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
                      <Typography variant="h6" gutterBottom>
                        Active on {screen.devices.length} Device(s)
                      </Typography>
                      {screen.devices.map((device) => (
                        <ListItem key={device.id}>
                          <Stack direction="column" alignItems="left" justifyContent="space-between">
                            <Typography variant="caption" gutterBottom>
                              <b>Name:</b> {device.name}
                            </Typography>
                            <Typography variant="caption" gutterBottom>
                              <b>Code:</b> {device.code}
                            </Typography>
                          </Stack>
                        </ListItem>
                      ))}
                    </Card>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
          <Stack>
            <Stack direction="row" alignItems="left" justifyContent="space-between" mb={5}>
              <Typography variant="h4" gutterBottom>
                Image List
              </Typography>
              <Button variant="outlined" onClick={handleClickNew} startIcon={<Iconify icon="eva:plus-fill" />}>
                Upload Images
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

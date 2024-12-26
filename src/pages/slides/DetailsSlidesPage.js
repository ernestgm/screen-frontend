import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Helmet } from 'react-helmet-async';
import { Stack, Container, Typography, Grid, Button, Card, ListItem } from '@mui/material';
import BackButton from '../../sections/@dashboard/app/AppBackButton';
import useApiHandlerStore from '../../zustand/useApiHandlerStore';
import useMessagesSnackbar from '../../hooks/messages/useMessagesSnackbar';
import PROJECT_CONFIG from '../../config/config';
import MediaDataTable from './MediaDataTable';
import Iconify from '../../components/iconify';
import useNavigateTo from '../../hooks/navigateTo';

// ----------------------------------------------------------------------

const NAME_PAGE = 'Slide Details';
const URL_GET_PAGE = PROJECT_CONFIG.API_CONFIG.SCREEN.GET;
const URL_TABLES_PAGE = '/dashboard/business/details/';
const URL_MENU_SCREEN_PAGE = '/dashboard/slides';
const URL_UPLOAD_IMAGE = '/dashboard/image/upload/';
const URL_UPLOAD_VIDEO = '/dashboard/video/upload/';

export default function DetailsSlidesPage() {
  const { navigateTo } = useNavigateTo();
  const showSnackbarMessage = useMessagesSnackbar();
  const { id, menu } = useParams();
  const { api } = useApiHandlerStore((state) => state);
  const [screen, setScreen] = useState({
    area_id: '',
    business_id: '',
    created_at: '',
    id: '',
    name: '',
    code: '',
    area: {
      business: {
        name: '',
        user: {
          name: '',
          lastname: '',
        },
      },
    },
    business: {
      name: '',
      user: {
        name: '',
        lastname: '',
      },
    },
    devices: [],
    description: '',
    screens: [],
  });

  const getPageDetails = async () => {
    const response = await api.__get(`${URL_GET_PAGE}${id}`, (msg) => {
      showSnackbarMessage(msg, 'error');
    });

    if (response !== undefined && response.data) {
      setScreen(response.data);
    }
  };

  useEffect(() => {
    getPageDetails();
    // eslint-disable-next-line
  }, []);

  // const goToUploadVideo = () => {
  //   navigateTo(`${URL_UPLOAD_VIDEO}${id}`);
  // };
  const goToUploadImage = () => {
    navigateTo(`${URL_UPLOAD_IMAGE}${id}`);
  };

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
              }}
            >
              <Grid container spacing={2} mb={5}>
                <Grid item xs={12} sm={6} md={6}>
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
            <Stack direction="row" spacing={1}>
              {/* <Button variant="outlined" color="primary" onClick={goToUploadVideo} startIcon={<Iconify icon="material-symbols:video-camera-back-add-outline" />}> */}
              {/* Upload Video */}
              {/* </Button> */}
              <Button
                variant="outlined"
                onClick={goToUploadImage}
                startIcon={<Iconify icon="material-symbols:add-photo-alternate-outline" />}
              >
                Upload Images
              </Button>
            </Stack>
          </Stack>
          <Grid item xs={12} md={6} lg={8}>
            <MediaDataTable screen={id} />
          </Grid>
        </Stack>
      </Container>
    </>
  );
}

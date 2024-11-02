import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Helmet } from 'react-helmet-async';
import { Stack, Container, Typography, Grid, Card, ListItem, Tabs, Tab, Box, Divider } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import BackButton from '../../sections/@dashboard/app/AppBackButton';
import useApiHandlerStore from '../../zustand/useApiHandlerStore';
import useMessagesSnackbar from '../../hooks/messages/useMessagesSnackbar';
import PROJECT_CONFIG from '../../config/config';
import Iconify from '../../components/iconify';
import ScheduleTimeLine from '../schedules/components/ScheduleTimeLine';

// ----------------------------------------------------------------------

const NAME_PAGE = 'Device';
const URL_GET_PAGE = PROJECT_CONFIG.API_CONFIG.DEVICE.GET;
const URL_BACK_PAGE = '/dashboard/devices';

export default function DetailsDevicePage() {
  const [value, setValue] = useState('1');
  const showSnackbarMessage = useMessagesSnackbar();
  const { id } = useParams();
  const { api } = useApiHandlerStore((state) => state);
  const [device, setDevice] = useState(null);

  const getPageDetails = async () => {
    const response = await api.__get(
      `${URL_GET_PAGE}${id}`,
      (msg) => {
        showSnackbarMessage(msg, 'error');
      },
      () => {
        getPageDetails();
      }
    );
    if (response !== undefined && response.data) {
      console.log(response.data);
      setDevice(response.data);
    }
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    getPageDetails();
  }, []);

  return (
    <>
      <Helmet>
        <title>
          {' '}
          {NAME_PAGE} | {PROJECT_CONFIG.NAME}{' '}
        </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="left" justifyContent="space-between" mb={3}>
          <Stack>{<BackButton path={`${URL_BACK_PAGE}`} />}</Stack>
          <Typography variant="h4" gutterBottom>
            {NAME_PAGE} Details
          </Typography>
        </Stack>
        <Grid container spacing={2} mb={5}>
          <Grid item xs={12} sm={12} md={12}>
            <Card
              sx={{
                py: 2,
                px: 2,
                mt: 0,
                boxShadow: 0,
                textAlign: 'left',
                color: (theme) => theme.palette.primary.darker,
                bgcolor: (theme) => theme.palette.primary.lighter,
              }}
            >
              <Stack direction="row" divider={<Divider color="#ccc" orientation="vertical" flexItem />} spacing={2}>
                <Stack direction="column" spacing={1}>
                  <Iconify width="35px" icon="mdi:cast-variant" sx={{ color: 'red' }} />
                  <Iconify width="35px" icon="mdi:radar" sx={{ color: 'red' }} />
                </Stack>
                <Stack orientation="horizontal" spacing={2} sx={{ padding: '0px 0' }}>
                  <Typography variant="h5" gutterBottom>
                    <b>name:</b> {device && device.name}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <b>Device ID:</b> {device && device.device_id}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <b>Code:</b> {device && device.code}
                  </Typography>
                </Stack>
              </Stack>
            </Card>
          </Grid>
          <Grid item spacing={2} xs={12} sm={6} md={6}>
            <Card
              sx={{
                py: 0,
                px: 0,
                mt: 1,
                boxShadow: 0,
                textAlign: 'left',
                border: '1px solid #ccc',
                color: (theme) => theme.palette.primary.darker,
                bgcolor: (theme) => theme.palette.common.white,
              }}
            >
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                    <Tab label="Default Screen" value="1" />
                    <Tab label="Active Screen" value="2" />
                  </TabList>
                </Box>
                <TabPanel value="1" sx={{ p: 0 }}>
                  {device && (
                    <img
                      src={device.default_screen && device.default_screen.images[0]?.image}
                      alt={device.default_screen && device.default_screen.name}
                      loading="lazy"
                    />
                  )}
                  {device && (
                    <Card
                      sx={{
                        p: 1,
                        boxShadow: 0,
                        textAlign: 'center',
                        color: `${device.default_marquee && device.default_marquee.text_color}`,
                        bgcolor: `${device.default_marquee && device.default_marquee.bg_color}`,
                        borderRadius: '0',
                      }}
                    >
                      <Typography variant="h5" gutterBottom>
                        {device.default_marquee && device.default_marquee.ads[0]?.message}
                      </Typography>
                    </Card>
                  )}
                </TabPanel>
                <TabPanel value="2" sx={{ p: 0 }}>
                  {device && (
                    <img
                      src={device.screen && device.screen.images[0]?.image}
                      alt={device.screen && device.screen.name}
                      loading="lazy"
                    />
                  )}
                  {device && (
                    <Card
                      sx={{
                        p: 1,
                        boxShadow: 0,
                        textAlign: 'center',
                        color: `${device.marquee && device.marquee.text_color}`,
                        bgcolor: `${device.marquee && device.marquee.bg_color}`,
                        borderRadius: '0',
                      }}
                    >
                      <Typography variant="h5" gutterBottom>
                        {device.marquee && device.marquee.ads[0]?.message}
                      </Typography>
                    </Card>
                  )}
                </TabPanel>
                <TabPanel value="3">Item Three</TabPanel>
              </TabContext>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Card
              sx={{
                py: 1,
                px: 1,
                mt: 1,
                boxShadow: 0,
                textAlign: 'left',
                border: '1px solid #ccc',
                color: (theme) => theme.palette.primary.darker,
              }}
            >
              <Stack
                direction="row"
                divider={<Divider color="#ccc" orientation="vertical" flexItem />}
                spacing={1}
                sx={{ padding: '5px 0' }}
              >
                <Iconify width="25px" icon="eva:clock-outline" />
                <Typography variant="h5" gutterBottom>
                  Schedules
                </Typography>
              </Stack>
              <Divider color="#ccc" orientation="horizontal" flexItem />
              {device && <ScheduleTimeLine schedules={device.schedules} />}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

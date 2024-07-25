import { Helmet } from 'react-helmet-async';
import {useEffect, useState} from "react";
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// table

// sections
import {AppWidgetSummary} from "../../sections/@dashboard/app";
import useMessagesSnackbar from "../../hooks/messages/useMessagesSnackbar";

import useApiHandlerStore from "../../zustand/useApiHandlerStore";
import useAccontHandlerStore from "../../zustand/useAccontHandlerStore";

import PROYECT_CONFIG from "../../config/config";



// ----------------------------------------------------------------------
const URL_GET_BUSINESS_RESUME = PROYECT_CONFIG.API_CONFIG.BUSINESS.RESUME;

export default function Dashboard() {
    const showSnackbarMessage = useMessagesSnackbar();
    const {api} = useApiHandlerStore((state) => state);
    const { account } = useAccontHandlerStore((state) => state);
    const [bussinesCount, setBussinesCount] = useState(0);
    const [screenCount, setScreenCount] = useState(0);
    const [imagesCount, setImagesCount] = useState(0);
    const getBusinessDetails = async () => {
        let params = ''
        const rol = account.role && account.role.tag;
        const user = account.uid && account.uid;
        if (rol !== 'admin') {
            params = `?userId=${user}`
        }
        const response = await api.__get(`${URL_GET_BUSINESS_RESUME}${params}`, null, (msg) => {
            showSnackbarMessage(msg, 'error');
        });
        if (response) {
            setBussinesCount(response.bussines)
            setScreenCount(response.screens)
            setImagesCount(response.images)
        }
    }

    useEffect(() => {
        getBusinessDetails();
    }, [])

  return (
    <>
      <Helmet>
        <title> Dashboard | { PROYECT_CONFIG.NAME } </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
                <AppWidgetSummary title="Bussines" total={bussinesCount} icon={'ant-design:build-filled'} />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
                <AppWidgetSummary title="Screens" total={screenCount} color="info" icon={'mdi:monitor-dashboard'} />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
                <AppWidgetSummary title="Images" total={imagesCount} color="warning" icon={'ant-design:picture-filled'} />
            </Grid>
          <Grid item xs={12} md={12} lg={12}>
            {/* <BusinessResume /> */}

          </Grid>
        </Grid>
      </Container>
    </>
  );
}

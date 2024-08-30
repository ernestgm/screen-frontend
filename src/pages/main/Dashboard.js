import { Helmet } from 'react-helmet-async';
import {useEffect, useState} from "react";
// @mui
import { Grid, Container, Typography } from '@mui/material';
import useNavigateTo from "../../hooks/navigateTo";
// table

// sections
import {AppWidgetSummary} from "../../sections/@dashboard/app";
import useAccontHandlerStore from "../../zustand/useAccontHandlerStore";

import PROYECT_CONFIG from "../../config/config";




// ----------------------------------------------------------------------
const URL_GET_BUSINESS_RESUME = PROYECT_CONFIG.API_CONFIG.BUSINESS.RESUME;

export default function Dashboard() {
    const {navigateTo} = useNavigateTo();
    const { account } = useAccontHandlerStore((state) => state);

    const isAdmin = () => {
        const rol = account.role && account.role.tag;
        return rol === 'admin'
    }

    const goToBusiness = () => {
       navigateTo('/dashboard/business')
    }
    const goToScreen = () => {
        navigateTo('/dashboard/screens')
    }
    const goToUser = () => {
        navigateTo('/dashboard/user')
    }
    const goToMarquee = () => {
        navigateTo('/dashboard/marquees')
    }
    const goToDevice = () => {
        navigateTo('/dashboard/devices')
    }

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
            <Grid item xs={12} sm={3} md={3} sx={{display: isAdmin() ? 'block' : 'none' }}>
                <AppWidgetSummary title="Business" total={0} icon={'ion:business-sharp'} onClicked={goToBusiness}/>
            </Grid>

            <Grid item xs={12} sm={3} md={3}>
                <AppWidgetSummary title="Screens" total={0} color="info" icon={'mdi:monitor-dashboard'} onClicked={goToScreen}/>
            </Grid>

            <Grid item xs={12} sm={3} md={3} sx={{display: isAdmin() ? 'block' : 'none' }}>
                <AppWidgetSummary title="User" total={0} color="warning" icon={'material-symbols:supervised-user-circle'} onClicked={goToUser}/>
            </Grid>

            <Grid item xs={12} sm={3} md={3}>
                <AppWidgetSummary title="Marquees" total={0} icon={'material-symbols:rtt'} onClicked={goToMarquee}/>
            </Grid>

            <Grid item xs={12} sm={3} md={3} sx={{display: isAdmin() ? 'block' : 'none' }}>
                <AppWidgetSummary title="Devices" total={0} color="info" icon={'mdi:cast-variant'} onClicked={goToDevice}/>
            </Grid>
        </Grid>
      </Container>
    </>
  );
}

import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// table

// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../../sections/@dashboard/app';
import PROYECT_CONFIG from "../../config/config";
import Iconify from "../../components/iconify";
import BusinessResume from "../../sections/@dashboard/business/BusinessResume";

// ----------------------------------------------------------------------

export default function Dashboard() {
  const theme = useTheme();

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
          <Grid item xs={12} md={12} lg={12}>
            <BusinessResume />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

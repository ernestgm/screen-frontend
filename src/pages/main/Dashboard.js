import { Helmet } from 'react-helmet-async';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// table

// sections
import PROYECT_CONFIG from "../../config/config";
import BusinessResume from "../../sections/@dashboard/business/BusinessResume";

// ----------------------------------------------------------------------

export default function Dashboard() {
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
            {/* <BusinessResume /> */}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// table
import Logo from '../components/logo';
import Iconify from '../components/iconify';
// sections
import { LoginForm } from '../sections/auth/login';
import useAuthStore from '../zustand/useAuthStore';
import GlobalNotification from "../components/snackbar";
import PROYECT_CONFIG from "../config/config";

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function LoginPage(props) {
  const navigate = useNavigate();
  const mdUp = useResponsive('up', 'md');
  const { currentUser } = useAuthStore((state) => state);

  useEffect(() => {
    if (currentUser) {
      navigate('/', { replace: true });
    }
  }, []);

  return (
    <>
      <Helmet>
        <title> Login | { PROYECT_CONFIG.NAME } </title>
      </Helmet>
      <GlobalNotification/>
      <StyledRoot>
        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, Welcome Back
            </Typography>
            <img src="/assets/illustrations/illustration_login.png" alt="login" />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Stack direction="row" spacing={2}>
              <Logo
                  sx={{
                    position: 'fixed',
                    top: { xs: 16, sm: 24, md: 40 },
                    left: { xs: 16, sm: 24, md: 40 },
                  }}
              />
              <Typography variant="h4" alignSelf="center">
              Sign in to { PROYECT_CONFIG.NAME }
            </Typography>
            </Stack>

            <Divider sx={{ my: 3 }}/>

            <LoginForm />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}

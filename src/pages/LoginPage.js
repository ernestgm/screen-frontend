import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Container, Typography, Divider, Stack, Box } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// sections
import { LoginForm } from '../sections/auth/login';
import useAuthStore from '../zustand/useAuthStore';
import GlobalNotification from "../components/snackbar";
import PROJECT_CONFIG from "../config/config";
import useNavigateTo from "../hooks/navigateTo";

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
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

export default function LoginPage() {
  const {navigateTo} = useNavigateTo();
  const mdUp = useResponsive('up', 'md');
  const { currentUser } = useAuthStore((state) => state);

  useEffect(() => {
    if (currentUser) {
      navigateTo('/');
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Helmet>
        <title> Login | {PROJECT_CONFIG.NAME} </title>
      </Helmet>
      <GlobalNotification />
      <StyledRoot>
        {mdUp && (
          <StyledSection>
            <Typography alignSelf="center" variant="h4" sx={{ px: 5, mt: 0, mb: 5 }}>
              Hi, Welcome
            </Typography>
            <Stack direction="column" alignItems="center">
              <Box
                component="img"
                alt="PlayAds"
                src="/assets/logo.png"
                sx={{ width: 450, borderRadius: 1.5, flexShrink: 0 }}
              />
            </Stack>
          </StyledSection>
        )}

        <Container >
          <StyledContent>
            <Stack direction="row" spacing={2} alignItems="center"  justifyContent="center">
              <Box
                component="img"
                alt="PlayAds"
                src="/assets/logo.png"
                sx={{ width: 150, borderRadius: 1.5, flexShrink: 0, display: {lg: 'none', md: 'none', sm: 'block', xs: 'block'} }}
              />
              <Typography variant="h4" alignSelf="right">
                Sign in
              </Typography>
            </Stack>
            <Divider sx={{ my: 3 }} />
            <LoginForm />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}

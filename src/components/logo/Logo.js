import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, Link } from '@mui/material';

// ----------------------------------------------------------------------

// eslint-disable-next-line
const Logo = (({disabledLink = false}) => {
  const logo = (
    <Box component="img" alt="PlayAds" src="/assets/logo.png" sx={{ width: 150, borderRadius: 1.5, flexShrink: 0 }} />
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return (
    <Link to="/" component={RouterLink} sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
};

export default Logo;

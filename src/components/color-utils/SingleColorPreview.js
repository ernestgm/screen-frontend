import PropTypes from 'prop-types';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Stack } from '@mui/material';

// ----------------------------------------------------------------------

SingleColorPreview.propTypes = {
  sx: PropTypes.object,
  color: PropTypes.string,
};

export default function SingleColorPreview({ color, sx }) {
  return (
    <Stack component="span" direction="row" alignItems="center" justifyContent="flex-end" sx={sx}>
      <Box
          key={color}
          sx={{
            ml: -0.75,
            width: 16,
            height: 16,
            borderRadius: '50%',
            border: (theme) => `solid 2px ${theme.palette.background.paper}`,
            boxShadow: (theme) => `inset -1px 1px 2px ${alpha(theme.palette.common.black, 0.24)}`,
            bgcolor: color,
          }}
      />
    </Stack>
  );
}

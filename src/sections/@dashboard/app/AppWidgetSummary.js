// @mui
import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import {Card, CardActionArea, Typography} from '@mui/material';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';
// table
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const StyledIcon = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
}));

// ----------------------------------------------------------------------

AppWidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  sx: PropTypes.object,
};

export default function AppWidgetSummary({ title, total, icon, color = 'primary', onClicked = () => {}, sx, ...other }) {
  return (
    <Card
      sx={{
        boxShadow: 0,
        textAlign: 'center',
        color: (theme) => theme.palette[color].darker,
        bgcolor: (theme) => theme.palette[color].lighter,
        ...sx,
      }}
      {...other}
    >
        <CardActionArea onClick={onClicked}>
      <StyledIcon
        sx={{
            my: 5,
          color: (theme) => theme.palette[color].dark,
          backgroundImage: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette[color].dark, 0)} 0%, ${alpha(
              theme.palette[color].dark,
              0.24
            )} 100%)`,
        }}
      >
        <Iconify icon={icon} width={24} height={24} />
      </StyledIcon>

      <Typography variant="h3">{ total > 0 ? fShortenNumber(total) : "" }</Typography>

      <Typography variant="subtitle2" sx={{my: 2, opacity: 0.72 }}>
        {title}
      </Typography>
        </CardActionArea>
    </Card>
  );
}

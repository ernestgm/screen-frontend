import PropTypes from 'prop-types';
// @mui
import { styled, alpha } from '@mui/material/styles';
import {Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment, Hidden} from '@mui/material';
// table
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

// ----------------------------------------------------------------------

UserListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onDeleteSelect: PropTypes.func,
  onDetailsSelect: PropTypes.func,
  onEditSelect: PropTypes.func,
  onlyEdit: PropTypes.bool,
};

export default function UserListToolbar({onlyEdit = false, numSelected, filterName, onFilterName, onDeleteSelect, onDetailsSelect = () => {}, onEditSelect = () => {} }) {
  return (
    <StyledRoot
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1" sx={{marginRight: 'auto'}}>
          {numSelected} selected
        </Typography>
      ) : (
        <StyledSearch
          value={filterName}
          onChange={onFilterName}
          placeholder="Search ..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          }
        />
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={onDeleteSelect}>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      ) : (
          <Typography component="div">
            {""}
          </Typography>
      )}

      {numSelected === 1 ? (
          <Hidden only={['xl','lg','md','sm']}>

            { onlyEdit === false ? (
                    <Tooltip title="Details">
                      <IconButton onClick={onDetailsSelect}>
                        <Iconify icon="tabler:list-details" />
                      </IconButton>
                    </Tooltip>
                ) : (
                      <Typography component="div">
                        {""}
                      </Typography>
                    )
            }


            <Tooltip title="Edit">
              <IconButton onClick={onEditSelect}>
                <Iconify icon="eva:edit-fill" />
              </IconButton>
            </Tooltip>
          </Hidden>
      ) : (
          <Typography component="div">
            {""}
          </Typography>
      )}
    </StyledRoot>
  );
}

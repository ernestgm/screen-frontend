import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  DialogActions,
  Button,
  Dialog,
  Divider,
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import { Delete } from '@mui/icons-material';
// table
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections

import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
import { applySortFilter, getComparator } from '../../utils/table/tableFunctions';
import useApiHandlerStore from '../../zustand/useApiHandlerStore';
import { formatDate, parseTime } from '../../utils/formatTime';
import useMessagesAlert from '../../hooks/messages/useMessagesAlert';
import useMessagesSnackbar from '../../hooks/messages/useMessagesSnackbar';
import PROJECT_CONFIG from '../../config/config';
import useAuthStore from '../../zustand/useAuthStore';
import palette from '../../theme/palette';
import useNavigateTo from '../../hooks/navigateTo';
import { a11yProps } from '../../utils/tabs/tabsFunctions';

// ----------------------------------------------------------------------
const SCHEDULES_URL_GET_DATA = PROJECT_CONFIG.API_CONFIG.SCHEDULES.ALL;
const SCHEDULES_URL_DELETE_ROW = PROJECT_CONFIG.API_CONFIG.SCHEDULES.DELETE;

const PATH_EDIT_ROW = `/dashboard/schedule/edit/`;
const PATH_NEW_ROW = '/dashboard/schedule/create';
const ADMIN_TAG = PROJECT_CONFIG.API_CONFIG.ROLES.ADMIN;

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'device', label: 'Device', alignRight: false },
  { id: 'screen', label: 'Screen', alignRight: false },
  { id: 'marquee', label: 'Marquee', alignRight: false },
  { id: 'start_time', label: 'Start Time', alignRight: false },
  { id: 'end_time', label: 'End Time', alignRight: false },
  // {id: 'created_at', label: 'Create At', alignRight: false},
  { id: 'updated_at', label: 'Update At', alignRight: false },
  { id: 'actions', label: 'Actions' },
];

const NAME_PAGE = 'Schedules';

export default function SchedulesPage() {
  const { navigateTo } = useNavigateTo();
  const [value, setValue] = useState(0);
  const [filterTab, setFilterTab] = useState('screen');
  const [schedules, setSchedules] = useState([]);
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('code');
  const [filterQuery, setFilterQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(PROJECT_CONFIG.TABLE_CONFIG.ROW_PER_PAGE);
  const [loading, setLoading] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [rowsForDelete, setRowsForDelete] = useState([]);

  const { currentUser } = useAuthStore((state) => state);
  const { api } = useApiHandlerStore((state) => state);
  const showMessageAlert = useMessagesAlert();
  const showMessageSnackbar = useMessagesSnackbar();

  const newRowHandleClick = () => {
    navigateTo(PATH_NEW_ROW);
  };

  const getSchedules = async () => {
    const response = await api.__get(
      `${SCHEDULES_URL_GET_DATA}`,
      (msg) => {
        showMessageSnackbar(msg, 'error');
      },
      () => {
        getSchedules();
      }
    );

    if (response !== undefined && response.data) {
      if (currentUser && currentUser.user.role.tag === ADMIN_TAG) {
        console.log(Object.values(response.data));
        setSchedules(Object.values(response.data));
      } else {
        const filteredDevices = filter(response.data, (_device) => _device.user_id === currentUser.user.id);
        console.log(filteredDevices);
        setSchedules(filteredDevices);
      }
    }
  };

  const handleEditItemClick = (item) => {
    handleCloseMenu();
    navigateTo(`${PATH_EDIT_ROW}${item.id}`);
  };

  const deleteDevices = async () => {
    setLoading(true);
    const data = { ids: rowsForDelete };
    const response = await api.__delete(
      `${SCHEDULES_URL_DELETE_ROW}`,
      data,
      (msg) => {
        showMessageSnackbar(msg, 'error');
      },
      () => {
        deleteDevices();
      }
    );

    if (response) {
      showMessageAlert(response.message, 'success');
      getSchedules();
      setSelected([]);
    }
    setLoading(false);
    setOpenConfirmDelete(false);
  };

  const handleDeleteSelected = () => {
    setRowsForDelete(selected);
    setOpenConfirmDelete(true);
  };

  const handleEditSelected = () => {};

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      let newSelecteds = schedules.filter((item) => {
        return item.schedule_type === filterTab;
      });
      newSelecteds = newSelecteds.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByQuery = (event) => {
    setPage(0);
    setFilterQuery(event.target.value);
  };

  const handleDeleteItemClick = (item) => {
    handleCloseMenu();
    setRowsForDelete([item.id]);
    setOpenConfirmDelete(true);
  };

  const handleCloseConfirmDelete = () => {
    setOpenConfirmDelete(false);
    setRowsForDelete([]);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - schedules.length) : 0;

  let filteredSchedules = applySortFilter({
    array: schedules,
    comparator: getComparator({ _order: order, _orderBy: orderBy }),
    query: filterQuery,
  });

  filteredSchedules = filteredSchedules.filter((item) => {
    return item.schedule_type === filterTab;
  });

  const isNotFound = !filteredSchedules.length && !!filterQuery;

  const handleTabChange = (event, newValue) => {
    const schedulesType = ['screen', 'marquee', 'all'];
    setFilterTab(schedulesType[newValue]);
    setValue(newValue);
  };

  useEffect(() => {
    getSchedules();
  }, []);

  return (
    <>
      <Helmet>
        <title>
          {' '}
          {NAME_PAGE} | {PROJECT_CONFIG.NAME}{' '}
        </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={2}
            sx={{ padding: '15px 0' }}
          >
            <Iconify width="35px" icon="eva:clock-outline" />
            <Typography variant="h4" gutterBottom>
              {NAME_PAGE}
            </Typography>
          </Stack>
          <Button onClick={newRowHandleClick} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New {NAME_PAGE}
          </Button>
        </Stack>

        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example">
              <Tab label="Screens" {...a11yProps(0)} />
              <Tab label="Marquees" {...a11yProps(1)} />
              <Tab label="Both" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <UserListToolbar
            numSelected={selected.length}
            filterQuery={filterQuery}
            onFilterQuery={handleFilterByQuery}
            onDeleteSelect={handleDeleteSelected}
            onEditSelect={handleEditSelected}
            onlyEdit
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={filteredSchedules.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredSchedules.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, name } = row;
                    const selectedDevices = selected.indexOf(id) !== -1;
                    const bgColorCell = row.enabled === 1 ? palette.success.lighter : palette.error.lighter;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={selectedDevices}
                        sx={{ background: bgColorCell }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedDevices} onChange={(event) => handleClick(event, id)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{row.device ? row.device.name : '------'}</TableCell>

                        <TableCell align="center">{row.screen ? row.screen.name : '------'}</TableCell>

                        <TableCell align="center">{row.marquee ? row.marquee.name : 'No'}</TableCell>

                        <TableCell align="center">{parseTime(row.start_time).format('hh:mm A')}</TableCell>

                        <TableCell align="left">{parseTime(row.end_time).format('hh:mm A')}</TableCell>

                        <TableCell align="left">{formatDate(row.updated_at)}</TableCell>

                        <TableCell align="right">
                          <IconButton id={id} size="large" color="inherit" onClick={handleOpenMenu}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={9} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterQuery}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={PROJECT_CONFIG.TABLE_CONFIG.ROWS_PER_PAGE_OPTIONS}
            component="div"
            count={filteredSchedules.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Dialog open={openConfirmDelete} onClose={handleCloseConfirmDelete}>
        <DialogTitle>Delete</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            Are you sure you want to delete the selected data?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDelete}>Cancel</Button>
          <LoadingButton
            color="error"
            onClick={deleteDevices}
            loading={loading}
            loadingPosition="start"
            startIcon={<Delete />}
            variant="contained"
          >
            <span>OK</span>
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={() => handleEditItemClick(open)}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDeleteItemClick(open)} sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Popover,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Typography, InputAdornment, FilledInput,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import { filter } from 'lodash';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';

import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
import Scrollbar from '../../components/scrollbar/Scrollbar';
import { formatDate } from '../../utils/formatTime';
import Iconify from '../../components/iconify';
import useApiHandlerStore from '../../zustand/useApiHandlerStore';
import useMessagesAlert from '../../hooks/messages/useMessagesAlert';
import useMessagesSnackbar from '../../hooks/messages/useMessagesSnackbar';
import { applySortFilter, getComparator } from '../../utils/table/tableFunctions';
import palette from '../../theme/palette';
import useAuthStore from '../../zustand/useAuthStore';
import positions from '../../_mock/positions';
import PROJECT_CONFIG from '../../config/config';


const QR_URL_GET_ALL_DATA = PROJECT_CONFIG.API_CONFIG.QR.ALL;
const QR_URL_GET_DATA_UPDATE = PROJECT_CONFIG.API_CONFIG.QR.GET;
const QR_URL_DELETE_ROW = PROJECT_CONFIG.API_CONFIG.QR.DELETE;
const QR_URL_CREATE_ROW = PROJECT_CONFIG.API_CONFIG.QR.CREATE;
const QR_URL_UPDATE_ROW = PROJECT_CONFIG.API_CONFIG.QR.UPDATE;
const BUSINESS_URL_GET_DATA = PROJECT_CONFIG.API_CONFIG.BUSINESS.ALL;

const TABLE_HEAD = [
  { id: 'preview', label: 'Preview', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'business', label: 'Business', alignRight: false },
  { id: 'info', label: 'Info', alignRight: false },
  { id: 'active_on', label: 'Active On', alignRight: false },
  { id: 'created_at', label: 'Create At', alignRight: false },
  { id: 'updated_at', label: 'Update At', alignRight: false },
  { id: 'actions', label: 'Actions' },
];

export default function QrDataTable() {
  const [dataTable, setDataTable] = useState([]);
  const [open, setOpen] = useState(false);
  const [qrPreview, setQrPreview] = useState("");
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('created_at');
  const [filterQuery, setFilterQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(PROJECT_CONFIG.TABLE_CONFIG.ROW_PER_PAGE);
  const [businesses, setBusinesses] = useState([]);
  const [disabledAreaField] = useState(false);
  const [update, setUpdate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [rowsForDelete, setRowsForDelete] = useState([]);

  const { currentUser } = useAuthStore((state) => state);
  const { api } = useApiHandlerStore((state) => state);
  const showMessageAlert = useMessagesAlert();
  const showMessageSnackbar = useMessagesSnackbar();

  const getBusiness = async () => {
    const response = await api.__get(
      `${BUSINESS_URL_GET_DATA}`,
      (msg) => {
        showMessageSnackbar(msg, 'error');
      }
    );

    if (response !== undefined && response.data) {
      if (currentUser && currentUser.user.role.tag === PROJECT_CONFIG.API_CONFIG.ROLES.ADMIN) {
        setBusinesses(Object.values(response.data));
      } else {
        const filteredBusiness = filter(response.data, (_business) => _business.user_id === currentUser.user.id);
        setBusinesses(filteredBusiness);
      }
    }
  };
  const getQrs = async () => {
    const response = await api.__get(
      QR_URL_GET_ALL_DATA,
      (msg) => {showMessageSnackbar(msg, 'error')}
    );

    if (response !== undefined && response.data) {
      if (currentUser && currentUser.user.role.tag === PROJECT_CONFIG.API_CONFIG.ROLES.ADMIN) {
        setDataTable(Object.values(response.data));
      } else {
        const filteredMarquee = filter(response.data, (_marquee) => _marquee.business.user_id === currentUser.user.id);
        setDataTable(filteredMarquee);
      }
    }
  };

  const deleteRows = async () => {
    const data = { ids: rowsForDelete };
    const response = await api.__delete(
      QR_URL_DELETE_ROW,
      data,
      (msg) => {showMessageSnackbar(msg, 'error')},
      (_loading) => {setLoading(_loading)},
    );

    if (response) {
      showMessageAlert(response.message, 'success');
      getQrs();
      setSelected([]);
    }
    setOpenConfirmDelete(false);
  };

  const handleDeleteSelected = () => {
    setRowsForDelete(selected);
    setOpenConfirmDelete(true);
  };

  const handleEditSelected = () => {
    if (selected.length === 1) {
      editAction(selected[0]);
    }
  };

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
      const newSelecteds = dataTable.map((n) => n.id);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataTable.length) : 0;

  const filteredDataTable = applySortFilter({
    array: dataTable,
    comparator: getComparator({ _order: order, _orderBy: orderBy }),
    query: filterQuery,
  });

  const isNotFound = !filteredDataTable.length && !!filterQuery;

  const handleEditItemClick = (item) => {
    handleCloseMenu();
    editAction(item.id);
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

  const [validator, setValidator] = useState({});
  const initialFormData = {
    name: '',
    business_id: '',
    message: 'SCAN ME',
    info: '',
    position: 'br',
  };
  const [formData, setFormData] = useState(initialFormData);

  const handlePositionChange = (event, newAlignment) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      position: newAlignment
    }));
  };

  const control = {
    value: formData.position ? formData.position : 'br',
    onChange: handlePositionChange,
    exclusive: true,
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleClickNewMarquee = () => {
    setFormData(initialFormData);
    setOpenNewDialog(true);
  };

  const handleCloseNew = () => {
    setOpenNewDialog(false);
    setFormData(initialFormData);
    setUpdate(null);
    setValidator([]);
    setQrPreview("")
  };

  const createNewAction = async () => {
    let response;
    const editFormData = {};

    if (update) {
      editFormData.name = formData.name;
      editFormData.business_id = formData.business_id;
      editFormData.message = formData.message;
      editFormData.info = formData.info;
      editFormData.position = formData.position;

      response = await api.__update(
        `${QR_URL_UPDATE_ROW}${update}`,
        editFormData,
        (msg) => { showMessageSnackbar(msg, 'error') },
        (isLoading) => { setLoading(isLoading) }
      );
    } else {
      response = await api.__post(
        QR_URL_CREATE_ROW,
        formData,
        (msg) => { showMessageSnackbar(msg, 'error') },
        (isLoading) => { setLoading(isLoading) }
      );
    }

    if (response) {
      if (response.success) {
        const msg = update ? `Marquee updated successfully!` : `Marquee added successfully!`;
        showMessageSnackbar(msg, 'success');
        setOpenNewDialog(false);
        getQrs();
        setUpdate(null);
        setFormData(initialFormData);
        setValidator([]);
      } else {
        setValidator(response.data && response.data);
      }
    }
  };

  const editAction = async (id) => {
    setUpdate(id);
    const response = await api.__get(
      `${QR_URL_GET_DATA_UPDATE}${id}`,
      (msg) => {showMessageSnackbar(msg, 'error')}
    );

    if (response.data) {
      setFormData({
        name: response.data.name,
        message: response.data.message,
        info: response.data.info,
        business_id: response.data.business_id,
        position: response.data.position,
      });
      setOpenNewDialog(true);
    }
  };

  const handleClickQRPreview = () => {
    setQrPreview(formData.info)
  };

  const handleClickQRPreviewDownload = () => {
    const canvas = document.getElementById("qr-preview");
    const link = document.createElement("a");

    // Convert canvas content to a data URL
    link.href = canvas.toDataURL("image/png");
    link.download = "canvas-image.png";

    // Trigger download
    link.click();
  };

  useEffect(() => {
    getBusiness();
    getQrs();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Stack direction="row" alignItems="end" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          {''}
        </Typography>
        <Button variant="outlined" onClick={handleClickNewMarquee} startIcon={<Iconify icon="eva:plus-fill" />}>
          New QR
        </Button>
      </Stack>
      <Card>
        <UserListToolbar
          numSelected={selected.length}
          filterQuery={filterQuery}
          onFilterQuery={handleFilterByQuery}
          onDeleteSelect={handleDeleteSelected}
          onEditSelect={handleEditSelected}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <UserListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={filteredDataTable.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredDataTable.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  const { id, name, business, info, devices } = row;
                  const selectedRow = selected.indexOf(id) !== -1;
                  const nameBusiness = business ? business.name : '';
                  let bgColorCell = palette.success.lighter;
                  const ActiveOn = devices ? devices.length : 0;

                  if (ActiveOn === 0) {
                    bgColorCell = palette.warning.lighter;
                  }

                  return (
                    <TableRow
                      hover
                      key={id}
                      tabIndex={-1}
                      role="checkbox"
                      selected={selectedRow}
                      sx={{ background: bgColorCell }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={selectedRow} onChange={(event) => handleClick(event, id)} />
                      </TableCell>

                      <TableCell align="left">
                        <QRCodeSVG
                          value={info}
                          size={70}
                          bgColor="#ffffff"
                          fgColor="#000000"
                        />
                      </TableCell>
                      <TableCell align="left" component="th" scope="row" padding="none">
                        <Typography variant="subtitle2" noWrap>
                          {name}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">{nameBusiness}</TableCell>
                      <TableCell align="left">{info}</TableCell>
                      <TableCell align="left">{row.devices ? row.devices.length : 0} Device(s)</TableCell>
                      <TableCell align="left">{formatDate(row.created_at)}</TableCell>
                      <TableCell align="left">{formatDate(row.updated_at)}</TableCell>
                      <TableCell align="center">
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
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
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
          count={filteredDataTable.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
      <Dialog open={openNewDialog} onClose={handleCloseNew}>
        <DialogTitle>{update ? 'Edit' : 'Create a new'} QR</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Name"
            value={formData.name ?? ''}
            type="text"
            fullWidth
            variant="standard"
            onChange={handleChange}
            error={validator.name && true}
            helperText={validator.name}
            sx={{ mb: 3 }}
          />
          <FormControl
            variant="standard"
            fullWidth
            disabled={disabledAreaField}
            defaultValue={''}
            sx={{ mb: 3 }}
            error={validator.business_id && true}
          >
            <InputLabel id="role-select-label">Select Business</InputLabel>
            <Select
              name="business_id"
              labelId="business-select-label"
              id="business-select"
              value={formData.business_id ?? ''}
              label="Select Business"
              onChange={handleChange}
            >
              {
                businesses.map((item) =>
                  (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  )
                )
              }
            </Select>
          </FormControl>
          <FormControl
            sx={{ mb: 3 }}
            fullWidth
          >
            <InputLabel htmlFor="outlined-adornment-password">Info</InputLabel>
            <FilledInput
              id="outlined-adornment-password"
              type={'text'}
              name="info"
              label="Info"
              value={formData.info ?? ''}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <Button
                    variant="outlined"
                    onClick={handleClickQRPreview}
                    startIcon={<Iconify icon="clarity:qr-code-line" />}
                    disabled={formData.info === ""}
                  >
                    Preview
                  </Button>
                </InputAdornment>
              }
              error={validator.info && true}
              helperText={validator.info}
            />
          </FormControl>
          { qrPreview !== "" && (
            <Stack direction="column" spacing={1} alignItems="center">
              <QRCodeCanvas
                id="qr-preview"
                value={qrPreview}
                size={200}
                bgColor="#ffffff"
                fgColor="#000000"
              />
              <Button variant="outlined" color="primary" onClick={handleClickQRPreviewDownload}>Download</Button>
            </Stack>
            )
          }
          <Stack direction="column" spacing={1}>
            <Typography variant="body2" gutterBottom>
              Position
            </Typography>
            <Paper
              elevation={0}
              sx={(theme) => ({
                display: 'flex',
                border: `0px solid ${theme.palette.divider}`,
                flexWrap: 'wrap',
              })}
            >
              <ToggleButtonGroup
                size="small"
                {...control}
                aria-label="Small sizes"
                sx={(theme) => ({
                  display: 'flex',
                  border: `0px solid ${theme.palette.divider}`,
                  flexWrap: 'wrap',
                })}
              >
                {positions.map((pos) => (
                  <ToggleButton value={pos.id} key={pos.id}>
                    <Iconify width="35px" icon={pos.icon} />
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Paper>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNew}>Cancel</Button>
          <LoadingButton
            color="secondary"
            onClick={createNewAction}
            loading={loading}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="contained"
          >
            <span>{update ? 'Save' : 'Create'}</span>
          </LoadingButton>
        </DialogActions>
      </Dialog>

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
            onClick={deleteRows}
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

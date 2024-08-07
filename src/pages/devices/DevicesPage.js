import {Helmet} from 'react-helmet-async';
import {filter} from 'lodash';
import React, {useEffect, useState} from 'react';
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
    FormControlLabel,
    DialogActions, Button, Dialog,
} from '@mui/material';
// table
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections
import {UserListHead, UserListToolbar} from '../../sections/@dashboard/user';
import useApiHandlerStore from "../../zustand/useApiHandlerStore";
import {formatDate} from "../../utils/formatTime";
import useMessagesAlert from "../../hooks/messages/useMessagesAlert";
import useMessagesSnackbar from "../../hooks/messages/useMessagesSnackbar";
import PROYECT_CONFIG from "../../config/config";
import useAuthStore from "../../zustand/useAuthStore";


// ----------------------------------------------------------------------
const DEVICE_URL_GET_DATA = PROYECT_CONFIG.API_CONFIG.DEVICE.ALL;
const DEVICE_URL_GET_DATA_UPDATE = PROYECT_CONFIG.API_CONFIG.DEVICE.GET;
const DEVICE_URL_DELETE_ROW = PROYECT_CONFIG.API_CONFIG.DEVICE.DELETE;
const DEVICE_URL_UPDATE_ROW = PROYECT_CONFIG.API_CONFIG.DEVICE.UPDATE;

const TABLE_HEAD = [
    {id: 'code', label: 'Device Code', alignRight: false},
    {id: 'name', label: 'Name', alignRight: false},
    {id: 'device_id', label: 'Device ID', alignRight: false},
    {id: 'user', label: 'User', alignRight: false },
    {id: 'screen', label: 'Screen', alignRight: false },
    {id: 'created_at', label: 'Create At', alignRight: false},
    {id: 'updated_at', label: 'Update At', alignRight: false},
    { id: 'actions', label: 'Actions' },
];

const NAME_PAGE = 'Devices';

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_device) => _device.code.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function DevicePage() {
    const [devices, setDevices] = useState([]);
    const [users, setUsers] = useState([]);
    const [screens, setScreens] = useState([]);
    const [filteredScreen, setFilteredScreens] = useState([]);
    const [open, setOpen] = useState(null);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('code');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openNewDialog, setOpenNewDialog] = useState(false);
    const [update, setUpdate] = useState(null);
    const [validator, setValidator] = useState({});
    const [disabledUserField, setDisabledUserField] = useState(false);


    const {currentUser} = useAuthStore((state) => state);
    const {api} = useApiHandlerStore((state) => state);
    const showMessageAlert = useMessagesAlert();
    const showMessageSnackbar = useMessagesSnackbar()

    const initialFormData = {
        name: '',
        user_id: '',
        screen_id: '',
    }
    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));

        if (name === 'user_id') {
            filterScreenByUser(value)
        }
    };

    const filterScreenByUser = (id) => {
      if (id) {
          const filtered = filter(screens, (_screen) => _screen.business.user_id === id)
          setFilteredScreens(filtered)
      } else {
          setFilteredScreens(screens)
      }
    }

    const getUsers = async () => {
        const response = await api.__get('/users', (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { getUsers() })

        if (response.data) {
            setUsers(Object.values(response.data));
        }
    };

    const getScreens = async () => {
        const response = await api.__get('/screens', (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { getScreens() })

        if (response.data) {
            setScreens(Object.values(response.data));
            if (currentUser && currentUser.user.role.tag === PROYECT_CONFIG.API_CONFIG.ROLES.ADMIN) {
                filterScreenByUser(null)
            } else {
                filterScreenByUser(currentUser.user.id)
            }
        }
    };

    const getDevices = async () => {
        const response = await api.__get(`${DEVICE_URL_GET_DATA}`, (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { getDevices() })

        if (response.data) {
            if (currentUser && currentUser.user.role.tag === PROYECT_CONFIG.API_CONFIG.ROLES.ADMIN) {
                setDevices(Object.values(response.data));
            } else {
                const filteredDevices = filter(response.data, (_device) => _device.user_id === currentUser.user.id)
                setDevices(filteredDevices);
            }
        }
    };

    const handleEditItemClick = (item) => {
        handleCloseMenu()
        if (currentUser && currentUser.user.role.tag === PROYECT_CONFIG.API_CONFIG.ROLES.ADMIN) {
            setDisabledUserField(false)
        } else {
            setDisabledUserField(true)
        }
        editAction(item.id)
    }

    const editAction = async (id) => {
        setUpdate(id)
        const response = await api.__get(`${DEVICE_URL_GET_DATA_UPDATE}${id}`,  (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { editAction(id) });

        if (response.data) {
            setFormData({
                name: response.data.name,
                user_id: response.data.user_id,
                screen_id: response.data.screen_id
            })
            filterScreenByUser(response.data.user_id)
            setOpenNewDialog(true);
        }
    }

    const createNewAction = async () => {
        const editFormData = {
            name: formData.name,
            user_id: formData.user_id,
            screen_id: formData.screen_id,
        };

        const response = await api.__update(`${DEVICE_URL_UPDATE_ROW}${update}`, editFormData, (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { createNewAction() });


        if (response) {
            if (response.success) {
                const msg = `Device updated successfully!`;
                showMessageSnackbar(msg, 'success');
                setOpenNewDialog(false);
                setUpdate(null);
                getDevices();
                setFormData(initialFormData);
            } else {
                setValidator(response.data && response.data)
            }
        }
    }
    const handleCloseNew = () => {
        setOpenNewDialog(false);
        setFormData(initialFormData);
    };

    const deleteDevices = async (ids) => {
        const data = { 'ids': ids };
        const response = await api.__delete(`${DEVICE_URL_DELETE_ROW}`, data, (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { deleteDevices(ids) })

        if (response) {
            showMessageAlert(response.message, 'success');
            getDevices();
            setSelected([]);
        }
    }

    const handleDeleteSelected = () => {
        deleteDevices(selected)
    }


    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
        setUpdate(null);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = devices.map((n) => n.id);
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

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const handleDeleteItemClick = (item) => {
        handleCloseMenu()
        deleteDevices([item.id])
    }

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - devices.length) : 0;

    const filteredDevices = applySortFilter(devices, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredDevices.length && !!filterName;

    useEffect(() => {
        getUsers()
        getScreens()
        getDevices()
    }, []);

    return (
        <>
            <Helmet>
                <title> {NAME_PAGE} | { PROYECT_CONFIG.NAME } </title>
            </Helmet>

            <Container>

                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        {NAME_PAGE}
                    </Typography>
                </Stack>

                <Card>
                    <UserListToolbar numSelected={selected.length} filterName={filterName}
                                     onFilterName={handleFilterByName} onDeleteSelect={handleDeleteSelected}/>

                    <Scrollbar>
                        <TableContainer sx={{minWidth: 800}}>
                            <Table>
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={filteredDevices.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {filteredDevices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const {id, code, name} = row;
                                        const selectedDevices = selected.indexOf(id) !== -1;
                                        const user = (users.find((n) => n.id === row.user_id))
                                        return (
                                            <TableRow hover key={id} tabIndex={-1} role="checkbox"
                                                      selected={selectedDevices}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox checked={selectedDevices}
                                                              onChange={(event) => handleClick(event, id)}/>
                                                </TableCell>

                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        <Iconify icon="mdi:cast-variant"/>
                                                        <Typography variant="subtitle2" noWrap>
                                                            {code}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left">{ name }</TableCell>

                                                <TableCell align="left">{ row.device_id && row.device_id }</TableCell>

                                                <TableCell align="left">
                                                    {
                                                        user && user.name
                                                    }
                                                </TableCell>

                                                <TableCell align="center">
                                                    {
                                                        row.screen ? row.screen.name : '------'
                                                    }
                                                </TableCell>

                                                <TableCell align="left">{formatDate(row.created_at)}</TableCell>

                                                <TableCell align="left">{formatDate(row.updated_at)}</TableCell>

                                                <TableCell align="right">
                                                    <IconButton id={id} size="large" color="inherit" onClick={handleOpenMenu}>
                                                        <Iconify icon={'eva:more-vertical-fill'}/>
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{height: 53 * emptyRows}}>
                                            <TableCell colSpan={6}/>
                                        </TableRow>
                                    )}
                                </TableBody>

                                {isNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{py: 3}}>
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
                                                        <strong>&quot;{filterName}&quot;</strong>.
                                                        <br/> Try checking for typos or using complete words.
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
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredDevices.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>
            <Dialog open={openNewDialog} onClose={handleCloseNew}>
                <DialogTitle>{'Edit'} Devices</DialogTitle>
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
                    />
                    <FormControl
                        variant="standard"
                        fullWidth
                        defaultValue={''}
                        sx={{mb: 3}}
                        disabled={disabledUserField}
                    >
                        <InputLabel id="role-select-label">Select User</InputLabel>
                        <Select
                            name="user_id"
                            labelId="user-select-label"
                            id="user-select"
                            value={formData.user_id ?? ''}
                            label="Select User"
                            onChange={handleChange}
                        >
                            {
                                users.map((item) => {
                                    return (
                                        <MenuItem key={item.id}
                                                  value={item.id}>{item.name}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                    <FormControl
                        variant="standard"
                        fullWidth
                        sx={{mb: 3}}
                        defaultValue={''}
                    >
                        <InputLabel id="role-select-label">Select Screen</InputLabel>
                        <Select
                            name="screen_id"
                            labelId="screen-select-label"
                            id="screen-select"
                            value={formData.screen_id ?? ''}
                            label="Select Screen"
                            onChange={handleChange}
                        >
                            {
                                filteredScreen.map((item) => {
                                    return (
                                        <MenuItem key={item.id}
                                                  value={item.id}>{item.name}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseNew}>Cancel</Button>
                    <Button onClick={createNewAction}>{'Save'}</Button>
                </DialogActions>
            </Dialog>
            <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleCloseMenu}
                anchorOrigin={{vertical: 'top', horizontal: 'left'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
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
                    <Iconify icon={'eva:edit-fill'} sx={{mr: 2}}/>
                    Edit
                </MenuItem>
                <MenuItem onClick={() => handleDeleteItemClick(open)} sx={{color: 'error.main'}}>
                    <Iconify icon={'eva:trash-2-outline'} sx={{mr: 2}}/>
                    Delete
                </MenuItem>
            </Popover>
        </>
    );
}

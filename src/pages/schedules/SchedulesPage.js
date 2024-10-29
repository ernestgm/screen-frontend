import {Helmet} from 'react-helmet-async';
import {filter} from 'lodash';
import React, {useEffect, useState} from 'react';
import {Centrifuge} from "centrifuge";
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
    DialogActions, Button, Dialog, Divider,
} from '@mui/material';
import {LoadingButton} from "@mui/lab";
import SaveIcon from '@mui/icons-material/Save';
import {Delete} from "@mui/icons-material";
// table
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections

import {UserListHead, UserListToolbar} from '../../sections/@dashboard/user';
import {applySortFilter, getComparator} from "../../utils/table/tableFunctions";
import useApiHandlerStore from "../../zustand/useApiHandlerStore";
import {formatDate} from "../../utils/formatTime";
import useMessagesAlert from "../../hooks/messages/useMessagesAlert";
import useMessagesSnackbar from "../../hooks/messages/useMessagesSnackbar";
import PROJECT_CONFIG from "../../config/config";
import useAuthStore from "../../zustand/useAuthStore";
import palette from "../../theme/palette";



// ----------------------------------------------------------------------
const SCHEDULES_URL_GET_DATA = PROJECT_CONFIG.API_CONFIG.SCHEDULES.ALL;
const SCHEDULES_URL_GET_DATA_UPDATE = PROJECT_CONFIG.API_CONFIG.SCHEDULES.GET;
const SCHEDULES_URL_DELETE_ROW = PROJECT_CONFIG.API_CONFIG.SCHEDULES.DELETE;
const SCHEDULES_URL_UPDATE_ROW = PROJECT_CONFIG.API_CONFIG.SCHEDULES.UPDATE;

const USERS_URL_GET_DATA = PROJECT_CONFIG.API_CONFIG.USERS.ALL;
const SCREENS_URL_GET_DATA = PROJECT_CONFIG.API_CONFIG.SCREEN.ALL;
const MARQUEES_URL_GET_DATA = PROJECT_CONFIG.API_CONFIG.MARQUEE.ALL;

const TABLE_HEAD = [
    {id: 'name', label: 'Name', alignRight: false},
    {id: 'device', label: 'Device', alignRight: false },
    {id: 'screen', label: 'Screen', alignRight: false },
    {id: 'marquee', label: 'Marquee', alignRight: false },
    {id: 'start_time', label: 'Start Time', alignRight: false },
    {id: 'end_time', label: 'End Time', alignRight: false },
    // {id: 'created_at', label: 'Create At', alignRight: false},
    {id: 'updated_at', label: 'Update At', alignRight: false},
    { id: 'actions', label: 'Actions' },
];

const NAME_PAGE = 'Schedules';

export default function SchedulesPage() {
    const [devices, setDevices] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [screens, setScreens] = useState([]);
    const [marquees, setMarquees] = useState([]);
    const [filteredScreen, setFilteredScreens] = useState([]);
    const [filteredMarquees, setFilteredMarquees] = useState([]);
    const [open, setOpen] = useState(null);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('code');
    const [filterQuery, setFilterQuery] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(PROJECT_CONFIG.TABLE_CONFIG.ROW_PER_PAGE);
    const [openNewDialog, setOpenNewDialog] = useState(false);
    const [update, setUpdate] = useState(null);
    const [validator, setValidator] = useState({});
    const [loading, setLoading] = useState(false);
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const [rowsForDelete, setRowsForDelete] = useState([]);

    const {currentUser} = useAuthStore((state) => state);
    const {api} = useApiHandlerStore((state) => state);
    const showMessageAlert = useMessagesAlert();
    const showMessageSnackbar = useMessagesSnackbar()

    const initialFormData = {
        name: '',
        device_id: '',
        screen_id: '',
        marquee_id: '',
        start_time: '',
        end_time: '',
        schedule_type: '',
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
            filterMarqueByUser(value)
        }
        // if (name === 'marquee_id') {
        //     setFormData((prevFormData) => ({
        //         ...prevFormData,
        //         "marquee_id": formData.marquee_id === "No" ? -1 : formData.marquee_id,
        //     }));
        // }
    };

    const getScreens = async () => {
        const response = await api.__get(SCREENS_URL_GET_DATA, (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { getScreens() })

        if (response !== undefined && response.data) {
            setScreens(Object.values(response.data));
            if (currentUser && currentUser.user.role.tag === PROJECT_CONFIG.API_CONFIG.ROLES.ADMIN) {
                filterScreenByUser(null)
            } else {
                filterScreenByUser(currentUser.user.id)
            }
        }
    };

    const getMarquees = async () => {
        const response = await api.__get(MARQUEES_URL_GET_DATA, (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { getScreens() })

        if (response !== undefined && response.data) {
            setMarquees(Object.values(response.data));
            if (currentUser && currentUser.user.role.tag === PROJECT_CONFIG.API_CONFIG.ROLES.ADMIN) {
                filterMarqueByUser(null)
            } else {
                filterMarqueByUser(currentUser.user.id)
            }
        }
    };

    const getDevices = async () => {
        const response = await api.__get(`${SCHEDULES_URL_GET_DATA}`, (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { getDevices() })

        if (response !== undefined && response.data) {
            if (currentUser && currentUser.user.role.tag === PROJECT_CONFIG.API_CONFIG.ROLES.ADMIN) {
                console.log(Object.values(response.data))
                setDevices(Object.values(response.data));
            } else {
                const filteredDevices = filter(response.data, (_device) => _device.user_id === currentUser.user.id)
                console.log(filteredDevices)
                setDevices(filteredDevices);
            }
        }
    };

    const filterMarqueByUser = (id) => {
        if (id) {
            const filtered = filter(marquees, (_marquee) => _marquee.business.user_id === id)
            setFilteredMarquees(filtered)
        } else {
            setFilteredMarquees(marquees)
        }
    }

    const filterScreenByUser = (id) => {
        if (id) {
            const filtered = filter(screens, (_screen) => _screen.business.user_id === id)
            setFilteredScreens(filtered)
        } else {
            setFilteredScreens(screens)
        }
    }

    const editRow = (id) => {
        editAction(id)
    }

    const handleEditItemClick = (item) => {
        handleCloseMenu()
        editRow(item.id)
    }

    const editAction = async (id) => {
        setUpdate(id)
        const response = await api.__get(`${SCHEDULES_URL_GET_DATA_UPDATE}${id}`,  (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { editAction(id) });

        if (response !== undefined && response.data) {
            setFormData({
                name: '',
                device_id: '',
                screen_id: '',
                marquee_id: '',
                start_time: '',
                end_time: '',
                schedule_type: '',
                // name: response.data.name,
                // user_id: response.data.user_id,
                // screen_id: response.data.screen_id,
                // marquee_id: response.data.marquee_id ? response.data.marquee_id : 0
            })
            filterScreenByUser(response.data.user_id)
            filterMarqueByUser(response.data.user_id)
            setOpenNewDialog(true);
        }
    }

    const createNewAction = async () => {
        const editFormData = {
            name: '',
            device_id: '',
            screen_id: '',
            marquee_id: '',
            start_time: '',
            end_time: '',
            schedule_type: '',
        };

        const response = await api.__update(`${SCHEDULES_URL_UPDATE_ROW}${update}`, editFormData, (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { createNewAction() }, ( isLoading ) => { setLoading(isLoading) });


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

    const deleteDevices = async () => {
        setLoading(true)
        const data = { 'ids': rowsForDelete };
        const response = await api.__delete(`${SCHEDULES_URL_DELETE_ROW}`, data, (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { deleteDevices() })

        if (response) {
            showMessageAlert(response.message, 'success');
            getDevices();
            setSelected([]);
        }
        setLoading(false)
        setOpenConfirmDelete(false)
    }

    const handleDeleteSelected = () => {
        setRowsForDelete(selected)
        setOpenConfirmDelete(true)
    }

    const handleEditSelected = () => {
        if (selected.length === 1) {
            editRow(selected[0])
        }
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

    const handleFilterByQuery = (event) => {
        setPage(0);
        setFilterQuery(event.target.value);
    };

    const handleDeleteItemClick = (item) => {
        handleCloseMenu()
        setRowsForDelete([item.id])
        setOpenConfirmDelete(true)
    }

    const handleCloseConfirmDelete = ()=> {
        setOpenConfirmDelete(false)
        setRowsForDelete([])
    }

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - devices.length) : 0;

    const filteredDevices = applySortFilter({
        array: devices,
        comparator: getComparator({_order: order, _orderBy: orderBy}),
        query: filterQuery
    });

    const isNotFound = !filteredDevices.length && !!filterQuery;



    useEffect(() => {
        getScreens()
        getMarquees()
        getDevices()
    }, []);

    return (
        <>
            <Helmet>
                <title> {NAME_PAGE} | { PROJECT_CONFIG.NAME } </title>
            </Helmet>

            <Container>
                <Stack
                    direction="row"
                    divider={<Divider orientation="vertical" flexItem />}
                    spacing={2}
                    sx={{padding: "15px 0"}}
                >
                    <Iconify width="35px" icon="eva:clock-outline"/>
                    <Typography variant="h4" gutterBottom>
                        {NAME_PAGE}
                    </Typography>
                </Stack>

                <Card>
                    <UserListToolbar
                        numSelected={selected.length}
                        filterQuery={filterQuery}
                        onFilterQuery={handleFilterByQuery}
                        onDeleteSelect={handleDeleteSelected}
                        onEditSelect={handleEditSelected}
                        onlyEdit
                    />

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
                                        const {id, name} = row;
                                        const selectedDevices = selected.indexOf(id) !== -1;

                                        return (
                                            <TableRow hover key={id} tabIndex={-1} role="checkbox"
                                                      selected={selectedDevices}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox checked={selectedDevices}
                                                              onChange={(event) => handleClick(event, id)}/>
                                                </TableCell>

                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        <Typography variant="subtitle2" noWrap>
                                                            {name}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left">{ name }</TableCell>

                                                <TableCell align="center">
                                                    {
                                                        row.screen ? row.screen.name : '------'
                                                    }
                                                </TableCell>

                                                <TableCell align="center">
                                                    {
                                                        row.marquee ? row.marquee.name : 'No'
                                                    }
                                                </TableCell>

                                                <TableCell align="left">{row.device_id}</TableCell>

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
                                                        <strong>&quot;{filterQuery}&quot;</strong>.
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
                        rowsPerPageOptions={PROJECT_CONFIG.TABLE_CONFIG.ROWS_PER_PAGE_OPTIONS}
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
                <DialogTitle>{'Edit'} {NAME_PAGE}</DialogTitle>
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
                    <FormControl
                        variant="standard"
                        fullWidth
                        sx={{mb: 3}}
                        defaultValue={''}
                    >
                        <InputLabel id="marquee-select-label">Select Marquee</InputLabel>
                        <Select
                            name="marquee_id"
                            labelId="marquee-select-label"
                            id="marquee-select"
                            value={formData.marquee_id ?? ''}
                            label="Select Marquee"
                            onChange={handleChange}
                        >
                            <MenuItem key={0} value={0}>{'No'}</MenuItem>
                            {
                                filteredMarquees.map((item) => {
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
                    <LoadingButton
                        color="secondary"
                        onClick={createNewAction}
                        loading={loading}
                        loadingPosition="start"
                        startIcon={<SaveIcon />}
                        variant="contained"
                    >
                        <span>{ 'Save' }</span>
                    </LoadingButton>
                </DialogActions>
            </Dialog>

            <Dialog open={openConfirmDelete} onClose={handleCloseConfirmDelete}>
                <DialogTitle>
                    Delete
                </DialogTitle>
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

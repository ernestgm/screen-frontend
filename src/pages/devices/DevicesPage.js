import {useNavigate} from "react-router-dom";
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


// ----------------------------------------------------------------------

const TABLE_HEAD = [
    {id: 'code', label: 'Device Code', alignRight: false},
    {id: 'device_id', label: 'Device ID', alignRight: false},
    {id: 'user', label: 'User', alignRight: false },
    {id: 'created_at', label: 'Create At', alignRight: false},
    {id: 'updated_at', label: 'Update At', alignRight: false},
    { id: 'actions', label: 'Actions' },
];

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

    const [open, setOpen] = useState(null);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('code');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);


    const {api} = useApiHandlerStore((state) => state);
    const showMessageAlert = useMessagesAlert();
    const showMessageSnackbar = useMessagesSnackbar()

    const getUsers = async () => {
        const response = await api.__get('/users', (msg) => {
            showMessageSnackbar(msg, 'error');
        })

        if (response) {
            setUsers(Object.values(response.data));
        }
    };

    const getDevices = async () => {
        const response = await api.__get('/devices', (msg) => {
            showMessageSnackbar(msg, 'error');
        })

        if (response) {
            setDevices(Object.values(response.data));
        }
    };

    const deleteDevices = async (ids) => {
        const data = { 'ids': ids };
        const response = await api.__delete('/devices', data, (msg) => {
            showMessageSnackbar(msg, 'error');
        })

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
        getDevices()
    }, []);

    return (
        <>
            <Helmet>
                <title> User | { PROYECT_CONFIG.NAME } </title>
            </Helmet>

            <Container>

                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        User
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
                                        const {id, code} = row;
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

                                                <TableCell align="left">{row.device_id}</TableCell>

                                                <TableCell align="left">
                                                    {
                                                        user && user.name
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
                <MenuItem onClick={() => handleDeleteItemClick(open)} sx={{color: 'error.main'}}>
                    <Iconify icon={'eva:trash-2-outline'} sx={{mr: 2}}/>
                    Delete
                </MenuItem>
            </Popover>
        </>
    );
}
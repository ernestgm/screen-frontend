import {Helmet} from 'react-helmet-async';
import {filter} from 'lodash';
import React, {useEffect, useState} from 'react';
// @mui
import {
    Card,
    Table,
    Stack,
    Paper,
    Avatar,
    Button,
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
    TablePagination, DialogTitle, DialogContent, DialogActions, Dialog, TextField, Divider,
} from '@mui/material';
import {Delete, Phonelink} from "@mui/icons-material";
import {LoadingButton} from "@mui/lab";
// table
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections
import {UserListHead, UserListToolbar} from '../../sections/@dashboard/user';
import useApiHandlerStore from "../../zustand/useApiHandlerStore";
import {formatDate} from "../../utils/formatTime";
import useMessagesAlert from "../../hooks/messages/useMessagesAlert";
import useMessagesSnackbar from "../../hooks/messages/useMessagesSnackbar";
import PROJECT_CONFIG from "../../config/config";
import palette from "../../theme/palette";
import useNavigateTo from "../../hooks/navigateTo";
import {applySortFilter, getComparator} from "../../utils/table/tableFunctions";



// ----------------------------------------------------------------------
const NAME_PAGE = "User";

const TABLE_HEAD = [
    {id: 'name', label: 'Name', alignRight: false},
    {id: 'email', label: 'Email', alignRight: false},
    {id: 'role', label: 'Role', alignRight: false },
    {id: 'created_at', label: 'Create At', alignRight: false},
    {id: 'updated_at', label: 'Update At', alignRight: false},
    { id: 'actions', label: 'Actions' },
];

const LINK_DEVICE_URL = PROJECT_CONFIG.API_CONFIG.USERS.ACTIVATE;
// ----------------------------------------------------------------------

export default function UserPage() {
    const {navigateTo} = useNavigateTo();
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(null);
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [rowsForDelete, setRowsForDelete] = useState([]);
    const [loading, setLoading] = useState(false);
    const [orderBy, setOrderBy] = useState('name');
    const [filterQuery, setFilterQuery] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(PROJECT_CONFIG.TABLE_CONFIG.ROW_PER_PAGE);
    const showSnackbarMessage = useMessagesSnackbar();
    const [linkUserId, setLinkUserId] = useState(null);
    const [openLinkDeviceDialog, setOpenLinkDeviceDialog] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
    });


    const {api} = useApiHandlerStore((state) => state);
    const showMessageAlert = useMessagesAlert();
    const showMessageSnackbar = useMessagesSnackbar()

    const getUsers = async () => {
        const response = await api.__get(
            '/users',
            (msg) => {
            showMessageSnackbar(msg, 'error');
            },
            () => {
                getUsers()
            }
        )

        if (response !== undefined && response.data) {
            setUsers(Object.values(response.data));
        }
    };

    const deleteUsers = async () => {
        setLoading(true)
        const data = { 'ids': rowsForDelete };
        const response = await api.__delete('/users', data, (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { deleteUsers() })

        if (response) {
            showMessageAlert(response.message, 'success');
            getUsers();
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
            navigateTo(`/dashboard/user/edit/${selected[0]}`)
        }
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
            const newSelecteds = users.map((n) => n.id);
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

    const newUserHandleClick = () => {
        navigateTo('/dashboard/user/create');
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

    const filteredUsers = applySortFilter({
            array: users,
            comparator: getComparator({_order: order, _orderBy: orderBy}),
            query: filterQuery
    })

    const isNotFound = !filteredUsers.length && !!filterQuery;

    const handleEditItemClick = (item) => {
        handleCloseMenu()
        navigateTo(`/dashboard/user/edit/${item.id}`)
    }

    const handleDeleteItemClick = (item) => {
        handleCloseMenu()
        setRowsForDelete([item.id])
        setOpenConfirmDelete(true)
    }

    const handleCloseConfirmDelete = ()=> {
        setOpenConfirmDelete(false)
        setRowsForDelete([])
    }

    const handleCloseLinkDeviceDialog = ()=> {
        setFormData({
            code: '',
        });
        setOpenLinkDeviceDialog(false)
        setLinkUserId(null)
    }

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleLinkItemClick = async (item) => {
        handleCloseMenu()
        setLinkUserId(item.id)
        setOpenLinkDeviceDialog(true)
    }
    const handleSubmitLinkDevice = async () => {
        const response = await api.__post(`${LINK_DEVICE_URL}?user_id=${linkUserId}`, formData, (msg) => {
                showSnackbarMessage(msg, 'error');
            }, () => {
                handleSubmitLinkDevice()
            },
            (isLoading) => {
                setLoading(isLoading)
            });

        if (response) {
            if (response.success) {
                const msg = `The device has been linked!`;
                showSnackbarMessage(msg, 'success');
                setFormData({
                    code: '',
                });
                setOpenLinkDeviceDialog(false)
            } else {
                setFormData({
                    code: '',
                });
                showSnackbarMessage(response.message, 'error');
            }
        }
    }

    useEffect(() => {
        getUsers()
    }, []);

    return (
        <>
            <Helmet>
                <title> User | { PROJECT_CONFIG.NAME } </title>
            </Helmet>

            <Container>

                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Stack
                      direction="row"
                      divider={<Divider orientation="vertical" flexItem />}
                      spacing={2}
                      sx={{padding: "15px 0"}}
                    >
                        <Iconify width="35px" icon="material-symbols:supervised-user-circle"/>
                        <Typography variant="h4" gutterBottom>
                            {NAME_PAGE}
                        </Typography>
                    </Stack>
                    <Button onClick={newUserHandleClick} variant="contained"
                            startIcon={<Iconify icon="eva:plus-fill"/>}>
                        New User
                    </Button>
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
                                    rowCount={filteredUsers.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const {id, name, lastname, email, role} = row;
                                        const selectedUser = selected.indexOf(id) !== -1;
                                        const bgColorCell = row.enabled === 1 ? palette.success.lighter : palette.error.lighter
                                        return (
                                            <TableRow hover key={id} tabIndex={-1} role="checkbox"
                                                      selected={selectedUser} sx={{ background: bgColorCell }}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox checked={selectedUser}
                                                              onChange={(event) => handleClick(event, id)}/>
                                                </TableCell>

                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        <Avatar alt={name} src='/assets/images/avatars/avatar_1.jpg'/>
                                                        <Typography variant="subtitle2" noWrap>
                                                            {name} {lastname}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left">{email}</TableCell>

                                                <TableCell align="left">{role && role.name}</TableCell>

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
                        count={filteredUsers.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>

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
                        onClick={deleteUsers}
                        loading={loading}
                        loadingPosition="start"
                        startIcon={<Delete />}
                        variant="contained"
                    >
                        <span>OK</span>
                    </LoadingButton>
                </DialogActions>
            </Dialog>

            <Dialog open={openLinkDeviceDialog} onClose={handleCloseLinkDeviceDialog}>
                <DialogTitle>
                    Link Device
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} justifyContent="space-between" sx={{m: 2}}>
                        <Typography variant="h6" gutterBottom>
                            Use the code generated by Player App to finish login.
                        </Typography>
                        <TextField
                            name="code"
                            value={formData.code ?? ''}
                            onChange={handleChange}
                            label="Activate Code"
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseLinkDeviceDialog}>Cancel</Button>
                    <LoadingButton
                        color="secondary"
                        onClick={handleSubmitLinkDevice}
                        loading={loading}
                        loadingPosition="start"
                        startIcon={<Phonelink />}
                        variant="contained"
                    >
                        <span>Link Device</span>
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
                <MenuItem onClick={() => handleLinkItemClick(open)}>
                    <Iconify icon={'ic:baseline-phonelink'} sx={{mr: 2}}/>
                    Link Device
                </MenuItem>

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

import {Helmet} from 'react-helmet-async';
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
    TablePagination, Collapse, Alert, Box, DialogTitle, DialogContent, DialogActions, Dialog,
} from '@mui/material';
import {LoadingButton} from "@mui/lab";
import {Delete} from "@mui/icons-material";
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
import {applySortFilter, getComparator} from "../../utils/table/tableFunctions";
import useNavigateTo from "../../hooks/navigateTo";
import useAuthStore from "../../zustand/useAuthStore";
import AreaModalDialog from "./table/AreaModalDialog";



// ----------------------------------------------------------------------

const TABLE_HEAD = [
    {id: 'name', label: 'Name', alignRight: false},
    {id: 'description', label: 'Description', alignRight: false},
    {id: 'created_at', label: 'Create At', alignRight: false},
    {id: 'updated_at', label: 'Update At', alignRight: false},
    { id: 'actions', label: 'Actions' },
];

const PAGE_NAME = 'Business';
const URL_GET_DATA = PROJECT_CONFIG.API_CONFIG.BUSINESS.ALL;
const URL_DELETE_ROW = PROJECT_CONFIG.API_CONFIG.BUSINESS.DELETE;
const PATH_EDIT_ROW = `/dashboard/business/edit/`;
const PATH_GO_AREAS_ROW = `/dashboard/business/areas/`;
const PATH_NEW_ROW = '/dashboard/business/create';
const PATH_DETAILS_ROW = '/dashboard/business/details/';
const ADMIN_TAG = PROJECT_CONFIG.API_CONFIG.ROLES.ADMIN

// ----------------------------------------------------------------------

export default function UserPage() {
    const { navigateTo } = useNavigateTo();
    const [dataTable, setDataTable] = useState([]);
    const [open, setOpen] = useState(null);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterQuery, setFilterQuery] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(PROJECT_CONFIG.TABLE_CONFIG.ROW_PER_PAGE);
    const [openNewAreaDialog, setOpenNewAreaDialog] = useState(false);
    const [newAreaBussinesId, setNewAreaBussinesId] = useState(null);
    const initialFormData = {
        name: '',
        business_id: ''
    }
    const [formData, setFormData] = useState(initialFormData);

    const { currentUser } = useAuthStore((state) => state);
    const {api} = useApiHandlerStore((state) => state);
    const showMessageAlert = useMessagesAlert();
    const showMessageSnackbar = useMessagesSnackbar()
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const [rowsForDelete, setRowsForDelete] = useState([]);
    const [loading, setLoading] = useState(false);

    const getDataTable = async () => {
        const params = (currentUser && currentUser.user.role.tag !== ADMIN_TAG) ? `?userId=${currentUser.user.id}` : ''
        const response = await api.__get(`${URL_GET_DATA}${params}`, (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { getDataTable() })

        if (response !== undefined && response.data) {
            setDataTable(Object.values(response.data));
        }
    };

    const deleteRows = async () => {
        setLoading(true)
        const data = { 'ids': rowsForDelete };
        const response = await api.__delete(URL_DELETE_ROW, data, (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { deleteRows() })

        if (response) {
            showMessageAlert(response.message, 'success');
            getDataTable();
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
            navigateTo(`${PATH_EDIT_ROW}${selected[0]}`)
        }
    }

    const handleDetailsSelected = () => {
        if (selected.length === 1) {
            navigateTo(`${PATH_DETAILS_ROW}${selected[0]}`)
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

    const newRowHandleClick = () => {
        navigateTo(PATH_NEW_ROW);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataTable.length) : 0;

    const filteredDataTable = applySortFilter({array: dataTable, comparator: getComparator({_order: order, _orderBy: orderBy}), query: filterQuery});

    const isNotFound = !filteredDataTable.length && !!filterQuery;

    const handleEditItemClick = (item) => {
        handleCloseMenu()
        navigateTo(`${PATH_EDIT_ROW}${item.id}`)
    }

    const handleDetailsItemClick = (item) => {
        handleCloseMenu()
        navigateTo(`${PATH_DETAILS_ROW}${item.id}`)
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

    const handleCreateAreaClick = (item) => {
        handleCloseMenu()
        setNewAreaBussinesId(item.id)
        setOpenNewAreaDialog(true)
    }

    const handleCloseCreateAreaDialog = () => {
        handleCloseMenu()
        setOpenNewAreaDialog(false)
    }

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
            business_id: newAreaBussinesId
        }));
    };

    useEffect(() => {
        getDataTable()
    }, []);

    const handleViewAreasClick = (item) => {
        handleCloseMenu()
        navigateTo(`${PATH_GO_AREAS_ROW}${item.id}`)
    }

    return (
        <>
            <Helmet>
                <title> Business | { PROJECT_CONFIG.NAME } </title>
            </Helmet>

            <Container>

                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        {PAGE_NAME}
                    </Typography>
                    <Button onClick={newRowHandleClick} variant="contained"
                            startIcon={<Iconify icon="eva:plus-fill"/>}>
                        New {PAGE_NAME}
                    </Button>
                </Stack>

                <Card>
                    <UserListToolbar
                        numSelected={selected.length}
                        filterQuery={filterQuery}
                        onFilterQuery={handleFilterByQuery}
                        onDeleteSelect={handleDeleteSelected}
                        onDetailsSelect={handleDetailsSelected}
                        onEditSelect={handleEditSelected}
                    />

                    <Scrollbar>
                        <TableContainer sx={{minWidth: 800}}>
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
                                        const {id, name, description} = row;
                                        const selectedRow = selected.indexOf(id) !== -1;
                                        return (
                                            <TableRow hover key={id} tabIndex={-1} role="checkbox"
                                                      selected={selectedRow}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox checked={selectedRow}
                                                              onChange={(event) => handleClick(event, id)}/>
                                                </TableCell>

                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        <Box component="img" alt={name} src='/assets/images/covers/cover_5.jpg'
                                                             sx={{width: 48, height: 48, borderRadius: 1.5, flexShrink: 0}}/>
                                                        <Typography variant="subtitle2" noWrap>
                                                            {name}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left">{description}</TableCell>

                                                <TableCell align="left">{formatDate(row.created_at)}</TableCell>

                                                <TableCell align="left">{formatDate(row.updated_at)}</TableCell>

                                                <TableCell align="center">
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
                        count={filteredDataTable.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>
            <AreaModalDialog
                areaFormData={formData}
                openDialog={openNewAreaDialog}
                handleClose={handleCloseCreateAreaDialog}
                handleFormChange={handleChange}
            />

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
                <MenuItem onClick={() => handleDetailsItemClick(open)}>
                    <Iconify icon={'tabler:list-details'} sx={{mr: 2}}/>
                    Details
                </MenuItem>

                <MenuItem onClick={() => handleViewAreasClick(open)}>
                    <Iconify icon="fluent-mdl2:build-queue" sx={{mr: 2}}/>
                    View Areas
                </MenuItem>

                <MenuItem onClick={() => handleCreateAreaClick(open)}>
                    <Iconify icon="fluent-mdl2:build-queue" sx={{mr: 2}}/>
                    Create Area
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

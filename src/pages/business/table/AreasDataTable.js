import React, {useEffect, useState} from "react";
import {
    Avatar, Button, Card, Dialog,
    Checkbox, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, MenuItem, Paper, Popover,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer, TablePagination,
    TableRow, TextField,
    Typography, Box
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {Delete} from "@mui/icons-material";
import PROJECT_CONFIG from "../../../config/config";
import {UserListHead, UserListToolbar} from "../../../sections/@dashboard/user";
import Scrollbar from "../../../components/scrollbar/Scrollbar";
import {formatDate} from "../../../utils/formatTime";
import Iconify from "../../../components/iconify";
import useApiHandlerStore from "../../../zustand/useApiHandlerStore";
import useMessagesAlert from "../../../hooks/messages/useMessagesAlert";
import useMessagesSnackbar from "../../../hooks/messages/useMessagesSnackbar";
import {applySortFilter, getComparator} from "../../../utils/table/tableFunctions";
import useNavigateTo from "../../../hooks/navigateTo";
import AreaModalDialog from "./AreaModalDialog";
import BackButton from "../../../sections/@dashboard/app/AppBackButton";


// Area Table

const AREA_URL_GET_DATA = PROJECT_CONFIG.API_CONFIG.AREA.ALL;
const AREA_URL_GET_DATA_UPDATE = PROJECT_CONFIG.API_CONFIG.AREA.GET;
const AREA_URL_DELETE_ROW = PROJECT_CONFIG.API_CONFIG.AREA.DELETE;
const AREA_URL_CREATE_ROW = PROJECT_CONFIG.API_CONFIG.AREA.CREATE;
const AREA_URL_UPDATE_ROW = PROJECT_CONFIG.API_CONFIG.AREA.UPDATE;
const ROUTE_DETAILS_ROW = '/dashboard/area/details/';
const URL_TABLES_PAGE = '/dashboard/business';

const AREA_TABLE_HEAD = [
    {id: 'name', label: 'Name', alignRight: false},
    {id: 'created_at', label: 'Create At', alignRight: false},
    {id: 'updated_at', label: 'Update At', alignRight: false},
    {id: 'actions', label: 'Actions'},
];

export default function AreasDataTable({business}) {
    const {navigateTo} = useNavigateTo();
    const [dataTable, setDataTable] = useState([]);
    const [open, setOpen] = useState(false);
    const [openNewAreaDialog, setOpenNewAreaDialog] = useState(false);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(PROJECT_CONFIG.TABLE_CONFIG.ROW_PER_PAGE);
    const {api} = useApiHandlerStore((state) => state);
    const showMessageAlert = useMessagesAlert();
    const showMessageSnackbar = useMessagesSnackbar();
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const [rowsForDelete, setRowsForDelete] = useState([]);
    const [loading, setLoading] = useState(false);

    const getAreas = async () => {
        const response = await api.__get(`${AREA_URL_GET_DATA}?business_id=${business}`, (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { getAreas() })

        if (response !== undefined && response.data) {
            setDataTable(Object.values(response.data));
        }
    };

    const deleteRows = async () => {
        setLoading(true)
        const data = {'ids': rowsForDelete};
        const response = await api.__delete(AREA_URL_DELETE_ROW, data, (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { deleteRows() })

        if (response) {
            showMessageAlert(response.message, 'success');
            getAreas();
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
            editAreaAction(selected[0])
        }
    }

    const handleDetailsSelected = () => {
        if (selected.length === 1) {
            navigateTo(`${ROUTE_DETAILS_ROW}${selected[0]}`)
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

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataTable.length) : 0;

    const filteredDataTable = applySortFilter({
        array: dataTable,
        comparator: getComparator({_order: order, _orderBy: orderBy}),
        query: filterName
    });

    const isNotFound = !filteredDataTable.length && !!filterName;

    const handleEditItemClick = (item) => {
        handleCloseMenu()
        editAreaAction(item.id)
    }

    const handleDetailsItemClick = (item) => {
        handleCloseMenu()
        navigateTo(`${ROUTE_DETAILS_ROW}${item.id}`)
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

    const initialFormData = {
        name: '',
        business_id: business
    }
    const [formData, setFormData] = useState(initialFormData);

    const [update, setUpdate] = useState(null);

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleClickNewArea = () => {
        setOpenNewAreaDialog(true);
    };

    const handleCloseNewArea = (updateTable) => {
        setOpenNewAreaDialog(false);
        setUpdate(null);
        setFormData(initialFormData);

        if (updateTable) {
            getAreas()
        }
    };

    const editAreaAction = async (id) => {
        setUpdate(id);
        const response = await api.__get(`${AREA_URL_GET_DATA_UPDATE}${id}`, (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { editAreaAction(id) });

        if (response !== undefined && response.data) {
            setFormData({
                name: response.data.name,
                business_id: business,
            });
            setOpenNewAreaDialog(true);
        }
    }

    useEffect(() => {
        getAreas()
    }, []);

    return (
        <>
            <Stack direction="row" alignItems="left" justifyContent="space-between" mb={5}>
                { business ? (
                    <>
                        <Stack>
                            <BackButton path={`${URL_TABLES_PAGE}`}/>
                        </Stack>
                    </>
                ) : ( <></> )}
                <Button variant="outlined" onClick={handleClickNewArea}
                        startIcon={<Iconify icon="eva:plus-fill"/>}>
                    New Area
                </Button>
            </Stack>
            <Card>
                <UserListToolbar
                    numSelected={selected.length}
                    filterName={filterName}
                    onFilterName={handleFilterByName}
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
                                headLabel={AREA_TABLE_HEAD}
                                rowCount={filteredDataTable.length}
                                numSelected={selected.length}
                                onRequestSort={handleRequestSort}
                                onSelectAllClick={handleSelectAllClick}
                            />
                            <TableBody>
                                {filteredDataTable.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    const {id, name} = row;
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
                                                    <Iconify icon="fluent-mdl2:build-queue"/>
                                                    <Typography variant="subtitle2" noWrap>
                                                        {name}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>

                                            <TableCell align="left">{formatDate(row.created_at)}</TableCell>

                                            <TableCell align="left">{formatDate(row.updated_at)}</TableCell>

                                            <TableCell align="center">
                                                <IconButton id={id} size="large" color="inherit"
                                                            onClick={handleOpenMenu}>
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
                    rowsPerPageOptions={PROJECT_CONFIG.TABLE_CONFIG.ROWS_PER_PAGE_OPTIONS}
                    component="div"
                    count={filteredDataTable.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
            <AreaModalDialog
                updateAreaId={update}
                areaFormData={formData}
                openDialog={openNewAreaDialog}
                bussinesId={business}
                handleClose={handleCloseNewArea}
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
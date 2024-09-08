import React, {useEffect, useState} from "react";
import {
    Button, Card, Dialog,
    Checkbox, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Paper, Popover,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer, TablePagination,
    TableRow, TextField,
    Typography, FormControlLabel
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import SaveIcon from '@mui/icons-material/Save';
import PROJECT_CONFIG from "../../config/config";
import useNavigateTo from "../../hooks/navigateTo";
import useApiHandlerStore from "../../zustand/useApiHandlerStore";
import useMessagesAlert from "../../hooks/messages/useMessagesAlert";
import useMessagesSnackbar from "../../hooks/messages/useMessagesSnackbar";
import {applySortFilter, getComparator} from "../../utils/table/tableFunctions";
import Iconify from "../../components/iconify";
import {UserListHead, UserListToolbar} from "../../sections/@dashboard/user";
import Scrollbar from "../../components/scrollbar";
import {formatDate} from "../../utils/formatTime";
import palette from "../../theme/palette";


// Area Table

const AD_URL_GET_DATA = PROJECT_CONFIG.API_CONFIG.AD.ALL;
const AD_URL_GET_DATA_UPDATE = PROJECT_CONFIG.API_CONFIG.AD.GET;
const AD_URL_DELETE_ROW = PROJECT_CONFIG.API_CONFIG.AD.DELETE;
const AD_URL_CREATE_ROW = PROJECT_CONFIG.API_CONFIG.AD.CREATE;
const AD_URL_UPDATE_ROW = PROJECT_CONFIG.API_CONFIG.AD.UPDATE;

const AREA_TABLE_HEAD = [
    {id: 'message', label: 'Message', alignRight: false},
    {id: 'created_at', label: 'Create At', alignRight: false},
    {id: 'updated_at', label: 'Update At', alignRight: false},
    {id: 'actions', label: 'Actions'},
];

export default function AdDataTable({ marquee }) {
    const {navigateTo} = useNavigateTo();
    const [dataTable, setDataTable] = useState([]);
    const [open, setOpen] = useState(false);
    const [openNewAdDialog, setOpenNewAdDialog] = useState(false);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(PROJECT_CONFIG.TABLE_CONFIG.ROW_PER_PAGE);
    const {api} = useApiHandlerStore((state) => state);
    const showMessageAlert = useMessagesAlert();
    const showMessageSnackbar = useMessagesSnackbar();
    const [loading, setLoading] = useState(false);

    const getAds = async () => {
        const response = await api.__get(`${AD_URL_GET_DATA}?marquee_id=${marquee}`, (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { getAds() })

        if (response !== undefined && response.data) {
            setDataTable(Object.values(response.data));
        }
    };

    const deleteRows = async (ids) => {
        const data = {'ids': ids};
        const response = await api.__delete(AD_URL_DELETE_ROW, data, (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { deleteRows(ids) })

        if (response) {
            showMessageAlert(response.message, 'success');
            getAds();
            setSelected([]);
        }
    }

    const handleDeleteSelected = () => {
        deleteRows(selected)
    }

    const handleEditSelected = () => {
        if (selected.length === 1) {
            editAdAction(selected[0])
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
        editAdAction(item.id)
    }

    const handleDeleteItemClick = (item) => {
        handleCloseMenu()
        deleteRows([item.id])
    }

    const [validator, setValidator] = useState({});
    const initialFormData = {
        message: '',
        marquee_id: marquee,
        enabled: 1
    }
    const [formData, setFormData] = useState(initialFormData);

    const [update, setUpdate] = useState(null);

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));

        if (name === "enabled") {
            setFormData((prevFormData) => ({
                ...prevFormData,
                "enabled": formData.enabled === 0 ? 1 : 0,
            }));
        }
    };

    const handleClickNewAd = () => {
        setOpenNewAdDialog(true);
    };

    const handleCloseNewAd = (updateTable) => {
        setOpenNewAdDialog(false);
        setUpdate(null);
        setFormData(initialFormData);
    };

    const editAdAction = async (id) => {
        setUpdate(id);
        const response = await api.__get(`${AD_URL_GET_DATA_UPDATE}${id}`, (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { editAdAction(id) });

        if (response !== undefined && response.data) {
            setFormData({
                message: response.data.message,
                marquee_id: marquee,
                enabled: response.data.enabled,
            });
            setOpenNewAdDialog(true);
        }
    }

    const createNewAction = async () => {
        let response;
        const editFormData = {};

        if (update) {
            editFormData.message = formData.message
            editFormData.marquee_id = formData.marquee_id
            editFormData.enabled = formData.enabled

            response = await api.__update(`${AD_URL_UPDATE_ROW}${update}`, editFormData, (msg) => {
                showMessageSnackbar(msg, 'error');
            }, () => { createNewAction() }, ( isLoading ) => { setLoading(isLoading) });
        } else {
            response = await api.__post(AD_URL_CREATE_ROW, formData, (msg) => {
                showMessageSnackbar(msg, 'error');
            }, () => { createNewAction() }, ( isLoading ) => { setLoading(isLoading) });
        }

        if (response) {
            if (response.success) {
                const msg = update ? `Ad updated successfully!` : `Ad added successfully!`;
                showMessageSnackbar(msg, 'success');
                setOpenNewAdDialog(false);
                getAds();
                setUpdate(null);
                setFormData(initialFormData);
                setValidator([]);
            } else {
                setValidator(response.data && response.data)
            }
        }
    }

    useEffect(() => {
        getAds()
    }, []);

    return (
        <>
            <Stack direction="row" alignItems="left" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Message List
                </Typography>
                <Button variant="outlined" onClick={handleClickNewAd}
                        startIcon={<Iconify icon="eva:plus-fill"/>}>
                    New Message
                </Button>
            </Stack>

            <Card>
                <UserListToolbar
                    numSelected={selected.length}
                    filterName={filterName}
                    onFilterName={handleFilterByName}
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
                                headLabel={AREA_TABLE_HEAD}
                                rowCount={filteredDataTable.length}
                                numSelected={selected.length}
                                onRequestSort={handleRequestSort}
                                onSelectAllClick={handleSelectAllClick}
                            />
                            <TableBody>
                                {filteredDataTable.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    const {id, message, enabled} = row;
                                    const selectedRow = selected.indexOf(id) !== -1;
                                    const bgColorCell = enabled === 1 ? palette.success.lighter : palette.error.lighter
                                    return (
                                        <TableRow hover key={id} tabIndex={-1} role="checkbox"
                                                  selected={selectedRow} sx={{ background: bgColorCell }}>
                                            <TableCell padding="checkbox">
                                                <Checkbox checked={selectedRow}
                                                          onChange={(event) => handleClick(event, id)}/>
                                            </TableCell>

                                            <TableCell component="th" scope="row" padding="none">
                                                <Stack direction="row" alignItems="center" spacing={2}>
                                                    <Iconify icon="fluent-mdl2:build-queue"/>
                                                    <Typography variant="subtitle2" noWrap>
                                                        {message}
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
            <Dialog open={openNewAdDialog} onClose={handleCloseNewAd}>
                <DialogTitle>{update ? 'Edit' : 'Create a new'} Message</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="message"
                        label="Message"
                        value={formData.message ?? ''}
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={handleChange}
                        error={validator.message && true}
                        helperText={validator.message}
                    />
                    <FormControlLabel
                        control={<Checkbox name="enabled" checked={formData.enabled === 1} onChange={ handleChange } />}
                        label="Enabled"
                        sx={{ flexGrow: 1, m: 0 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseNewAd}>Cancel</Button>
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
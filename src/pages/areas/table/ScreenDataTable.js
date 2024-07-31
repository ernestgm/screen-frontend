import React, {useEffect, useState} from "react";
import {
    Button, Card, Dialog,
    Checkbox, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, MenuItem, Paper, Popover,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer, TablePagination,
    TableRow, TextField,
    Typography, InputLabel, Select, FormControl, FormControlLabel
} from "@mui/material";
import {filter} from "lodash";
import PROYECT_CONFIG from "../../../config/config";
import {UserListHead, UserListToolbar} from "../../../sections/@dashboard/user";
import Scrollbar from "../../../components/scrollbar/Scrollbar";
import {formatDate} from "../../../utils/formatTime";
import Iconify from "../../../components/iconify";
import useApiHandlerStore from "../../../zustand/useApiHandlerStore";
import useMessagesAlert from "../../../hooks/messages/useMessagesAlert";
import useMessagesSnackbar from "../../../hooks/messages/useMessagesSnackbar";
import {applySortFilter, getComparator} from "../../../utils/table/tableFunctions";
import palette from "../../../theme/palette";
import useNavigateTo from "../../../hooks/navigateTo";
import useAuthStore from "../../../zustand/useAuthStore";


const AREA_URL_GET_DATA = PROYECT_CONFIG.API_CONFIG.AREA.ALL;
const SCREEN_URL_GET_DATA = PROYECT_CONFIG.API_CONFIG.SCREEN.ALL;
const SCREEN_URL_GET_DATA_UPDATE = PROYECT_CONFIG.API_CONFIG.SCREEN.GET;
const SCREEN_URL_DELETE_ROW = PROYECT_CONFIG.API_CONFIG.SCREEN.DELETE;
const SCREEN_URL_CREATE_ROW = PROYECT_CONFIG.API_CONFIG.SCREEN.CREATE;
const SCREEN_URL_UPDATE_ROW = PROYECT_CONFIG.API_CONFIG.SCREEN.UPDATE;
const ROUTE_DETAILS_ROW = '/dashboard/screen/details/';

const TABLE_HEAD = [
    {id: 'name', label: 'Name', alignRight: false},
    {id: 'user', label: 'User', alignRight: false},
    {id: 'business', label: 'Business', alignRight: false},
    {id: 'code', label: 'Device Code', alignRight: false},
    {id: 'created_at', label: 'Create At', alignRight: false},
    {id: 'updated_at', label: 'Update At', alignRight: false},
    {id: 'actions', label: 'Actions'},
];


export default function ScreenDataTable({area}) {
    const {navigateTo} = useNavigateTo();
    const [dataTable, setDataTable] = useState([]);
    const [open, setOpen] = useState(false);
    const [openNewDialog, setOpenNewDialog] = useState(false);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [areas, setAreas] = useState([]);
    const [disabledAreaField, setDisabledAreaField] = useState(false);
    const [changeCode, setChangeCode] = useState(false);

    const {currentUser} = useAuthStore((state) => state);
    const {api} = useApiHandlerStore((state) => state);
    const showMessageAlert = useMessagesAlert();
    const showMessageSnackbar = useMessagesSnackbar();

    const getAreas = async () => {
        const response = await api.__get(`${AREA_URL_GET_DATA}`, (msg) => {
            showMessageSnackbar(msg, 'error');
        })

        if (response) {
            if (area) {
                setAreas(Object.values(response.data));
            } else if (currentUser && currentUser.user.role.tag === PROYECT_CONFIG.API_CONFIG.ROLES.ADMIN) {
                setAreas(Object.values(response.data));
            } else {
                const filteredAreas = filter(response.data, (_area) => _area.business.user_id === currentUser.user.id)
                setAreas(filteredAreas);
            }
        }
    };
    const getScreens = async () => {
        const urlApi = area ? `${SCREEN_URL_GET_DATA}?area_id=${area}` : SCREEN_URL_GET_DATA;
        const response = await api.__get(urlApi, (msg) => {
            showMessageSnackbar(msg, 'error');
        })

        if (response) {
            if (area) {
                setDataTable(Object.values(response.data));
            } else if (currentUser && currentUser.user.role.tag === PROYECT_CONFIG.API_CONFIG.ROLES.ADMIN) {
                setDataTable(Object.values(response.data));
            } else {
                const filteredScreen = filter(response.data, (_screen) => _screen.area.business.user_id === currentUser.user.id)
                setDataTable(filteredScreen);
            }
        }
    };

    const deleteRows = async (ids) => {
        const data = {'ids': ids};
        const response = await api.__delete(SCREEN_URL_DELETE_ROW, data, (msg) => {
            showMessageSnackbar(msg, 'error');
        })

        if (response) {
            showMessageAlert(response.message, 'success');
            getScreens();
            setSelected([]);
        }
    }

    const handleDeleteSelected = () => {
        deleteRows(selected)
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
        editAction(item.id)
    }

    const handleDetailsItemClick = (item) => {
        handleCloseMenu()
        navigateTo(`${ROUTE_DETAILS_ROW}${item.id}`)
    }

    const handleDeleteItemClick = (item) => {
        handleCloseMenu()
        deleteRows([item.id])
    }

    const [validator, setValidator] = useState({});
    const initialFormData = {
        name: '',
        description: '',
        code: '',
        area_id: '',
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
    const handleClickNewArea = () => {
        if (area) {
            setDisabledAreaField(true);
        } else {
            setDisabledAreaField(false);
        }
        setChangeCode(!update)
        setFormData({
            name: '',
            description: '',
            code: '',
            area_id: area,
            enabled: 1
        })
        setOpenNewDialog(true);
    };

    const handleCloseNew = () => {
        setOpenNewDialog(false);
        setFormData(initialFormData);
        setUpdate(null);
        setValidator([]);
    };

    const createNewAction = async () => {
        let response;
        const editFormData = {};

        if (update) {
            editFormData.name = formData.name
            editFormData.description = formData.description
            editFormData.area_id = formData.area_id
            editFormData.enabled = formData.enabled

            if (changeCode) {
                editFormData.code = formData.code
            }

            response = await api.__update(`${SCREEN_URL_UPDATE_ROW}${update}`, editFormData, (msg) => {
                showMessageSnackbar(msg, 'error');
            });
        } else {
            response = await api.__post(SCREEN_URL_CREATE_ROW, formData, (msg) => {
                showMessageSnackbar(msg, 'error');
            });
        }


        if (response) {
            if (response.success) {
                const msg = update ? `Screen updated successfully!` : `Screen added successfully!`;
                showMessageSnackbar(msg, 'success');
                setOpenNewDialog(false);
                getScreens();
                setUpdate(null);
                setDisabledAreaField(false);
                setFormData(initialFormData);
                setValidator([]);
            } else {
                setValidator(response && response.data)
            }
        }
    }

    const editAction = async (id) => {
        setDisabledAreaField(true);
        setUpdate(id);
        setChangeCode(update)
        const response = await api.__get(`${SCREEN_URL_GET_DATA_UPDATE}${id}`, null, (msg) => {
            showMessageSnackbar(msg, 'error');
        });

        if (response) {
            setFormData({
                name: response.data.name,
                description: response.data.description,
                area_id: response.data.area_id,
                code: response.data.code,
                enabled: response.data.enabled
            })
            setOpenNewDialog(true);
        }
    }

    const handleChangeCode = (event) => {
        const {name, value} = event.target;
        setChangeCode(!changeCode)
    }

    useEffect(() => {
        getAreas();
        getScreens();
    }, []);

    return (
        <>
            <Stack direction="row" alignItems="left" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Screens
                </Typography>
                <Button variant="outlined" onClick={handleClickNewArea}
                        startIcon={<Iconify icon="eva:plus-fill"/>}>
                    New Screen
                </Button>
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
                                rowCount={filteredDataTable.length}
                                numSelected={selected.length}
                                onRequestSort={handleRequestSort}
                                onSelectAllClick={handleSelectAllClick}
                            />
                            <TableBody>
                                {filteredDataTable.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    const {id, name} = row;
                                    const selectedRow = selected.indexOf(id) !== -1;
                                    const nameUser = row.area.business.user.name
                                    const nameBusiness = row.area.business.name
                                    const bgColorCell = row.enabled === 1 ? palette.success.lighter : palette.error.lighter
                                    return (
                                        <TableRow hover key={id} tabIndex={-1} role="checkbox"
                                                  selected={selectedRow} sx={{background: bgColorCell}}>
                                            <TableCell padding="checkbox">
                                                <Checkbox checked={selectedRow}
                                                          onChange={(event) => handleClick(event, id)}/>
                                            </TableCell>

                                            <TableCell component="th" scope="row" padding="none">
                                                <Stack direction="row" alignItems="center" spacing={2}>
                                                    <Iconify icon="material-symbols:live-tv-outline-rounded"/>
                                                    <Typography variant="subtitle2" noWrap>
                                                        {name}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>

                                            <TableCell align="left">{nameUser}</TableCell>

                                            <TableCell align="left">{nameBusiness}</TableCell>

                                            <TableCell align="left">
                                                {
                                                    row.code
                                                }
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
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredDataTable.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
            <Dialog open={openNewDialog} onClose={handleCloseNew}>
                <DialogTitle>{update ? 'Edit' : 'Create a new'} Screen</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="name"
                        label="Name"
                        value={formData.name}
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={handleChange}
                        error={validator.name && true}
                        helperText={validator.name}
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Description"
                        value={formData.description}
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={handleChange}
                        error={validator.description && true}
                        helperText={validator.description}
                        sx={{pb: 2}}
                    />
                    <FormControlLabel
                        control={<Checkbox name="changeCode" checked={changeCode} onChange={handleChangeCode}/>}
                        label="Change Code"
                        sx={{m: -1.5}}
                    />
                    <TextField
                        margin="dense"
                        name="code"
                        label="Device Code"
                        value={formData.code}
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={handleChange}
                        error={validator.code && true}
                        helperText={validator.code}
                        sx={{pb: 2}}
                        disabled={!changeCode}
                    />
                    <FormControl
                        variant="standard"
                        fullWidth
                        disabled={disabledAreaField}
                        sx={{mb: 3}}
                    >
                        <InputLabel id="role-select-label">Select Area</InputLabel>
                        <Select
                            name="area_id"
                            labelId="user-select-label"
                            id="area-select"
                            value={formData.area_id}
                            label="Select Area"
                            onChange={handleChange}
                        >
                            {
                                areas.map((item) => {
                                    return (
                                        <MenuItem key={item.id}
                                                  value={item.id}>{item.name}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                    <FormControlLabel
                        control={<Checkbox name="enabled" checked={formData.enabled === 1} onChange={handleChange}/>}
                        label="Enabled"
                        sx={{m: -1.5}}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseNew}>Cancel</Button>
                    <Button onClick={createNewAction}>{update ? 'Save' : 'Create'}</Button>
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
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
    Typography, InputLabel, Select, FormControl
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import SaveIcon from '@mui/icons-material/Save';
import {filter, flatMap} from "lodash";
import PROJECT_CONFIG from "../../config/config";
import {UserListHead, UserListToolbar} from "../../sections/@dashboard/user";
import Scrollbar from "../../components/scrollbar/Scrollbar";
import {formatDate} from "../../utils/formatTime";
import Iconify from "../../components/iconify";
import useApiHandlerStore from "../../zustand/useApiHandlerStore";
import useMessagesAlert from "../../hooks/messages/useMessagesAlert";
import useMessagesSnackbar from "../../hooks/messages/useMessagesSnackbar";
import {applySortFilter, getComparator} from "../../utils/table/tableFunctions";
import palette from "../../theme/palette";
import useNavigateTo from "../../hooks/navigateTo";
import useAuthStore from "../../zustand/useAuthStore";
import BackButton from "../../sections/@dashboard/app/AppBackButton";


const AREA_URL_GET_DATA = PROJECT_CONFIG.API_CONFIG.AREA.ALL;
const BUSINESS_URL_GET_DATA = PROJECT_CONFIG.API_CONFIG.BUSINESS.ALL;
const SCREEN_URL_GET_DATA = PROJECT_CONFIG.API_CONFIG.SCREEN.ALL;
const SCREEN_URL_GET_DATA_UPDATE = PROJECT_CONFIG.API_CONFIG.SCREEN.GET;
const SCREEN_URL_DELETE_ROW = PROJECT_CONFIG.API_CONFIG.SCREEN.DELETE;
const SCREEN_URL_CREATE_ROW = PROJECT_CONFIG.API_CONFIG.SCREEN.CREATE;
const SCREEN_URL_UPDATE_ROW = PROJECT_CONFIG.API_CONFIG.SCREEN.UPDATE;
const ROUTE_DETAILS_ROW = '/dashboard/screen/details/';

const TABLE_HEAD = [
    {id: 'name', label: 'Name', alignRight: false},
    {id: 'user', label: 'User', alignRight: false},
    {id: 'business', label: 'Business', alignRight: false},
    {id: 'actives', label: 'Active On', alignRight: false},
    {id: 'created_at', label: 'Create At', alignRight: false},
    {id: 'updated_at', label: 'Update At', alignRight: false},
    {id: 'actions', label: 'Actions'},
];


export default function ScreenDataTable({ business }) {
    const { navigateTo } = useNavigateTo();
    const [dataTable, setDataTable] = useState([]);
    const [open, setOpen] = useState(false);
    const [openNewDialog, setOpenNewDialog] = useState(false);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(PROJECT_CONFIG.TABLE_CONFIG.ROW_PER_PAGE);
    const [areas, setAreas] = useState([]);
    const [businesses, setBusinesses] = useState([]);
    const [businessesIds, setBusinessesIds] = useState([]);
    const [disabledAreaField, setDisabledAreaField] = useState(false);

    const {currentUser} = useAuthStore((state) => state);
    const {api} = useApiHandlerStore((state) => state);
    const showMessageAlert = useMessagesAlert();
    const showMessageSnackbar = useMessagesSnackbar();
    const [loading, setLoading] = useState(false);

    const getAreas = async (pBusiness) => {
        const path = pBusiness ? `${AREA_URL_GET_DATA}?business_id=${pBusiness}` : `${AREA_URL_GET_DATA}`
        const response = await api.__get(path, (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { getAreas(pBusiness) })

        if (response !== undefined && response.data) {
            getBusiness(Object.values(response.data))
        }
    };

    const getBusiness = async (_areas) => {
        const response = await api.__get(`${BUSINESS_URL_GET_DATA}`, (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { getBusiness() })

        if (response !== undefined && response.data) {
            if (business) {
                setAreas(_areas)
                setBusinesses(Object.values(response.data));
            } else if (currentUser && currentUser.user.role.tag === PROJECT_CONFIG.API_CONFIG.ROLES.ADMIN) {
                setAreas(_areas)
                setBusinesses(Object.values(response.data));
            } else {
                const filteredBusiness = filter(response.data, (_business) => _business.user_id === currentUser.user.id)
                setBusinesses(filteredBusiness);
                const businessIds = filteredBusiness.map(mBusiness => mBusiness.id);
                const filteredAreas = filter(_areas, (_area) => businessIds.includes( _area.business_id))
                setAreas(filteredAreas);
            }
        }
    };


    const getScreens = async () => {
        const urlApi = business ? `${SCREEN_URL_GET_DATA}?business_id=${business}` : SCREEN_URL_GET_DATA;
        const response = await api.__get(urlApi, (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { getScreens() })

        if (response !== undefined && response.data) {
            if (business) {
                setDataTable(Object.values(response.data));
            } else if (currentUser && currentUser.user.role.tag === PROJECT_CONFIG.API_CONFIG.ROLES.ADMIN) {
                setDataTable(Object.values(response.data));
            } else {
                const filteredScreen = filter(response.data, (_screen) => _screen.business.user_id === currentUser.user.id)
                setDataTable(filteredScreen);
            }
        }
    };

    const deleteRows = async (ids) => {
        const data = {'ids': ids};
        const response = await api.__delete(SCREEN_URL_DELETE_ROW, data, (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { deleteRows(ids) })

        if (response) {
            showMessageAlert(response.message, 'success');
            getScreens();
            setSelected([]);
        }
    }

    const handleDeleteSelected = () => {
        deleteRows(selected)
    }

    const handleEditSelected = () => {
        if (selected.length === 1) {
            editAction(selected[0])
        }
    }

    const handleDetailsSelected = () => {
        if (selected.length === 1) {
            if (business) {
                navigateTo(`${ROUTE_DETAILS_ROW}${selected[0]}`)
            } else {
                navigateTo(`${ROUTE_DETAILS_ROW}${selected[0]}/menu`)
            }
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
        editAction(item.id)
    }

    const handleDetailsItemClick = (item) => {
        handleCloseMenu()
        if (business) {
            navigateTo(`${ROUTE_DETAILS_ROW}${item.id}`)
        } else {
            navigateTo(`${ROUTE_DETAILS_ROW}${item.id}/menu`)
        }
    }

    const handleDeleteItemClick = (item) => {
        handleCloseMenu()
        deleteRows([item.id])
    }

    const [validator, setValidator] = useState({});
    const initialFormData = {
        name: '',
        description: '',
        area_id: '',
        business_id: '',
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

        if (name === "business_id") {
            getAreas(value)
        }
    };
    const handleClickNewScreen = () => {
        if (business) {
            setDisabledAreaField(true);
        } else {
            setDisabledAreaField(false);
        }
        setFormData({
            name: '',
            description: '',
            area_id: '',
            business_id: business,
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
            editFormData.business_id = formData.business_id
            editFormData.enabled = formData.enabled

            response = await api.__update(`${SCREEN_URL_UPDATE_ROW}${update}`, editFormData, (msg) => {
                showMessageSnackbar(msg, 'error');
            }, () => { createNewAction() },
                ( isLoading ) => { setLoading(isLoading) });
        } else {
            response = await api.__post(SCREEN_URL_CREATE_ROW, formData, (msg) => {
                showMessageSnackbar(msg, 'error');
            }, () => { createNewAction() },
                ( isLoading ) => { setLoading(isLoading) });
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
                setValidator(response.data && response.data)
            }
        }
    }

    const editAction = async (id) => {
        setUpdate(id);
        const response = await api.__get(`${SCREEN_URL_GET_DATA_UPDATE}${id}`,  (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { editAction(id) });

        if (response !== undefined && response.data) {
            setFormData({
                name: response.data.name,
                description: response.data.description,
                area_id: response.data.area_id,
                business_id: response.data.business_id,
                enabled: response.data.enabled
            })
            getAreas(response.data.business_id)
            setOpenNewDialog(true);
        }
    }

    useEffect(() => {
        getAreas(business)
        getScreens();
    }, []);

    return (
        <>
            <Stack direction="row" alignItems="start" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    { business ?  'Screens' : '' }
                </Typography>
                <Button variant="outlined" onClick={handleClickNewScreen}
                        startIcon={<Iconify icon="eva:plus-fill"/>}>
                    New Screen
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
                                headLabel={TABLE_HEAD}
                                rowCount={filteredDataTable.length}
                                numSelected={selected.length}
                                onRequestSort={handleRequestSort}
                                onSelectAllClick={handleSelectAllClick}
                            />
                            <TableBody>
                                {filteredDataTable.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    const {id, name, business, devices} = row;
                                    const selectedRow = selected.indexOf(id) !== -1;
                                    const nameUser = business ? business.user.name : ''
                                    const nameBusiness = business ? business.name : ''
                                    let bgColorCell = row.enabled === 1 ? palette.success.lighter : palette.error.lighter
                                    const ActiveOn = devices ? devices.length : 0

                                    if (ActiveOn === 0) {
                                        bgColorCell = palette.warning.lighter
                                    }

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
                                                { row.devices ? row.devices.length : 0 } Device(s)
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
            <Dialog open={openNewDialog} onClose={handleCloseNew}>
                <DialogTitle>{update ? 'Edit' : 'Create a new'} Screen</DialogTitle>
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
                    <TextField
                        margin="dense"
                        name="description"
                        label="Description"
                        value={formData.description ?? ''}
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={handleChange}
                        sx={{pb: 2}}
                    />
                    <FormControl
                        variant="standard"
                        fullWidth
                        disabled={disabledAreaField}
                        defaultValue={''}
                        sx={{mb: 3}}
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
                                businesses.map((item) => {
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
                        <InputLabel id="role-select-label">Select Area (optional)</InputLabel>
                        <Select
                            name="area_id"
                            labelId="area-select-label"
                            id="area-select"
                            value={formData.area_id ?? ''}
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
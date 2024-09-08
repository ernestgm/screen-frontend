import React, {useEffect, useState} from "react";
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
    Typography
} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {LoadingButton} from "@mui/lab";
import SaveIcon from '@mui/icons-material/Save';
import {filter} from "lodash";
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
import marqueeColors from "../../_mock/colors";
import SingleColorPreview from "../../components/color-utils/SingleColorPreview";


const MARQUEE_URL_GET_ALL_DATA = PROJECT_CONFIG.API_CONFIG.MARQUEE.ALL;
const MARQUEE_URL_GET_DATA_UPDATE = PROJECT_CONFIG.API_CONFIG.MARQUEE.GET;
const MARQUEE_URL_DELETE_ROW = PROJECT_CONFIG.API_CONFIG.MARQUEE.DELETE;
const MARQUEE_URL_CREATE_ROW = PROJECT_CONFIG.API_CONFIG.MARQUEE.CREATE;
const MARQUEE_URL_UPDATE_ROW = PROJECT_CONFIG.API_CONFIG.MARQUEE.UPDATE;
const BUSINESS_URL_GET_DATA = PROJECT_CONFIG.API_CONFIG.BUSINESS.ALL;
const ROUTE_DETAILS_ROW = '/dashboard/marquee/details/';

const TABLE_HEAD = [
    {id: 'name', label: 'Name', alignRight: false},
    {id: 'business', label: 'Business', alignRight: false},
    {id: 'bg_color', label: 'Background Color', alignRight: false},
    {id: 'text_color', label: 'Text Color', alignRight: false},
    {id: 'active_on', label: 'Active On', alignRight: false},
    {id: 'created_at', label: 'Create At', alignRight: false},
    {id: 'updated_at', label: 'Update At', alignRight: false},
    {id: 'actions', label: 'Actions'},
];


export default function MarqueeDataTable() {
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
    const [businesses, setBusinesses] = useState([]);
    const [disabledAreaField, setDisabledAreaField] = useState(false);
    const [update, setUpdate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const [rowsForDelete, setRowsForDelete] = useState([]);

    const {currentUser} = useAuthStore((state) => state);
    const {api} = useApiHandlerStore((state) => state);
    const showMessageAlert = useMessagesAlert();
    const showMessageSnackbar = useMessagesSnackbar();


    const getBusiness = async () => {
        const response = await api.__get(`${BUSINESS_URL_GET_DATA}`, (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { getBusiness() })

        if (response !== undefined && response.data) {
            if (currentUser && currentUser.user.role.tag === PROJECT_CONFIG.API_CONFIG.ROLES.ADMIN) {
                setBusinesses(Object.values(response.data));
            } else {
                const filteredBusiness = filter(response.data, (_business) => _business.user_id === currentUser.user.id)
                setBusinesses(filteredBusiness);
            }
        }
    };
    const getMarquees = async () => {
        const response = await api.__get(MARQUEE_URL_GET_ALL_DATA, (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { getMarquees() })

        if (response !== undefined && response.data) {
            if (currentUser && currentUser.user.role.tag === PROJECT_CONFIG.API_CONFIG.ROLES.ADMIN) {
                setDataTable(Object.values(response.data));
            } else {
                const filteredMarquee = filter(response.data, (_marquee) => _marquee.business.user_id === currentUser.user.id)
                setDataTable(filteredMarquee);
            }
        }
    };

    const deleteRows = async () => {
        setLoading(true)
        const data = {'ids': rowsForDelete};
        const response = await api.__delete(MARQUEE_URL_DELETE_ROW, data, (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { deleteRows() })

        if (response) {
            showMessageAlert(response.message, 'success');
            getMarquees();
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
            editAction(selected[0])
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
        editAction(item.id)
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

    const [validator, setValidator] = useState({});
    const initialFormData = {
        name: '',
        business_id: '',
        bg_color: '#000000',
        text_color: '#FFFFFF',
    }
    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };
    const handleClickNewMarquee = () => {
        setFormData(initialFormData)
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
            editFormData.business_id = formData.business_id
            editFormData.bg_color = formData.bg_color
            editFormData.text_color = formData.text_color

            response = await api.__update(`${MARQUEE_URL_UPDATE_ROW}${update}`, editFormData, (msg) => {
                showMessageSnackbar(msg, 'error');
            }, () => { createNewAction() }, ( isLoading ) => { setLoading(isLoading) });
        } else {
            response = await api.__post(MARQUEE_URL_CREATE_ROW, formData, (msg) => {
                showMessageSnackbar(msg, 'error');
            }, () => { createNewAction() }, ( isLoading ) => { setLoading(isLoading) });
        }


        if (response) {
            if (response.success) {
                const msg = update ? `Marquee updated successfully!` : `Marquee added successfully!`;
                showMessageSnackbar(msg, 'success');
                setOpenNewDialog(false);
                getMarquees();
                setUpdate(null);
                setFormData(initialFormData);
                setValidator([]);
            } else {
                setValidator(response.data && response.data)
            }
        }
    }

    const editAction = async (id) => {
        setUpdate(id);
        const response = await api.__get(`${MARQUEE_URL_GET_DATA_UPDATE}${id}`,  (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { editAction(id) });

        if (response.data) {
            setFormData({
                name: response.data.name,
                business_id: response.data.business_id,
                bg_color: response.data.bg_color,
                text_color: response.data.text_color,
            })
            setOpenNewDialog(true);
        }
    }

    useEffect(() => {
        getBusiness()
        getMarquees()
    }, []);

    return (
        <>
            <Stack direction="row" alignItems="end" justifyContent="space-between" mb={5}>
                <Button variant="outlined" onClick={handleClickNewMarquee}
                        startIcon={<Iconify icon="eva:plus-fill"/>}>
                    New Marquee
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
                                    const nameBusiness = business ? business.name : ''
                                    let bgColorCell = palette.success.lighter
                                    const ActiveOn = devices ? devices.length : 0
                                    const marqueeBgColor = marqueeColors.find((color) => color.id === row.bg_color)
                                    const marqueeBgColorName = marqueeBgColor ? marqueeBgColor.name : '';
                                    const marqueeTextColor = marqueeColors.find((color) => color.id === row.text_color)
                                    const marqueeTextColorName = marqueeTextColor ? marqueeTextColor.name : '';

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

                                            <TableCell align="center" component="th" scope="row" padding="none">
                                                <Typography variant="subtitle2" noWrap>
                                                    {name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="left">{nameBusiness}</TableCell>
                                            <TableCell align="left">
                                                {
                                                    marqueeBgColorName
                                                }
                                            </TableCell>
                                            <TableCell align="left">
                                                {
                                                    marqueeTextColorName
                                                }
                                            </TableCell>
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
                <DialogTitle>{update ? 'Edit' : 'Create a new'} Marquee</DialogTitle>
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
                        sx={{mb:3}}
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
                        defaultValue={''}
                        sx={{mb: 3}}
                    >
                        <InputLabel id="role-select-label">Select Background Color</InputLabel>
                        <Select
                            name="bg_color"
                            labelId="bg-color-select-label"
                            id="bg-color-select"
                            value={formData.bg_color ?? ''}
                            label="Select Background Color"
                            onChange={handleChange}
                        >
                            {
                                marqueeColors.map( (item) => {
                                        return (
                                            <MenuItem key={item.id} value={item.id}>
                                                <Stack sx={{pl:2}} component="span" direction="row" alignItems="center" justifyContent="flex-start">
                                                    <SingleColorPreview color={item.id}  sx={{ mr: 2 }} /> {item.name}
                                                </Stack>
                                            </MenuItem>
                                        )
                                    }
                                )
                            }
                        </Select>
                    </FormControl>
                    <FormControl
                        variant="standard"
                        fullWidth
                        sx={{mb: 3}}
                        defaultValue={''}
                    >
                        <InputLabel id="text-color-select-label">Select Text Color</InputLabel>
                        <Select
                            name="text_color"
                            labelId="text-color-select-label"
                            id="text-color-select"
                            value={formData.text_color ?? ''}
                            label="Select Text Color"
                            onChange={handleChange}
                        >
                            {
                                marqueeColors.map( (item) => {
                                        return (
                                            <MenuItem key={item.id} value={item.id}>
                                                <Stack sx={{pl:2}} component="span" direction="row" alignItems="center" justifyContent="flex-start">
                                                    <SingleColorPreview color={item.id}  sx={{ mr: 2 }} /> {item.name}
                                                </Stack>
                                            </MenuItem>
                                        )
                                    }
                                )
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
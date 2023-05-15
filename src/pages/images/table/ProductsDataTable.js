import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    Avatar, Button, Card, Dialog,
    Checkbox, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, MenuItem, Paper, Popover,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer, TablePagination,
    TableRow, TextField,
    Typography
} from "@mui/material";
import PropTypes from "prop-types";
import {faker} from "@faker-js/faker";
import * as React from "react";
import PROYECT_CONFIG from "../../../config/config";
import {UserListHead, UserListToolbar} from "../../../sections/@dashboard/user";
import Scrollbar from "../../../components/scrollbar/Scrollbar";
import {formatDate} from "../../../utils/formatTime";
import Iconify from "../../../components/iconify";
import useApiHandlerStore from "../../../zustand/useApiHandlerStore";
import useMessagesAlert from "../../../hooks/messages/useMessagesAlert";
import useMessagesSnackbar from "../../../hooks/messages/useMessagesSnackbar";
import {applySortFilter, getComparator} from "../../../utils/table/tableFunctions";
import {fCurrency} from "../../../utils/formatNumber";


// Area Table

const PRODUCT_URL_GET_DATA = PROYECT_CONFIG.API_CONFIG.PRODUCT.ALL;
const PRODUCT_URL_GET_DATA_UPDATE = PROYECT_CONFIG.API_CONFIG.PRODUCT.GET;
const PRODUCT_URL_DELETE_ROW = PROYECT_CONFIG.API_CONFIG.PRODUCT.DELETE;
const PRODUCT_URL_CREATE_ROW = PROYECT_CONFIG.API_CONFIG.PRODUCT.CREATE;
const PRODUCT_URL_UPDATE_ROW = PROYECT_CONFIG.API_CONFIG.PRODUCT.UPDATE;
const URL_GET_ROUTE_JSON = PROYECT_CONFIG.API_CONFIG.BUSINESS.ROUTE_JSON;

const TABLE_HEAD = [
    {id: 'name', label: 'Name', alignRight: false},
    {id: 'description', label: 'Description', alignRight: false},
    {id: 'price', label: 'Price', alignRight: false},
    {id: 'created_at', label: 'Create At', alignRight: false},
    {id: 'updated_at', label: 'Update At', alignRight: false},
    {id: 'actions', label: 'Actions'},
];


export default function ProductsDataTable({image, saveLocalProducts}) {

    const [dataTable, setDataTable] = useState([]);

    const [open, setOpen] = useState(false);

    const [openNewDialog, setOpenNewDialog] = useState(false);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const {api} = useApiHandlerStore((state) => state);
    const showMessageAlert = useMessagesAlert();
    const showMessageSnackbar = useMessagesSnackbar();

    const getProducts = async () => {
        console.log(image);
        const response = await api.__get(`${PRODUCT_URL_GET_DATA}?image_id=${image}`, (msg) => {
            showMessageSnackbar(msg, 'error');
        })

        if (response) {
            console.log(response)
            setDataTable(Object.values(response.data));
        }
    };

    const deleteRows = async (ids) => {
        if (image === undefined) {
            const filteredItems = dataTable.filter((item) => !ids.includes(item.id));
            setDataTable(filteredItems);
            setSelected([]);
            saveLocalProducts(filteredItems)
        } else {
            const data = {'ids': ids};
            const response = await api.__delete(PRODUCT_URL_DELETE_ROW, data, (msg) => {
                showMessageSnackbar(msg, 'error');
            })

            if (response) {
                showMessageAlert(response.message, 'success');
                getProducts();
                setSelected([]);
            }
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

    const handleDeleteItemClick = (item) => {
        handleCloseMenu()
        deleteRows([item.id])
    }

    const [validator, setValidator] = useState({});

    const initialFormData = {
        id: '',
        name: '',
        description: '',
        price: 0,
        created_at: '',
        updated_at: '',
        image_id: image
    }

    const [formData, setFormData] = useState(initialFormData);

    const [update, setUpdate] = useState(null);

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
            created_at: new Date(),
            updated_at: new Date(),
        }));
    };
    const handleClickNewArea = () => {
        setOpenNewDialog(true);
    };

    const handleCloseNew = () => {
        setOpenNewDialog(false);
        setFormData(initialFormData);
        setUpdate(null);
        setValidator([]);
    };

    const createNewAction = async () => {

        if (image === undefined) {
            if (update) {
                console.log(formData)
                const updatedItems = dataTable.map((item) => {
                    if (item.id === formData.id) {
                        console.log(item)
                        console.log(formData)
                        return {...item, name: formData.name, price: formData.price};
                    }
                    return item;
                });
                console.log(updatedItems)
                setDataTable(updatedItems);
                saveLocalProducts(updatedItems);
            } else {
                formData.id = faker.datatype.uuid();
                dataTable.push(formData)
                saveLocalProducts(dataTable)
            }

            setOpenNewDialog(false);
            setFormData(initialFormData);
            setValidator([]);
            setUpdate(null);
        } else {
            let response;
            if (update) {
                response = await api.__update(`${PRODUCT_URL_UPDATE_ROW}${update}`, formData, (msg) => {
                    showMessageSnackbar(msg, 'error');
                });
            } else {
                response = await api.__post(PRODUCT_URL_CREATE_ROW, formData, (msg) => {
                    showMessageSnackbar(msg, 'error');
                });
            }

            if (response) {
                if (response.success) {
                    const msg = update ? `Area updated successfully!` : `Area added successfully!`;
                    showMessageSnackbar(msg, 'success');
                    setOpenNewDialog(false);
                    getProducts();
                    setUpdate(null);
                    setFormData(initialFormData);
                    setValidator([]);
                } else {
                    setValidator(response && response.data)
                }
            }
        }
    }

    const editAction = async (id) => {
        setUpdate(id);
        if (image === undefined) {
            const item = dataTable.find((item) => item.id === id)
            setFormData(item)
            setOpenNewDialog(true);
        } else {
            const response = await api.__get(`${PRODUCT_URL_GET_DATA_UPDATE}${id}`, null, (msg) => {
                showMessageSnackbar(msg, 'error');
            });

            if (response) {
                setFormData({
                    name: response.data.name,
                    description: response.data.description,
                    image_id: image,
                    price: response.data.prices.slice(-1)[0].value
                })
                setOpenNewDialog(true);
            }
        }
    }

    const handleCopyClick = async (id, field, attr) => {
        const response = await api.__get(`${URL_GET_ROUTE_JSON}?id=${id}&field=${field}&attr=${attr}`, null, (msg) => {
            showMessageSnackbar(msg, 'error');
        });
        if (response) {
            navigator.clipboard.writeText(response.route);
            showMessageSnackbar(`Copy to clipboard: ${response.route}`, 'success');
            console.log(response)
        }
    };

    useEffect(() => {
        if (image !== undefined) {
            getProducts();
        }
    }, []);

    return (
        <>
            <Stack direction="row" alignItems="left" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Products
                </Typography>
                <Button variant="outlined" onClick={handleClickNewArea}
                        startIcon={<Iconify icon="eva:plus-fill"/>}>
                    New Product
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
                                    const {id, name, description, prices, price} = row;
                                    const selectedRow = selected.indexOf(id) !== -1;
                                    console.log(prices)
                                    return (
                                        <TableRow hover key={id} tabIndex={-1} role="checkbox"
                                                  selected={selectedRow}>
                                            <TableCell padding="checkbox">
                                                <Stack direction="row" alignItems="left" justifyContent="space-between"
                                                       mb={5}>
                                                    <Checkbox
                                                        checked={selectedRow}
                                                        onChange={(event) => handleClick(event, id)}
                                                    />
                                                </Stack>
                                            </TableCell>

                                            <TableCell component="th" scope="row" padding="none">
                                                <Stack direction="row" alignItems="left" justifyContent="space-between"
                                                       mb={5}>
                                                    <Typography variant="subtitle1" alignSelf="center">
                                                        {name}
                                                    </Typography>
                                                    <IconButton onClick={() => handleCopyClick(id, 'products', 'name')}
                                                                aria-label="copy">
                                                        <Iconify icon="material-symbols:file-copy-outline"/>
                                                    </IconButton>
                                                </Stack>
                                            </TableCell>

                                            <TableCell align="left">
                                                <Stack direction="row" alignItems="left" justifyContent="space-between"
                                                       mb={5}>
                                                    <Typography variant="inherit" alignSelf="center">
                                                        {description}
                                                    </Typography>
                                                    <IconButton
                                                        onClick={() => handleCopyClick(id, 'products', 'description')}
                                                        aria-label="copy">
                                                        <Iconify icon="material-symbols:file-copy-outline"/>
                                                    </IconButton>
                                                </Stack>
                                            </TableCell>

                                            <TableCell align="left">
                                                <Stack direction="row" alignItems="left" justifyContent="space-between"
                                                       mb={5}>
                                                    <Typography variant="inherit" alignSelf="center">
                                                        {prices && fCurrency(prices.slice(-1)[0].value)}
                                                    </Typography>
                                                    <IconButton
                                                        aria-label="copy"
                                                        onClick={() => handleCopyClick(prices.slice(-1)[0].id, 'prices', 'value')}
                                                    >
                                                        <Iconify icon="material-symbols:file-copy-outline"/>
                                                    </IconButton>
                                                </Stack>
                                            </TableCell>

                                            <TableCell align="left">
                                                <Stack direction="row" alignItems="left" justifyContent="space-between"
                                                       mb={5}>
                                                    <Typography variant="inherit" alignSelf="center">
                                                        {formatDate(row.created_at)}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>

                                            <TableCell align="left">
                                                <Stack direction="row" alignItems="left" justifyContent="space-between"
                                                       mb={5}>
                                                    <Typography variant="inherit" alignSelf="center">
                                                        {formatDate(row.updated_at)}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>

                                            <TableCell align="center">
                                                <Stack direction="row" alignItems="left" justifyContent="space-between"
                                                       mb={5}>
                                                    <IconButton id={id} size="large" color="inherit"
                                                                onClick={handleOpenMenu}>
                                                        <Iconify icon={'eva:more-vertical-fill'}/>
                                                    </IconButton>
                                                </Stack>
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
                <DialogTitle>{update ? 'Edit' : 'Create'} Product</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {update ? 'Edit' : 'Create a new'} product!
                    </DialogContentText>
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
                    />
                    <TextField
                        margin="dense"
                        name="price"
                        label="Price"
                        value={formData.price}
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={handleChange}
                        error={validator.price && true}
                        helperText={validator.price}
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
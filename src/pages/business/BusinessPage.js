import {useNavigate} from "react-router-dom";
import {Helmet} from 'react-helmet-async';
import {filter} from 'lodash';
import {sentenceCase} from 'change-case';
import {useEffect, useState} from 'react';
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
    TablePagination, Collapse, Alert,
} from '@mui/material';
// components
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections
import {UserListHead, UserListToolbar} from '../../sections/@dashboard/user';
import useApiHandlerStore from "../../zustand/useApiHandlerStore";
import {formatDate} from "../../utils/formatTime";
import useMessagesAlert from "../../hooks/messages/useMessagesAlert";
import useMessagesSnackbar from "../../hooks/messages/useMessagesSnackbar";
import PROYECT_CONFIG from "../../config/config";
import {applySortFilter, getComparator} from "../../utils/table/tableFunctions";


// ----------------------------------------------------------------------

const TABLE_HEAD = [
    {id: 'name', label: 'Name', alignRight: false},
    {id: 'description', label: 'Description', alignRight: false},
    {id: 'created_at', label: 'Create At', alignRight: false},
    {id: 'updated_at', label: 'Update At', alignRight: false},
    { id: 'actions', label: 'Actions' },
];

const PAGE_NAME = 'Business';
const URL_GET_DATA = '/businesses';
const URL_DELETE_ROW = '/businesses';
const PATH_EDIT_ROW = `/dashboard/business/edit/`;
const PATH_NEW_ROW = '/dashboard/business/create';
const PATH_DETAILS_ROW = '/dashboard/business/details/';

// ----------------------------------------------------------------------

export default function UserPage() {
    const navigate = useNavigate();

    const [dataTable, setDataTable] = useState([]);

    const [open, setOpen] = useState(null);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);


    const {api} = useApiHandlerStore((state) => state);
    const showMessageAlert = useMessagesAlert();
    const showMessageSnackbar = useMessagesSnackbar()

    const getDataTable = async () => {
        const response = await api.__get(URL_GET_DATA, (msg) => {
            showMessageSnackbar(msg, 'error');
        })

        if (response) {
            setDataTable(Object.values(response.data));
        }
    };

    const deleteRows = async (ids) => {
        const data = { 'ids': ids };
        const response = await api.__delete(URL_DELETE_ROW, data, (msg) => {
            showMessageSnackbar(msg, 'error');
        })

        if (response) {
            showMessageAlert(response.message, 'success');
            getDataTable();
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

    const newRowHandleClick = () => {
        navigate(PATH_NEW_ROW, {replace: true});
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataTable.length) : 0;

    const filteredDataTable = applySortFilter({array: dataTable, comparator: getComparator({_order: order, _orderBy: orderBy}), query: filterName});

    const isNotFound = !filteredDataTable.length && !!filterName;

    const handleEditItemClick = (item) => {
        handleCloseMenu()
        navigate(`${PATH_EDIT_ROW}${item.id}`, {replace: true})
    }

    const handleDetailsItemClick = (item) => {
        handleCloseMenu()
        navigate(`${PATH_DETAILS_ROW}${item.id}`, {replace: true})
    }

    const handleDeleteItemClick = (item) => {
        handleCloseMenu()
        deleteRows([item.id])
    }

    useEffect(() => {
        getDataTable()
    }, []);

    return (
        <>
            <Helmet>
                <title> Business | { PROYECT_CONFIG.NAME } </title>
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
                                                        <Avatar alt={name} src='/assets/images/avatars/avatar_1.jpg'/>
                                                        <Typography variant="subtitle2" noWrap>
                                                            {name}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left">{description}</TableCell>

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
                        count={filteredDataTable.length}
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

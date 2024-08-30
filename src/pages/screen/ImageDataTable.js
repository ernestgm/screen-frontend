import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import {useEffect, useState} from "react";
import {Card, Checkbox, MenuItem, Popover, Stack, TablePagination} from "@mui/material";
import Iconify from "../../components/iconify";
import PROYECT_CONFIG from "../../config/config";
import useApiHandlerStore from "../../zustand/useApiHandlerStore";
import useMessagesAlert from "../../hooks/messages/useMessagesAlert";
import useMessagesSnackbar from "../../hooks/messages/useMessagesSnackbar";
import {fCurrency} from "../../utils/formatNumber";
import {formatDate} from "../../utils/formatTime";
import useNavigateTo from "../../hooks/navigateTo";
import {UserListHead, UserListToolbar} from "../../sections/@dashboard/user";
import Scrollbar from "../../components/scrollbar/Scrollbar";
import palette from "../../theme/palette";
import {applySortFilter, getComparator} from "../../utils/table/tableFunctions";

const URL_GET_DATA = PROYECT_CONFIG.API_CONFIG.IMAGE.ALL;
const URL_DELETE_DATA = PROYECT_CONFIG.API_CONFIG.IMAGE.DELETE;
const URL_EDIT_IMAGE = '/dashboard/image/edit/';

const TABLE_HEAD = [
    {id: 'name', label: 'Name', alignRight: false},
    {id: 'duration', label: 'Duration', alignRight: false},
    {id: 'created_at', label: 'Create At', alignRight: false},
    {id: 'updated_at', label: 'Update At', alignRight: false},
    {id: 'actions', label: 'Actions'},
];

export default function ImageDataTable({screen}) {
    const {navigateTo} = useNavigateTo();
    const [open, setOpen] = useState(false);
    const {api} = useApiHandlerStore((state) => state);
    const showMessageAlert = useMessagesAlert();
    const showMessageSnackbar = useMessagesSnackbar();

    const [dataTable, setDataTable] = useState([]);
    const [openNewDialog, setOpenNewDialog] = useState(false);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);

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

    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const handleDeleteSelected = () => {
        deleteRows(selected)
    }

    const handleEditSelected = () => {
        if (selected.length === 1) {
            editAction(selected[0])
        }
    }

    const deleteRows = async (ids) => {
        const data = {'ids': ids, 'screen_id': screen};
        const response = await api.__delete(URL_DELETE_DATA, data, (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { deleteRows(ids) })

        if (response) {
            showMessageAlert(response.message, 'success');
            getData()
            setSelected([]);
        }
    }

    const editAction = async (id) => {
        handleCloseMenu()
        navigateTo(`${URL_EDIT_IMAGE}${screen}/${id}`);
    }

    const handleDeleteItemClick = (item) => {
        handleCloseMenu()
        deleteRows([item.id])
    }

    const handleEditItemClick = (item) => {
        handleCloseMenu()
        editAction(item.id)
    }

    const getData = async () => {
        const response = await api.__get(`${URL_GET_DATA}?screen_id=${screen}`, (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { getData() })

        if (response.data) {
            setDataTable(Object.values(response.data))
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
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
                                headLabel={TABLE_HEAD}
                                rowCount={filteredDataTable.length}
                                numSelected={selected.length}
                                onRequestSort={handleRequestSort}
                                onSelectAllClick={handleSelectAllClick}
                            />
                            <TableBody>
                                {filteredDataTable.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    const {id, name, duration} = row;
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
                                                    <img src={row.image} alt={row.description} width="70px"/>
                                                    <Typography variant="subtitle2" noWrap>
                                                        {name}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell align="center">{duration}s</TableCell>
                                            <TableCell align="center">{formatDate(row.created_at)}</TableCell>
                                            <TableCell align="center">{formatDate(row.updated_at)}</TableCell>

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
    )
}
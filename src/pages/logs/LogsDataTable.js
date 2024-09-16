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
import {Delete, RemoveRedEye} from "@mui/icons-material";
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



const LOGS_URL_GET_DATA = PROJECT_CONFIG.API_CONFIG.LOGS.ALL;
const LOGS_URL_VIEW_CONTENT = PROJECT_CONFIG.API_CONFIG.LOGS.VIEW;

const TABLE_HEAD = [
    {id: 'name', label: 'File', alignRight: false},
    {id: 'actions', label: 'Actions'},
];


export default function LogsDataTable() {
    const [dataTable, setDataTable] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(PROJECT_CONFIG.TABLE_CONFIG.ROW_PER_PAGE);

    const {api} = useApiHandlerStore((state) => state);
    const showMessageSnackbar = useMessagesSnackbar();
    const [content, setContent] = useState("");


    const getLogs = async () => {
        const response = await api.__get(LOGS_URL_GET_DATA, (msg) => {
            showMessageSnackbar(msg, 'error');
        })

        if (response !== undefined && response.files) {
            setDataTable(Object.values(response.files));
        }
    };

    const getContentLog = async (file) => {
        setLoading(true)
        const response = await api.__get(`${LOGS_URL_VIEW_CONTENT}?file=${file}`, (msg) => {
            showMessageSnackbar(msg, 'error');
        })
        setLoading(false)
        if (response !== undefined && response.content) {
            setContent(response.content);
            setOpen(true)
        }
    };
    const handleViewContentLog = (file) => {
        getContentLog(file)
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
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
    const handleClose = () => {
        setOpen(false)
        setContent("")
    }

    useEffect(() => {
        getLogs();
    }, []);



    return (
        <>
            <Card>
                <UserListToolbar
                    filterName={filterName}
                    onFilterName={handleFilterByName}
                />

                <Scrollbar>
                    <TableContainer sx={{minWidth: 800}}>
                        <Table>
                            <UserListHead
                                order={order}
                                orderBy={orderBy}
                                headLabel={TABLE_HEAD}
                                rowCount={filteredDataTable.length}
                                onRequestSort={handleRequestSort}
                            />
                            <TableBody>
                                {filteredDataTable.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                                    return (
                                        <TableRow hover key={index} tabIndex={-1} role="checkbox">
                                            <TableCell padding="checkbox">{''}</TableCell>

                                            <TableCell component="th" scope="row" padding="none">
                                                <Stack direction="row" alignItems="center" spacing={2}>
                                                    <Iconify icon="material-symbols:list-alt"/>
                                                    <Typography variant="subtitle2" noWrap>
                                                        {row.name}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>

                                            <TableCell align="center">
                                                <LoadingButton
                                                    color="secondary"
                                                    onClick={() => handleViewContentLog(row.name)}
                                                    loading={loading}
                                                    loadingPosition="start"
                                                    startIcon={<RemoveRedEye />}
                                                    variant="text"
                                                >
                                                    <span>View Log</span>
                                                </LoadingButton>
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

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{'Content'}</DialogTitle>
                <DialogContent>
                    <pre>{content}</pre>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
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
import {MenuItem, Popover} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Iconify from "../../components/iconify";
import PROYECT_CONFIG from "../../config/config";
import useApiHandlerStore from "../../zustand/useApiHandlerStore";
import useMessagesAlert from "../../hooks/messages/useMessagesAlert";
import useMessagesSnackbar from "../../hooks/messages/useMessagesSnackbar";
import {fCurrency} from "../../utils/formatNumber";
import {formatDate} from "../../utils/formatTime";


function Row(props) {
    const {row, handleClickMenu} = props;
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open
                            ?
                            <Iconify icon='material-symbols:keyboard-arrow-up-rounded' width={24} height={24}/>
                            :
                            <Iconify icon='material-symbols:keyboard-arrow-down-rounded' width={24} height={24}/>
                        }
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.name}
                </TableCell>
                <TableCell align="right">{row.description}</TableCell>
                <TableCell align="right">{formatDate(row.created_at)}</TableCell>
                <TableCell align="right">{formatDate(row.updated_at)}</TableCell>
                <TableCell align="right">
                    <IconButton id={row.id} size="large" color="inherit"
                                onClick={handleClickMenu}>
                        <Iconify icon={'eva:more-vertical-fill'}/>
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{margin: 1}}>
                            <Typography variant="h6" gutterBottom component="div">
                                Products
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Price</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.products && row.products.map((productRow) => (
                                        <TableRow key={productRow.id}>
                                            <TableCell component="th" scope="row">
                                                {productRow.name && productRow.name}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {productRow.description && productRow.description}
                                            </TableCell>
                                            <TableCell>
                                                {productRow.prices[0] && fCurrency(productRow.prices.slice(-1)[0].value)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        created_at: PropTypes.number.isRequired,
        updated_at: PropTypes.number.isRequired,
        products: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                name: PropTypes.string.isRequired,
                prices: PropTypes.arrayOf(
                    {
                        id: PropTypes.number.isRequired,
                        value: PropTypes.number.isRequired,
                    }
                ).isRequired,
            }),
        ).isRequired,
    }).isRequired,
    handleClickMenu: PropTypes.func.isRequired
};

const URL_GET_DATA = PROYECT_CONFIG.API_CONFIG.IMAGE.ALL;
const URL_DELETE_DATA = PROYECT_CONFIG.API_CONFIG.IMAGE.DELETE;
const URL_EDIT_IMAGE = '/dashboard/image/edit/';


export default function ImageDataTable({screen}) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const {api} = useApiHandlerStore((state) => state);
    const showMessageAlert = useMessagesAlert();
    const showMessageSnackbar = useMessagesSnackbar();

    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const deleteRows = async (ids) => {
        const data = {'ids': ids};
        const response = await api.__delete(URL_DELETE_DATA, data, (msg) => {
            showMessageSnackbar(msg, 'error');
        })

        if (response) {
            showMessageAlert(response.message, 'success');
            getData()
        }
    }

    const editAction = async (id) => {
        handleCloseMenu()
        navigate(`${URL_EDIT_IMAGE}${screen}/${id}`, {replace: true});
    }

    const handleDeleteItemClick = (item) => {
        handleCloseMenu()
        deleteRows([item.id])
    }

    const handleEditItemClick = (item) => {
        handleCloseMenu()
        editAction(item.id)
    }

    const [rows, setRows] = useState([])

    const getData = async () => {
        const response = await api.__get(`${URL_GET_DATA}?screen_id=${screen}`, (msg) => {
            showMessageSnackbar(msg, 'error');
        })

        if (response) {
            console.log(response)
            setRows(Object.values(response.data))
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell/>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Description</TableCell>
                            <TableCell align="right">Create At</TableCell>
                            <TableCell align="right">Update At</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows && rows.map((row) => (
                            <Row key={row.id} row={row} handleClickMenu={handleOpenMenu}/>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
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
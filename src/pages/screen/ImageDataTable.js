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
import {useEffect} from "react";
import Iconify from "../../components/iconify";
import PROYECT_CONFIG from "../../config/config";
import useApiHandlerStore from "../../zustand/useApiHandlerStore";
import useMessagesAlert from "../../hooks/messages/useMessagesAlert";
import useMessagesSnackbar from "../../hooks/messages/useMessagesSnackbar";

function createData(id, name, description, createAt, updateAt) {
    return {
        id,
        name,
        description,
        createAt,
        updateAt,
        products: [
            {
                id: 1,
                name: 'Producto 1',
                price: 3,
            },
            {
                id: 2,
                name: 'Producto 2',
                price: 3,
            }
        ],
    };
}

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
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
                <TableCell align="right">{row.createAt}</TableCell>
                <TableCell align="right">{row.updateAt}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Products
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Price</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.products.map((productRow) => (
                                        <TableRow key={productRow.id}>
                                            <TableCell component="th" scope="row">
                                                {productRow.name}
                                            </TableCell>
                                            <TableCell>
                                                {productRow.price}
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
        createAt: PropTypes.number.isRequired,
        updateAt: PropTypes.number.isRequired,
        products: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                name: PropTypes.string.isRequired,
                price: PropTypes.number.isRequired,
            }),
        ).isRequired,
    }).isRequired,
};

const rows = [
    createData(1,'Images 1', 'Una imagen', 9, 9),
    createData(2,'Images 1', 'Una imagen', 9, 9),
];

const URL_GET_DATA = PROYECT_CONFIG.API_CONFIG.IMAGE.ALL;

export default function ImageDataTable({screen}) {
    const {api} = useApiHandlerStore((state) => state);
    const showMessageAlert = useMessagesAlert();
    const showMessageSnackbar = useMessagesSnackbar();

    const getData = async () => {
        const response = await api.__get(`${URL_GET_DATA}?screen_id=${screen}`, (msg) => {
            showMessageSnackbar(msg, 'error');
        })

        if (response) {
            console.log(response)
            // setDataTable(Object.values(response.data));
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Description</TableCell>
                        <TableCell align="right">Create At</TableCell>
                        <TableCell align="right">Update At</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <Row key={row.id} row={row} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
// @mui
import {Helmet} from 'react-helmet-async';
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
    TablePagination,
    TextField, InputAdornment, FormControl, InputLabel, Select,
} from '@mui/material';
import {LoadingButton} from "@mui/lab";
import { GoogleMap, LoadScript, Autocomplete } from '@react-google-maps/api';
import Iconify from "../../components/iconify";
import BackButton from "../../sections/@dashboard/app/AppBackButton";
import useApiHandlerStore from "../../zustand/useApiHandlerStore";
import useMessagesSnackbar from "../../hooks/messages/useMessagesSnackbar";
import PROYECT_CONFIG from "../../config/config";
import { MapContainer } from "../../components/map";
import ProductsDataTable from "./table/ProductsDataTable";

// ----------------------------------------------------------------------

const NAME_PAGE = 'Image';
const URL_UPDATE = PROYECT_CONFIG.API_CONFIG.IMAGE.UPDATE;
const URL_CREATE = PROYECT_CONFIG.API_CONFIG.IMAGE.CREATE;
const URL_BACK = '/dashboard/screen/details/';
const URL_GET_ITEM_FOR_UPDATE = PROYECT_CONFIG.API_CONFIG.IMAGE.GET;

export default function CreateImagePage() {
    const showSnackbarMessage = useMessagesSnackbar();
    const {pscreen, pimage } = useParams();
    const navigate = useNavigate();
    const {api} = useApiHandlerStore((state) => state);
    const [validator, setValidator] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        screen_id: pscreen,
    });

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let response;
        if (pimage) {
            response = await api.__update(`${URL_UPDATE}${pimage}`, formData, (msg) => {
                showSnackbarMessage(msg, 'error');
            });
        } else {
            response = await api.__post(URL_CREATE, formData, (msg) => {
                showSnackbarMessage(msg, 'error');
            });
        }

        if (response) {
            if (response.success) {
                const msg = pimage ? `${NAME_PAGE} updated successfully!` : `${NAME_PAGE} added successfully!`;
                showSnackbarMessage(msg, 'success');
                navigate(`${URL_BACK}${pscreen}`)
            } else {
                setValidator(response && response.data)
            }
        }
    };

    const getItemForUpdate = async () => {
        const response = await api.__get(`${URL_GET_ITEM_FOR_UPDATE}${pimage}`, null, (msg) => {
            showSnackbarMessage(msg, 'error');
        });

        if (response) {
            console.log(response)
            setFormData({
                name: response.data.name,
                description: response.data.description,
                screen_id: pscreen,
            });
        }
    }

    const updateListProducts = (items) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            products: items,
        }));

        console.log(formData)
    }

    useEffect(() => {
        if (pimage) {
            getItemForUpdate();
        }
    }, [])

    return (
        <>
            <Helmet>
                <title> {pimage ? `${NAME_PAGE} edit` : `Create ${NAME_PAGE}`} | {PROYECT_CONFIG.NAME} </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="left" justifyContent="space-between" mb={5}>
                    <Stack>
                        <BackButton path={`${URL_BACK}${pscreen}`}/>
                    </Stack>
                    <Typography variant="h4" gutterBottom>
                        {pimage ? `${NAME_PAGE} edit` : `Create ${NAME_PAGE}`}
                    </Typography>
                </Stack>
                <Card>
                    <Stack spacing={3} justifyContent="space-between" mb={5} sx={{my: 2}}>
                        <TextField
                            name="name"
                            error={validator.name && true}
                            value={formData.name}
                            onChange={handleChange}
                            label="Name"
                            helperText={validator.name}
                        />
                        <TextField
                            name="description"
                            label="Description"
                            value={formData.description}
                            onChange={handleChange}
                            error={validator.description && true}
                            helperText={validator.description}
                        />
                    </Stack>

                    <ProductsDataTable image={pimage} saveLocalProducts={updateListProducts}/>
                </Card>
                <Stack mt={5}>
                    <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit}>
                        {`Save ${NAME_PAGE}`}
                    </LoadingButton>
                </Stack>
            </Container>
        </>
    );
}

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

// ----------------------------------------------------------------------

const NAME_PAGE = 'Business';
const URL_UPDATE = PROYECT_CONFIG.API_CONFIG.BUSINESS.UPDATE;
const URL_CREATE = PROYECT_CONFIG.API_CONFIG.BUSINESS.CREATE;
const URL_TABLES_PAGE = '/dashboard/business';
const URL_GET_ITEM_FOR_UPDATE = PROYECT_CONFIG.API_CONFIG.BUSINESS.GET;

export default function CreateBusinessPage() {
    const showSnackbarMessage = useMessagesSnackbar();
    const {id} = useParams();
    const navigate = useNavigate();
    const {api} = useApiHandlerStore((state) => state);
    const [validator, setValidator] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        logo: '',
        user_id: '',
        address: '',
        latitude: '',
        longitude: ''
    });

    const [owners, setOwners] = useState([]);
    const [autocomplete, setAutocomplete] = useState(null);


    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const chanceAddress = (place) => {
        console.log(place.geometry);
        setFormData((prevFormData) => ({
            ...prevFormData,
            address: place.formatted_address,
            latitude: place.geometry.location.lat().toString(),
            longitude: place.geometry.location.lng().toString(),
        }));
    }

    const chanceAutocomplete = (autocomplete) => {
        console.log(autocomplete);
        setAutocomplete(autocomplete);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let response;
        if (id) {
            response = await api.__update(`${URL_UPDATE}${id}`, formData, (msg) => {
                showSnackbarMessage(msg, 'error');
            });
        } else {
            response = await api.__post(URL_CREATE, formData, (msg) => {
                showSnackbarMessage(msg, 'error');
            });
        }

        if (response) {
            if (response.success) {
                const msg = id ? `${NAME_PAGE} updated successfully!` : `${NAME_PAGE} added successfully!`;
                showSnackbarMessage(msg, 'success');
                navigate(URL_TABLES_PAGE)
            } else {
                setValidator(response && response.data)
            }
        }
    };

    const getItemForUpdate = async () => {
        const response = await api.__get(`${URL_GET_ITEM_FOR_UPDATE}${id}`, null, (msg) => {
            showSnackbarMessage(msg, 'error');
        });

        if (response) {
            setFormData({
                name: response.data.name,
                description: response.data.description,
                logo: response.data.logo,
                user_id: response.data.user_id,
                address: response.data.geolocation.address,
                latitude: response.data.geolocation.latitude,
                longitude: response.data.geolocation.longitude,
            });
            const input = document.getElementById("address");
            input.value = response.data.geolocation.address;
        }
    }

    const getOwners = async () => {
        const response = await api.__get(PROYECT_CONFIG.API_CONFIG.USERS.ALL, null, (msg) => {
            showSnackbarMessage(msg, 'error');
        });

        if (response) {
            setOwners(Object.values(response.data));
        }
    }

    useEffect(() => {
        getOwners()
        if (id) {
            getItemForUpdate();
        }
    }, [])

    return (
        <>
            <Helmet>
                <title> {id ? `${NAME_PAGE} edit` : `Create ${NAME_PAGE}`} | {PROYECT_CONFIG.NAME} </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="left" justifyContent="space-between" mb={5}>
                    <Stack>
                        <BackButton path={URL_TABLES_PAGE}/>
                    </Stack>
                    <Typography variant="h4" gutterBottom>
                        {id ? `${NAME_PAGE} edit` : `Create ${NAME_PAGE}`}
                    </Typography>
                </Stack>
                <Card>
                    <Stack spacing={3} justifyContent="space-between" sx={{m: 2}}>
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
                        <TextField
                            name="logo"
                            label="Logo"
                            value={formData.logo}
                            onChange={handleChange}
                            error={validator.logo && true}
                            helperText={validator.logo}
                        />
                        <FormControl fullWidth>
                            <InputLabel id="role-select-label">Select Owner</InputLabel>
                            <Select
                                name="user_id"
                                labelId="user-select-label"
                                id="user-select"
                                value={formData.user_id}
                                label="Select Owner"
                                onChange={handleChange}
                            >
                                {
                                    owners.map((user) => {
                                        return (
                                            <MenuItem key={user.id}
                                                      value={user.id}>{user.name} {user.lastname}</MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>
                        <MapContainer setAddress={chanceAddress} geolocation={formData} >
                            <TextField
                                id="address"
                                name="address"
                                label="Address"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" >
                                            <Iconify icon="mdi:home-map-marker" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{width: '100%', height: 100}}
                            />
                        </MapContainer>
                    </Stack>
                </Card>
                <Stack sx={{m: 2}}>
                    <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit}>
                        Save
                    </LoadingButton>
                </Stack>
            </Container>
        </>
    );
}

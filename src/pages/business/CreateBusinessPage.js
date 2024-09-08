import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import SaveIcon from '@mui/icons-material/Save';
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
import PROJECT_CONFIG from "../../config/config";
import { MapContainer } from "../../components/map";
import useNavigateTo from "../../hooks/navigateTo";
import useAuthStore from "../../zustand/useAuthStore";

// ----------------------------------------------------------------------

const NAME_PAGE = 'Business';
const URL_UPDATE = PROJECT_CONFIG.API_CONFIG.BUSINESS.UPDATE;
const URL_CREATE = PROJECT_CONFIG.API_CONFIG.BUSINESS.CREATE;
const URL_TABLES_PAGE = '/dashboard/business';
const URL_GET_ITEM_FOR_UPDATE = PROJECT_CONFIG.API_CONFIG.BUSINESS.GET;
const ADMIN_TAG = PROJECT_CONFIG.API_CONFIG.ROLES.ADMIN

export default function CreateBusinessPage() {
    const showSnackbarMessage = useMessagesSnackbar();
    const {id} = useParams();
    const { navigateTo } = useNavigateTo();
    const { currentUser } = useAuthStore((state) => state);
    const {api} = useApiHandlerStore((state) => state);
    const [validator, setValidator] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        logo: 'example.png',
        user_id: (currentUser && currentUser.user.role.tag !== ADMIN_TAG) ? currentUser.user.id : '',
        address: '',
        latitude: '',
        longitude: ''
    });

    const [loading, setLoading] = useState(false);
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
        setFormData((prevFormData) => ({
            ...prevFormData,
            address: place.formatted_address,
            latitude: place.geometry.location.lat().toString(),
            longitude: place.geometry.location.lng().toString(),
        }));
    }

    const chanceAutocomplete = (autocomplete) => {
        setAutocomplete(autocomplete);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let response;
        if (id) {
            response = await api.__update(`${URL_UPDATE}${id}`, formData, (msg) => {
                showSnackbarMessage(msg, 'error');
            },
                () => { handleSubmit(e) },
                ( isLoading ) => { setLoading(isLoading) }
            );
        } else {
            response = await api.__post(URL_CREATE, formData, (msg) => {
                showSnackbarMessage(msg, 'error');
            }, () => { handleSubmit(e) },
                ( isLoading ) => { setLoading(isLoading) });
        }

        if (response) {
            if (response.success) {
                const msg = id ? `${NAME_PAGE} updated successfully!` : `${NAME_PAGE} added successfully!`;
                showSnackbarMessage(msg, 'success');
                navigateTo(URL_TABLES_PAGE)
            } else {
                setValidator(response.data && response.data)
            }
        }
    };

    const getItemForUpdate = async () => {
        const response = await api.__get(`${URL_GET_ITEM_FOR_UPDATE}${id}`, (msg) => {
            showSnackbarMessage(msg, 'error');
        }, () => { getItemForUpdate() });

        if (response.data) {
            setFormData({
                name: response.data.name,
                description: response.data.description ? response.data.description : '',
                logo: response.data.logo,
                user_id: response.data.user_id,
                address: response.data.geolocation ? response.data.geolocation.address : '',
                latitude: response.data.geolocation ? response.data.geolocation.latitude : '',
                longitude: response.data.geolocation ? response.data.geolocation.longitude : '',
            });
            const input = document.getElementById("address");
            input.value = response.data.geolocation ? response.data.geolocation.address : '';
        }
    }

    const getOwners = async () => {
        const response = await api.__get(PROJECT_CONFIG.API_CONFIG.USERS.ALL, (msg) => {
            showSnackbarMessage(msg, 'error');
        }, () => { getOwners() });

        if (response.data) {
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
                <title> {id ? `${NAME_PAGE} edit` : `Create ${NAME_PAGE}`} | {PROJECT_CONFIG.NAME} </title>
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
                            value={formData.name ?? ''}
                            onChange={handleChange}
                            label="Name"
                            helperText={validator.name}
                        />
                        <TextField
                            name="description"
                            label="Description"
                            value={formData.description ?? ''}
                            onChange={handleChange}
                            error={validator.description && true}
                            helperText={validator.description}
                        />
                        <TextField
                            name="logo"
                            label="Logo"
                            value={formData.logo ?? ''}
                            onChange={handleChange}
                            error={validator.logo && true}
                            helperText={validator.logo}
                            style={{display: "none"}}
                        />
                        <FormControl
                            fullWidth
                            error={validator.user_id && true}
                            helperText={validator.user_id}
                        >
                            <InputLabel id="role-select-label">Select Owner</InputLabel>
                            <Select
                                name="user_id"
                                labelId="user-select-label"
                                id="user-select"
                                value={formData.user_id ?? ''}
                                label="Select Owner"
                                onChange={handleChange}

                                disabled={(currentUser && currentUser.user.role.tag !== ADMIN_TAG)}
                            >
                                {
                                    owners.map((user) => {
                                        return (
                                            <MenuItem key={user.id} value={user.id}>{user.name} {user.lastname} - Role: {user.role.name}</MenuItem>
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
                    <LoadingButton
                        color="secondary"
                        onClick={handleSubmit}
                        loading={loading}
                        loadingPosition="start"
                        startIcon={<SaveIcon />}
                        variant="contained"
                    >
                        <span>Save</span>
                    </LoadingButton>
                </Stack>
            </Container>
        </>
    );
}

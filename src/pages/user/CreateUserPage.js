import {useEffect, useState} from 'react';
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
import Iconify from "../../components/iconify";
import BackButton from "../../sections/@dashboard/app/AppBackButton";
import useApiHandlerStore from "../../zustand/useApiHandlerStore";
import useMessagesSnackbar from "../../hooks/messages/useMessagesSnackbar";
import PROYECT_CONFIG from "../../config/config";


// ----------------------------------------------------------------------

export default function CreateUserPage() {
    const showSnackbarMessage = useMessagesSnackbar();
    const {id} = useParams();
    const navigate = useNavigate();
    const {api} = useApiHandlerStore((state) => state);
    const [validator, setValidator] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: '',
        role_id: '',
        password: '',
        c_password: ''
    });
    const [roles, setRoles] = useState([]);

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));

        if (name === 'email') {
            if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
                validator.email = 'The Email is invalid';
            } else {
                validator.email = null;
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let response;
        if (id) {
            console.log(formData);
            response = await api.__update(`/user/update/${id}`, formData, (msg) => {
                showSnackbarMessage(msg, 'error');
            });
        } else {
            response = await api.__post('/user', formData, (msg) => {
                showSnackbarMessage(msg, 'error');
            });
        }

        if (response) {
            if (response.success) {
                const msg = id ? 'User updated successfully!' : 'User added successfully!';
                showSnackbarMessage(msg, 'success');
                navigate('/dashboard/user')
            } else {
                setValidator(response && response.data)
            }
        }
    };

    const getUser = async () => {
        const response = await api.__get(`/user/${id}`, null, (msg) => {
            showSnackbarMessage(msg, 'error');
        });
        if (response) {
            setFormData({
                name: response.data.name,
                lastname: response.data.lastname,
                email: response.data.email,
                role_id: response.data.role_id,
                password: response.data.password,
                c_password: response.data.password
            })
        }
    }

    const getRoles = async () => {
        const response = await api.__get(`/roles`, null, (msg) => {
            showSnackbarMessage(msg, 'error');
        });
        if (response) {
            setRoles(response.data);
        }
    }

    useEffect(() => {
        getRoles()
        if (id) {
            getUser();
        }
    }, [])

    return (
        <>
            <Helmet>
                <title> {id ? 'User edit' : 'Create User'} | { PROYECT_CONFIG.NAME } </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="left" justifyContent="space-between" mb={5}>
                    <Stack>
                        <BackButton path="/dashboard/user"/>
                    </Stack>
                    <Typography variant="h4" gutterBottom>
                        {id ? 'User edit' : 'Create User'}
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
                            name="lastname"
                            label="Lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            error={validator.lastname && true}
                            helperText={validator.lastname}
                        />
                        <TextField
                            name="email"
                            label="Email"
                            value={formData.email}
                            onChange={handleChange}
                            error={validator.email && true}
                            helperText={validator.email}
                        />
                        <FormControl fullWidth>
                            <InputLabel id="role-select-label">Role</InputLabel>
                            <Select
                                name="role_id"
                                labelId="role-select-label"
                                id="role-select"
                                value={formData.role_id}
                                label="Role"
                                onChange={handleChange}
                            >
                                {roles.map((rol) => {
                                    return (
                                        <MenuItem key={rol.id} value={rol.id}>{rol.name}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                        <TextField
                            name="password"
                            label="Password"
                            value={formData.password}
                            type={showPassword ? 'text' : 'password'}
                            onChange={handleChange}
                            error={validator.password && true}
                            helperText={validator.password}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                            <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}/>
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            name="c_password"
                            label="Confirm Password"
                            value={formData.c_password}
                            type={showPassword ? 'text' : 'password'}
                            onChange={handleChange}
                            error={validator.c_password && true}
                            helperText={validator.c_password}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                            <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}/>
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Stack>
                </Card>
                <Stack>
                    <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit}>
                        Save
                    </LoadingButton>
                </Stack>
            </Container>
        </>
    );
}

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
    TextField, InputAdornment,
} from '@mui/material';
import {LoadingButton} from "@mui/lab";
import Iconify from "../../components/iconify";
import BackButton from "../../sections/@dashboard/app/AppBackButton";
import useApiHandlerStore from "../../zustand/useApiHandlerStore";
import useGlobalMessageStore from "../../zustand/useGlobalMessageStore";


// ----------------------------------------------------------------------

export default function CreateUserPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const {api} = useApiHandlerStore((state) => state)
    const { showMessage } = useGlobalMessageStore((state) => state)
    const [validator, setValidator] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: '',
        password: '',
        c_password: ''
    });
    const [cpasword, setCPassword] = useState('')

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
            response = await api.__update(`/user/${id}`, formData, (msg) => {
                showMessage({
                    openAlert: false,
                    openSnackbar: true,
                    message: msg,
                    type: 'error'
                })
            });
        } else {
            response = await api.__post('/user', formData, (msg) => {
                showMessage({
                    openAlert: false,
                    openSnackbar: true,
                    message: msg,
                    type: 'error'
                })
            });
        }

        if (response) {
            if (response.success) {
                showMessage({
                    openAlert: false,
                    openSnackbar: true,
                    message: 'Added a new user',
                    type: 'success'
                })
                navigate('/dashboard/user')
            } else {
                setValidator(response && response.data)
            }
        }
    };

    const getUser = async () => {
        const response = await api.__get(`/user/${id}`, null, (msg) => {
            showMessage({
                openAlert: false,
                openSnackbar: true,
                message: msg,
                type: 'error'
            })
        });
        if (response) {
            response.data.c_password = response.data.password
            setFormData(response.data)
            console.log(response)
        }
    }

    useEffect(() => {
        getUser()
    }, [])

    return (
        <>
            <Helmet>
                <title> { id ? 'User edit' : 'Create User' }  | EScreens </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="left" justifyContent="space-between" mb={5}>
                    <Stack>
                        <BackButton path="/dashboard/user"/>
                    </Stack>
                    <Typography variant="h4" gutterBottom>
                        { id ? 'User edit' : 'Create User' }
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

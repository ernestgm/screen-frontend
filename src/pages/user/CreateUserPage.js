import {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
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
    const navigate = useNavigate();
    const {api} = useApiHandlerStore((state) => state)
  const { showMessage } = useGlobalMessageStore((state) => state)
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: '',
        password: '',
        c_password: ''
    });

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));

        if (name === 'email') {
            if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
                errors.email = 'The Email is invalid';
            } else {
                errors.email = null;
            }
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();


        const response = await api.__post('/user', formData)
            .then(data => data.json());

        if (response.success) {
            showMessage({
                openAlert: false,
                openSnackbar: true,
                message: 'Added a new user',
                type: 'success'
            })
            navigate('/dashboard/user')
        } else {
            setErrors(response.data)
        }
    };

    return (
        <>
            <Helmet>
                <title> Create User | EScreens </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="left" justifyContent="space-between" mb={5}>
                    <Stack>
                        <BackButton path="/dashboard/user"/>
                    </Stack>
                    <Typography variant="h4" gutterBottom>
                        New User
                    </Typography>
                </Stack>
                <Card>
                    <Stack spacing={3} justifyContent="space-between" mb={5} sx={{my: 2}}>
                        <TextField
                            name="name"
                            error={errors.name && true}
                            value={formData.name}
                            onChange={handleChange}
                            label="Name"
                            helperText={errors.name}
                        />
                        <TextField
                            name="lastname"
                            label="Lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            error={errors.lastname && true}
                            helperText={errors.lastname}
                        />
                        <TextField
                            name="email"
                            label="Email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email && true}
                            helperText={errors.email}
                        />
                        <TextField
                            name="password"
                            label="Password"
                            value={formData.password}
                            type={showPassword ? 'text' : 'password'}
                            onChange={handleChange}
                            error={errors.password && true}
                            helperText={errors.password}
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
                            error={errors.c_password && true}
                            helperText={errors.c_password}
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

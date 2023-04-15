import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
// @mui
import {Link, Stack, IconButton, InputAdornment, TextField, Checkbox} from '@mui/material';
import {LoadingButton} from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import useAuthStore from '../../../zustand/useAuthStore';
import useApiHandlerStore from "../../../zustand/useApiHandlerStore";
import useGlobalMessageStore from "../../../zustand/useGlobalMessageStore";
// ----------------------------------------------------------------------

export default function LoginForm() {
    const navigate = useNavigate();
    const {setCurrentUser} = useAuthStore((state) => state);

    const [showPassword, setShowPassword] = useState(false);
    const {api} = useApiHandlerStore((state) => state)
    const {showMessage} = useGlobalMessageStore((state) => state)
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const handleClick = async (e) => {
        e.preventDefault();

        const formData = {
            'email': email,
            'password': password
        }

        const userData = await api.__post('/login', formData, (msg) => {
            showMessage({
                openAlert: false,
                openSnackbar: true,
                message: msg,
                type: 'error'
            })
        });

        if (userData) {
            setCurrentUser(userData.success)
            navigate('/', {replace: true});
        }
    };

    return (
        <>
            <Stack spacing={3}>
                <TextField
                    name="email"
                    label="Email address"
                    onChange={e => setEmail(e.target.value)}
                />

                <TextField
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    onChange={e => setPassword(e.target.value)}
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

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{my: 2}}>
                <Checkbox name="remember" label="Remember me"/>
                <Link variant="subtitle2" underline="hover">
                    Forgot password?
                </Link>
            </Stack>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
                Login
            </LoadingButton>
        </>
    );
}

import {useState} from 'react';
// @mui
import {Stack, IconButton, InputAdornment, TextField, Divider} from '@mui/material';
import {LoadingButton} from '@mui/lab';
// table
import Iconify from '../../../components/iconify';
import useAuthStore from '../../../zustand/useAuthStore';
import useApiHandlerStore from "../../../zustand/useApiHandlerStore";
import useMessagesSnackbar from "../../../hooks/messages/useMessagesSnackbar";
import useNavigateTo from "../../../hooks/navigateTo";
import useLocationStore from "../../../zustand/useLocationStore";
// ----------------------------------------------------------------------

export default function LoginForm() {
    const {navigateTo} = useNavigateTo();
    const {setCurrentUser} = useAuthStore((state) => state);
    const { currentLocation } = useLocationStore((state) => state)

    const [showPassword, setShowPassword] = useState(false);
    const {api} = useApiHandlerStore((state) => state)
    const showSnackbarMessage = useMessagesSnackbar();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const handleClick = async (e) => {
        e.preventDefault();

        const formData = {
            'email': email,
            'password': password
        }

        const userData = await api.__post('/login', formData, (msg) => {
            showSnackbarMessage(msg, 'error');
        }, () => { handleClick(e) });

        if (userData) {
            setCurrentUser(userData.success)
            if (currentLocation !== "/") {
                navigateTo(currentLocation);
            } else {
                navigateTo('/');
            }
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

            {/* <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{my: 2}}> */}
            {/*    <Checkbox name="remember" label="Remember me"/> */}
            {/*    <Link variant="subtitle2" underline="hover"> */}
            {/*        Forgot password? */}
            {/*    </Link> */}
            {/* </Stack> */}

            <Divider sx={{ my: 3 }}/>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
                Login
            </LoadingButton>
        </>
    );
}

import { useState, } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
// mocks_
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../zustand/useAuthStore';
import useApiHandlerStore from "../../../zustand/useApiHandlerStore";
import useAccontHandlerStore from "../../../zustand/useAccontHandlerStore";
import useGlobalMessageStore from "../../../zustand/useGlobalMessageStore";

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    tag: 'home',
    icon: 'eva:home-fill',
  },
  {
    label: 'Profile',
    tag: 'profile',
    icon: 'eva:person-fill',
  },
  {
    label: 'Settings',
    tag: 'setting',
    icon: 'eva:settings-2-fill',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const { resetCurrentUser, userAccount } = useAuthStore((state) => state);
  const { account } = useAccontHandlerStore((state) => state);
  const {api} = useApiHandlerStore((state) => state)
  const {showMessage} = useGlobalMessageStore((state) => state)


  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = (e) => {
    console.log(e)
    setOpen(null);
  };



  const handleLogout = async (e) => {
    e.preventDefault()
    const response = await api.__post('/logout', null, (msg) => {
      showMessage({
        openAlert: false,
        openSnackbar: true,
        message: msg,
        type: 'error'
      })
    });
    if (response) {
      setOpen(null);
      resetCurrentUser();
      navigate('/');
    }
  };

  const handleListItemClick = async (tag) => {
    if (tag === 'home') {
      userAccount()
      const response = await api.__get('/users');
      console.log(response)
    }
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {account.displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {account.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem
                key={option.label}
                onClick={() => handleListItemClick(option.tag)}
            >
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}

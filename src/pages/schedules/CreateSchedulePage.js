import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import { filter } from 'lodash';
// @mui
import { Helmet } from 'react-helmet-async';
import {
  Card,
  Stack,
  MenuItem,
  Container,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Switch,
  Divider,
} from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../components/iconify';
import BackButton from '../../sections/@dashboard/app/AppBackButton';
import useApiHandlerStore from '../../zustand/useApiHandlerStore';
import useMessagesSnackbar from '../../hooks/messages/useMessagesSnackbar';
import PROJECT_CONFIG from '../../config/config';
import useNavigateTo from '../../hooks/navigateTo';
import useAuthStore from '../../zustand/useAuthStore';
import useMessagesAlert from '../../hooks/messages/useMessagesAlert';

// ----------------------------------------------------------------------

const NAME_PAGE = 'Schedule';
const URL_UPDATE = PROJECT_CONFIG.API_CONFIG.SCHEDULES.UPDATE;
const URL_CREATE = PROJECT_CONFIG.API_CONFIG.SCHEDULES.CREATE;
const URL_TABLES_PAGE = '/dashboard/schedules';
const URL_GET_ITEM_FOR_UPDATE = PROJECT_CONFIG.API_CONFIG.SCHEDULES.GET;
const ADMIN_TAG = PROJECT_CONFIG.API_CONFIG.ROLES.ADMIN;
const SCREENS_URL_GET_DATA = PROJECT_CONFIG.API_CONFIG.SCREEN.ALL;
const MARQUEES_URL_GET_DATA = PROJECT_CONFIG.API_CONFIG.MARQUEE.ALL;
const DEVICE_URL_GET_DATA = PROJECT_CONFIG.API_CONFIG.DEVICE.ALL;

export default function CreateSchedulePage() {
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState([]);
  const [screens, setScreens] = useState([]);
  const [marquees, setMarquees] = useState([]);
  const schedulesType = ['screen', 'marquee', 'all'];

  const { id } = useParams();
  const { navigateTo } = useNavigateTo();
  const { currentUser } = useAuthStore((state) => state);
  const { api } = useApiHandlerStore((state) => state);
  const showMessageAlert = useMessagesAlert();
  const showMessageSnackbar = useMessagesSnackbar();

  const [validator, setValidator] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    device_id: '',
    screen_id: '',
    marquee_id: '',
    start_time: '',
    end_time: '',
    schedule_type: '',
    enabled: 1,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    if (name === 'enabled') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        enabled: formData.enabled === 0 ? 1 : 0,
      }));
    }
  };

  const handleStartTimeChange = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      start_time: value.format('HH:mm'),
    }));
  };

  const handleEndTimeChange = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      end_time: value.format('HH:mm'),
    }));
  };

  const getDevices = async () => {
    const response = await api.__get(
      `${DEVICE_URL_GET_DATA}`,
      (msg) => {
        showMessageSnackbar(msg, 'error');
      },
      () => {
        getDevices();
      }
    );

    if (response !== undefined && response.data) {
      if (currentUser && currentUser.user.role.tag === PROJECT_CONFIG.API_CONFIG.ROLES.ADMIN) {
        setDevices(Object.values(response.data));
      } else {
        const filteredDevices = filter(response.data, (_device) => _device.user_id === currentUser.user.id);
        console.log(filteredDevices);
        setDevices(filteredDevices);
      }
    }
  };

  const getScreens = async () => {
    const response = await api.__get(
      SCREENS_URL_GET_DATA,
      (msg) => {
        showMessageSnackbar(msg, 'error');
      },
      () => {
        getScreens();
      }
    );

    if (response !== undefined && response.data) {
      if (currentUser && currentUser.user.role.tag === ADMIN_TAG) {
        setScreens(Object.values(response.data));
      } else {
        const filteredScreen = filter(screens, (_screen) => _screen.business.user_id === id);
        setScreens(filteredScreen);
      }
    }
  };

  const getMarquees = async () => {
    const response = await api.__get(
      MARQUEES_URL_GET_DATA,
      (msg) => {
        showMessageSnackbar(msg, 'error');
      },
      () => {
        getScreens();
      }
    );

    if (response !== undefined && response.data) {
      if (currentUser && currentUser.user.role.tag === PROJECT_CONFIG.API_CONFIG.ROLES.ADMIN) {
        setMarquees(Object.values(response.data));
      } else {
        const filteredMarquee = filter(marquees, (_marquee) => _marquee.business.user_id === id);
        setMarquees(filteredMarquee);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);

    let response;
    if (id) {
      response = await api.__update(
        `${URL_UPDATE}${id}`,
        formData,
        (msg) => {
          showMessageSnackbar(msg, 'error');
        },
        () => {
          handleSubmit(e);
        },
        (isLoading) => {
          setLoading(isLoading);
        }
      );
    } else {
      response = await api.__post(
        URL_CREATE,
        formData,
        (msg) => {
          showMessageSnackbar(msg, 'error');
        },
        () => {
          handleSubmit(e);
        },
        (isLoading) => {
          setLoading(isLoading);
        }
      );
    }

    if (response) {
      if (response.success) {
        const msg = id ? `${NAME_PAGE} updated successfully!` : `${NAME_PAGE} added successfully!`;
        showMessageSnackbar(msg, 'success');
        navigateTo(URL_TABLES_PAGE);
      } else {
        setValidator(response.data && response.data);
      }
    }
  };

  const getItemForUpdate = async () => {
    const response = await api.__get(
      `${URL_GET_ITEM_FOR_UPDATE}${id}`,
      (msg) => {
        showMessageSnackbar(msg, 'error');
      },
      () => {
        getItemForUpdate();
      }
    );

    if (response.data) {
      setFormData({
        name: response.data.name,
        device_id: response.data.device_id,
        screen_id: response.data.screen_id,
        marquee_id: response.data.marquee_id,
        start_time: response.data.start_time,
        end_time: response.data.end_time,
        schedule_type: response.data.schedule_type,
        enabled: response.data.enabled,
      });
    }
  };

  useEffect(() => {
    getDevices();
    getScreens();
    getMarquees();
    if (id) {
      getItemForUpdate();
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>
          {' '}
          {id ? `${NAME_PAGE} edit` : `Create ${NAME_PAGE}`} | {PROJECT_CONFIG.NAME}{' '}
        </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="left" justifyContent="space-between" mb={5}>
          <Stack>
            <BackButton path={URL_TABLES_PAGE} />
          </Stack>
          <Typography variant="h4" gutterBottom>
            {id ? `${NAME_PAGE} edit` : `Create ${NAME_PAGE}`}
          </Typography>
        </Stack>
        <Card>
          <Stack spacing={3} justifyContent="space-between" sx={{ m: 2 }}>
            <TextField
              name="name"
              error={validator.name && true}
              value={formData.name ?? ''}
              onChange={handleChange}
              label="Name"
              helperText={validator.name}
            />
            <FormControl fullWidth error={validator.schedule_type && true} helperText={validator.schedule_type}>
              <InputLabel id="type-select-label">Select Schedule Type</InputLabel>
              <Select
                name="schedule_type"
                labelId="type-select-label"
                id="type-select"
                value={formData.schedule_type ?? ''}
                label="Select Schedule Type"
                onChange={handleChange}
                variant="outlined"
              >
                {schedulesType.map((type) => {
                  return (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl fullWidth error={validator.device_id && true} helperText={validator.device_id}>
              <InputLabel id="role-select-label">Select Device</InputLabel>
              <Select
                name="device_id"
                labelId="device-select-label"
                id="device-select"
                value={formData.device_id ?? ''}
                label="Select Device"
                onChange={handleChange}
                variant="outlined"
              >
                {devices.map((device) => {
                  return (
                    <MenuItem key={device.id} value={device.id}>
                      {device.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl fullWidth error={validator.screen_id && true} helperText={validator.screen_id}>
              <InputLabel id="screen-select-label">Select Screen</InputLabel>
              <Select
                name="screen_id"
                labelId="screen-select-label"
                id="screen-select"
                value={formData.screen_id ?? ''}
                label="Select Device"
                onChange={handleChange}
                disabled={formData && formData.schedule_type === 'marquee'}
                variant="outlined"
              >
                {screens.map((screen) => {
                  return (
                    <MenuItem key={screen.id} value={screen.id}>
                      {screen.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl fullWidth error={validator.marquee_id && true} helperText={validator.marquee_id}>
              <InputLabel id="marquee-select-label">Select Marquee</InputLabel>
              <Select
                name="marquee_id"
                labelId="marquee-select-label"
                id="marquee-select"
                value={formData.marquee_id ?? ''}
                label="Select Device"
                onChange={handleChange}
                disabled={formData && formData.schedule_type === 'screen'}
                variant="outlined"
              >
                {marquees.map((marquee) => {
                  return (
                    <MenuItem key={marquee.id} value={marquee.id}>
                      {marquee.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <Stack
              direction="row"
              spacing={3}
              alignItems="center"
              divider={<Divider orientation="vertical" flexItem />}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack direction="row" spacing={3} alignItems="center">
                  <TimePicker
                    value={dayjs(`2018-04-04T${formData.start_time}`)}
                    name="start_time"
                    minutesStep={15}
                    label="Start Time"
                    onChange={handleStartTimeChange}
                  />
                  <TimePicker
                    value={dayjs(`2018-04-04T${formData.end_time}`)}
                    name="end_time"
                    minutesStep={15}
                    label="End Time"
                    onChange={handleEndTimeChange}
                  />
                </Stack>
              </LocalizationProvider>

              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Typography>Disabled</Typography>
                <Switch name="enabled" checked={formData.enabled === 1} onChange={handleChange} />
                <Typography>Enabled</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Card>
        <Stack sx={{ m: 2 }}>
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

import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
// @mui
import {Helmet} from 'react-helmet-async';
import {
  Card,
  Stack,
  Checkbox,
  Container,
  Typography,
  TextField, FormControlLabel, Paper, Grid, CardMedia, CardContent, Box, Divider, Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import imageCompression from "browser-image-compression";
import { LoadingButton } from '@mui/lab';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import BackButton from "../../sections/@dashboard/app/AppBackButton";
import useApiHandlerStore from "../../zustand/useApiHandlerStore";
import useMessagesSnackbar from "../../hooks/messages/useMessagesSnackbar";
import PROJECT_CONFIG from "../../config/config";
import useNavigateTo from '../../hooks/navigateTo';
import { UploadImages } from '../../components/save-media/UploadImages';
import { SaveImage } from '../../components/save-media';
import Iconify from '../../components/iconify';
import positions from '../../_mock/positions';
import UploadVideo from '../../components/save-media/UploadVideo';


// ----------------------------------------------------------------------

const NAME_PAGE = 'Video';
const URL_UPDATE = PROJECT_CONFIG.API_CONFIG.VIDEO.UPDATE;
const URL_CREATE = PROJECT_CONFIG.API_CONFIG.VIDEO.CREATE;
const URL_BACK = '/dashboard/slides/details/';
const URL_GET_ITEM_FOR_UPDATE = PROJECT_CONFIG.API_CONFIG.VIDEO.GET;

export default function UploadVideoPage() {
    const showSnackbarMessage = useMessagesSnackbar();
    const {pscreen, pvideo } = useParams();
    const {navigateTo} = useNavigateTo();
    const {api} = useApiHandlerStore((state) => state);
    const [validator, setValidator] = useState({});
    const [preview, setPreview] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        description_position: 'bc',
        qr_info: '',
        is_static: 1,
        duration: 5,
        screen_id: pscreen,
        image: '',
        video: null
    });
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleChange = (event) => {
        const {name, value} = event.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleUploadImage = async (file) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            video: file
        }));
        const videoUrl = URL.createObjectURL(file);
        setPreview(videoUrl)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fd = new FormData();
        fd.append("video", formData.video);
        fd.append("screen_id", formData.screen_id);

        let response;
        if (pvideo) {
          if (formData.video) {
            response = await api.__post(`${URL_UPDATE}${pvideo}`, fd, (msg) => {
              showSnackbarMessage(msg, 'error');
            }, () => { handleSubmit(e) },
              ( isLoading ) => { setLoading(isLoading) });
          } else {
            navigateTo(`${URL_BACK}${pscreen}`)
          }
        } else {
            response = await api.__post(URL_CREATE, fd, (msg) => {
                showSnackbarMessage(msg, 'error');
            }, () => { handleSubmit(e) }, ( isLoading ) => { setLoading(isLoading) });
        }

        if (response) {
            if (response.success) {
                const msg = pvideo ? `${NAME_PAGE} updated successfully!` : `${NAME_PAGE} added successfully!`;
                showSnackbarMessage(msg, 'success');
                navigateTo(`${URL_BACK}${pscreen}`)
            } else {
                setValidator(response.data && response.data)
            }
        }
    };

    const getItemForUpdate = async () => {
        const response = await api.__get(`${URL_GET_ITEM_FOR_UPDATE}${pvideo}`, (msg) => {
            showSnackbarMessage(msg, 'error');
        }, () => { getItemForUpdate() });

        if (response !== undefined && response.data) {
            setFormData({
                name: response.data.name,
                description: response.data.description,
                description_position: response.data.description_position,
                qr_info: response.data.qr_info,
                screen_id: pscreen,
                is_static: response.data.is_static,
                duration: response.data.duration,
                image: response.data.image,
                video: null,
            });
            setPreview(response.data.video)
        }
    }

    useEffect(() => {
        if (pvideo) {
            getItemForUpdate();
        }
    }, [])

    return (
      <>
        <Helmet>
          <title>
            {' '}
            {pvideo ? `${NAME_PAGE} edit` : `Upload ${NAME_PAGE}`} | {PROJECT_CONFIG.NAME}{' '}
          </title>
        </Helmet>

        <Container>
          <Stack direction="row" alignItems="left" justifyContent="space-between" mb={5}>
            <Stack>
              <BackButton path={`${URL_BACK}${pscreen}`} />
            </Stack>
            <Typography variant="h4" gutterBottom>
              {pvideo ? `${NAME_PAGE} Edit` : `Upload ${NAME_PAGE}`}
            </Typography>
          </Stack>
          <Grid container spacing={2} mb={5}>
            <Grid item xs={12} sm={6} md={6}>
              <Card>
                <Stack spacing={3} justifyContent="space-between" sx={{ m: 2 }}>
                  <TextField
                    name="name"
                    error={validator.name && true}
                    value={formData.name}
                    onChange={handleChange}
                    label="Name"
                    helperText={validator.name}
                    disabled
                  />
                  {!loading && (<UploadVideo onChange={handleUploadImage} />)}
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Card sx={{ display: 'flex', p: 2 }}>
                <Stack>
                  <Typography component="div" variant="h5">
                    Preview Video
                  </Typography>
                  <Divider />
                  <video src={preview} controls style={{ width: '100%', maxWidth: '100%', borderRadius: '8px' }}>
                    <track kind="captions" src="" label="No captions available" />
                    Your browser does not support the video tag.
                  </video>
                </Stack>
              </Card>
            </Grid>
          </Grid>

          <Stack sx={{ m: 2 }} spacing={2}>
            {validator.video && (
              <Alert severity="error" onClose={() => {setValidator({})}}>{validator.video && validator.video[0]}</Alert>
            )}
            <LoadingButton
              color="secondary"
              onClick={handleSubmit}
              loading={loading}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
            >
              {loading ? (<span>Uploading Video. Don't refresh the browser.</span>) : (<span>Save</span>)}
            </LoadingButton>
          </Stack>
        </Container>
      </>
    );
}

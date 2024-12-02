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
  TextField, FormControlLabel, Paper,
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


// ----------------------------------------------------------------------

const NAME_PAGE = 'Images';
const URL_UPDATE = PROJECT_CONFIG.API_CONFIG.IMAGE.UPDATE;
const URL_CREATE = PROJECT_CONFIG.API_CONFIG.IMAGE.CREATE;
const URL_BACK = '/dashboard/slides/details/';
const URL_GET_ITEM_FOR_UPDATE = PROJECT_CONFIG.API_CONFIG.IMAGE.GET;

const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
};

export default function UploadImagePage() {
    const showSnackbarMessage = useMessagesSnackbar();
    const {pscreen, pimage } = useParams();
    const {navigateTo} = useNavigateTo();
    const {api} = useApiHandlerStore((state) => state);
    const [validator, setValidator] = useState({});
    const [preview, setPreview] = useState("");
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        description_position: 'bc',
        qr_info: '',
        is_static: 1,
        duration: 5,
        screen_id: pscreen,
        image: '',
        images: []
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const {name, value} = event.target;

        console.log(name)

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

  const handlePositionChange = (event, newAlignment) => {
    console.log(newAlignment)
    setFormData((prevFormData) => ({
      ...prevFormData,
      description_position: newAlignment
    }));
  };

  const control = {
    value: formData.description_position ? formData.description_position : 'bc',
    onChange: handlePositionChange,
    exclusive: true,
  };

    const showPreview = (base64) => {
        setPreview(base64)
    }

    const handleUploadImage = async (images) => {
        const imagesList = [];

        setLoading(true)
        images.map(async (img, index) => {
            if (img.file) {
                let imageBase64 = ""
                try {
                    const compressedFile = await imageCompression(img.file, options);
                    imageBase64 = await convertToBase64(compressedFile)
                    imagesList[index] = { name: img.file.name, data: imageBase64 }
                } catch (error) {
                    console.error('Error al comprimir la imagen:', error);
                }
            }
        })
        setFormData((prevFormData) => ({
            ...prevFormData,
            images: imagesList
        }));
        setLoading(false)
    }

    const handleUpdateImage = async (images) => {
        let imageBase64 = ""
        if (images) {
            try {
                setLoading(true)
                const compressedFile = await imageCompression(images, options);
                setLoading(false)
                imageBase64 = await convertToBase64(compressedFile)
                setLoading(false)

                setFormData((prevFormData) => ({
                    ...prevFormData,
                    image: imageBase64
                }));
            } catch (error) {
                setLoading(false)
                console.error('Error al comprimir la imagen:', error);
            }
        }
    }

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onprogress = () => setLoading(true)
            reader.onload = () => {
                setLoading(false)
                resolve(reader.result)
            };
            reader.onerror = (error) => {
                setLoading(false)
                reject(error);
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let response;
        if (pimage) {
            response = await api.__post(`${URL_UPDATE}${pimage}`, formData, (msg) => {
                showSnackbarMessage(msg, 'error');
            }, () => { handleSubmit(e) }, ( isLoading ) => { setLoading(isLoading) });
        } else {
            response = await api.__post(URL_CREATE, formData, (msg) => {
                showSnackbarMessage(msg, 'error');
            }, () => { handleSubmit(e) }, ( isLoading ) => { setLoading(isLoading) });
        }

        if (response) {
            if (response.success) {
                const msg = pimage ? `${NAME_PAGE} updated successfully!` : `${NAME_PAGE} added successfully!`;
                showSnackbarMessage(msg, 'success');
                navigateTo(`${URL_BACK}${pscreen}`)
            } else {
                setValidator(response.data && response.data)
            }
        }
    };

    const getItemForUpdate = async () => {
        const response = await api.__get(`${URL_GET_ITEM_FOR_UPDATE}${pimage}`, (msg) => {
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
            });
            setPreview(response.data.image)
        }
    }

    useEffect(() => {
        if (pimage) {
            getItemForUpdate();
        }
    }, [])

    return (
        <>
            <Helmet>
                <title> {pimage ? `${NAME_PAGE} edit` : `Upload ${NAME_PAGE}`} | {PROJECT_CONFIG.NAME} </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="left" justifyContent="space-between" mb={5}>
                    <Stack>
                        <BackButton path={`${URL_BACK}${pscreen}`}/>
                    </Stack>
                    <Typography variant="h4" gutterBottom>
                        {pimage ? `${NAME_PAGE} Edit` : `Upload ${NAME_PAGE}`}
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
                            disabled
                        />
                        <TextField
                            name="description"
                            label="Description"
                            value={formData.description ?? ''}
                            onChange={handleChange}
                            error={validator.description && true}
                            helperText={validator.description}
                            disabled={!pimage}
                        />
                      { pimage && (
                      <Stack direction="row" alignItems="center" spacing={3} sx={{m: 2}}>
                        <Typography variant="body1" gutterBottom>
                          Description Position
                        </Typography>
                      <Paper
                        elevation={0}
                        sx={(theme) => ({
                          display: 'flex',
                          border: `1px solid ${theme.palette.divider}`,
                          flexWrap: 'wrap',
                        })}
                      >
                        <ToggleButtonGroup size="small" {...control} aria-label="Small sizes">
                          { positions.map((pos) => (
                            <ToggleButton value={pos.id} key={pos.id}>
                              <Iconify width="35px" icon={pos.icon}/>
                            </ToggleButton>
                          )) }
                        </ToggleButtonGroup>
                      </Paper>
                      </Stack>
                        )}
                        <TextField
                          name="qr_info"
                          label="QR Info"
                          value={formData.qr_info ?? ''}
                          onChange={handleChange}
                          error={validator.qr_info && true}
                          helperText={validator.qr_info}
                          disabled={!pimage}
                        />

                        <TextField
                            name="duration"
                            label="Duration (5s by default)"
                            value={formData.duration ?? ''}
                            onChange={handleChange}
                            error={validator.duration && true}
                            helperText={validator.duration}
                        />

                        {pimage ? (
                          <SaveImage onChange={handleUpdateImage} updatePreview={showPreview} previewImage={preview}/>
                        ) : (
                          <UploadImages onChange={handleUploadImage} />
                        )}
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

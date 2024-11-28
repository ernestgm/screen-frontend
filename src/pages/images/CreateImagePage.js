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
    TextField, FormControlLabel,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import imageCompression from "browser-image-compression";
import {LoadingButton} from "@mui/lab";
import BackButton from "../../sections/@dashboard/app/AppBackButton";
import useApiHandlerStore from "../../zustand/useApiHandlerStore";
import useMessagesSnackbar from "../../hooks/messages/useMessagesSnackbar";
import PROJECT_CONFIG from "../../config/config";
import useNavigateTo from '../../hooks/navigateTo';
import { UploadImages } from '../../components/save-image/UploadImages';

// ----------------------------------------------------------------------

const NAME_PAGE = 'Images';
const URL_UPDATE = PROJECT_CONFIG.API_CONFIG.IMAGE.UPDATE;
const URL_CREATE = PROJECT_CONFIG.API_CONFIG.IMAGE.CREATE;
const URL_BACK = '/dashboard/screen/details/';
const URL_GET_ITEM_FOR_UPDATE = PROJECT_CONFIG.API_CONFIG.IMAGE.GET;

export default function CreateImagePage() {
    const showSnackbarMessage = useMessagesSnackbar();
    const {pscreen, pimage } = useParams();
    const {navigateTo} = useNavigateTo();
    const {api} = useApiHandlerStore((state) => state);
    const [validator, setValidator] = useState({});
    const [preview, setPreview] = useState("");
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        is_static: 1,
        duration: 5,
        screen_id: pscreen,
        image: '',
        images: []
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const {name, value} = event.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleUploadImage = async (images) => {
        const imagesList = [];
        const options = {
            maxSizeMB: 1, // Tamaño máximo en MB
            maxWidthOrHeight: 1920, // Máxima altura o ancho
            useWebWorker: true,
        };
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
                <title> {pimage ? `${NAME_PAGE} edit` : `Create ${NAME_PAGE}`} | {PROJECT_CONFIG.NAME} </title>
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

                        <TextField
                            name="duration"
                            label="Duration (5s by default)"
                            value={formData.duration ?? ''}
                            onChange={handleChange}
                            error={validator.duration && true}
                            helperText={validator.duration}
                        />

                        {pimage ? (
                          <div>
                              <h4>Preview:</h4>
                              <img src={preview} alt="Imagen subida" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                          </div>
                        ) : (
                          <UploadImages onChange={handleUploadImage} />
                        )}

                        {/* <SaveImage onChange={handleUploadImage} updatePreview={showPreview} previewImage={preview}/> */}
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

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
import {LoadingButton} from "@mui/lab";
import BackButton from "../../sections/@dashboard/app/AppBackButton";
import useApiHandlerStore from "../../zustand/useApiHandlerStore";
import useMessagesSnackbar from "../../hooks/messages/useMessagesSnackbar";
import PROYECT_CONFIG from "../../config/config";
import ProductsDataTable from "./table/ProductsDataTable";
import {SaveImage} from "../../components/save-image";
import useNavigateTo from "../../hooks/navigateTo";

// ----------------------------------------------------------------------

const NAME_PAGE = 'Image';
const URL_UPDATE = PROYECT_CONFIG.API_CONFIG.IMAGE.UPDATE;
const URL_CREATE = PROYECT_CONFIG.API_CONFIG.IMAGE.CREATE;
const URL_BACK = '/dashboard/screen/details/';
const URL_GET_ITEM_FOR_UPDATE = PROYECT_CONFIG.API_CONFIG.IMAGE.GET;

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
        // products: []
    });

    const handleChange = (event) => {
        const {name, value} = event.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));

        if (name === "is_static") {
            setFormData((prevFormData) => ({
                ...prevFormData,
                "is_static": formData.is_static === 0 ? 1 : 0,
            }));
        }
    };

    const showPreview = (base64) => {
        setPreview(base64)
    }
    const handleUploadImage = (images) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            image: images
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let postData

        if (formData.image instanceof File) {
            postData = new FormData();
            postData.append('name', formData.name);
            postData.append('description', formData.description);
            postData.append('is_static', formData.is_static);
            postData.append('duration', formData.duration);
            postData.append('screen_id', formData.screen_id);
            postData.append('image', formData.image);
            // const productsJson = JSON.stringify(formData.products);
            // postData.append('products', productsJson);
        } else {
            postData = formData;
        }



        let response;
        if (pimage) {
            response = await api.__post(`${URL_UPDATE}${pimage}`, postData, (msg) => {
                showSnackbarMessage(msg, 'error');
            }, () => { handleSubmit(e) });
        } else {
            response = await api.__post(URL_CREATE, postData, (msg) => {
                showSnackbarMessage(msg, 'error');
            }, () => { handleSubmit(e) });
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

        if (response.data) {
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

    const updateListProducts = (items) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            products: items,
        }));
    }

    useEffect(() => {
        if (pimage) {
            getItemForUpdate();
        }
    }, [])

    return (
        <>
            <Helmet>
                <title> {pimage ? `${NAME_PAGE} edit` : `Create ${NAME_PAGE}`} | {PROYECT_CONFIG.NAME} </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="left" justifyContent="space-between" mb={5}>
                    <Stack>
                        <BackButton path={`${URL_BACK}${pscreen}`}/>
                    </Stack>
                    <Typography variant="h4" gutterBottom>
                        {pimage ? `${NAME_PAGE} edit` : `Create ${NAME_PAGE}`}
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
                        />
                        <TextField
                            name="description"
                            label="Description"
                            value={formData.description ?? ''}
                            onChange={handleChange}
                            error={validator.description && true}
                            helperText={validator.description}
                        />

                        <TextField
                            name="duration"
                            label="Duration (5s by default)"
                            value={formData.duration ?? ''}
                            onChange={handleChange}
                            error={validator.duration && true}
                            helperText={validator.duration}
                        />

                        {/* <FormControlLabel */}
                        {/*    control={<Checkbox name="is_static" checked={formData.is_static === 1} onChange={handleChange} />} */}
                        {/*    label="Solo imagen" */}
                        {/*    sx={{ flexGrow: 1, m: 0 }} */}
                        {/* /> */}

                        <SaveImage onChange={handleUploadImage} updatePreview={showPreview} previewImage={preview}/>
                    </Stack>

                    <Stack sx={{m: 2}}>
                        {/* <ProductsDataTable image={pimage} saveLocalProducts={updateListProducts}/> */}
                    </Stack>
                </Card>
                <Stack sx={{m: 2}}>
                    <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit}>
                        {`Save ${NAME_PAGE}`}
                    </LoadingButton>
                </Stack>
            </Container>
        </>
    );
}

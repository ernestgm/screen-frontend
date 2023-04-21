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
    TextField, InputAdornment, FormControl, InputLabel, Select, Grid,
} from '@mui/material';
import {LoadingButton} from "@mui/lab";
import {faker} from "@faker-js/faker";
import Iconify from "../../components/iconify";
import BackButton from "../../sections/@dashboard/app/AppBackButton";
import useApiHandlerStore from "../../zustand/useApiHandlerStore";
import useMessagesSnackbar from "../../hooks/messages/useMessagesSnackbar";
import PROYECT_CONFIG from "../../config/config";
import POSTS from "../../_mock/blog";
import {BlogPostCard} from "../../sections/@dashboard/blog";
import BusinessDetailsCard from "../../sections/@dashboard/business/BusinessDetailsCard";
import {AppTasks} from "../../sections/@dashboard/app";


// ----------------------------------------------------------------------

const NAME_PAGE = 'Business Details';
const URL_UPDATE = '/business/update/';
const URL_CREATE = '/business';
const URL_TABLES_PAGE = '/dashboard/business';
const URL_GET_ITEM_FOR_UPDATE = '/business/';

const business = [...Array(1)].map((_, index) => ({
    id: faker.datatype.uuid(),
    cover: `/assets/images/covers/cover_${index + 1}.jpg`,
    title: 'Business 1',
    createdAt: faker.date.past(),
    view: faker.datatype.number(),
    comment: faker.datatype.number(),
    share: faker.datatype.number(),
    favorite: faker.datatype.number(),
    author: {
        name: faker.name.fullName(),
        avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
    },
}));
export default function DetailsBusinessPage() {
    // const showSnackbarMessage = useMessagesSnackbar();
    const {id} = useParams();
    // const navigate = useNavigate();
    // const {api} = useApiHandlerStore((state) => state);
    // const [validator, setValidator] = useState({});
    // const [formData, setFormData] = useState({
    //     name: '',
    //     description: '',
    //     logo: '',
    // });
    //
    // const handleChange = (event) => {
    //     const {name, value} = event.target;
    //     setFormData((prevFormData) => ({
    //         ...prevFormData,
    //         [name]: value,
    //     }));
    // };
    //
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     let response;
    //     if (id) {
    //         response = await api.__update(`${URL_UPDATE}${id}`, formData, (msg) => {
    //             showSnackbarMessage(msg, 'error');
    //         });
    //     } else {
    //         response = await api.__post(URL_CREATE, formData, (msg) => {
    //             showSnackbarMessage(msg, 'error');
    //         });
    //     }
    //
    //     if (response) {
    //         if (response.success) {
    //             const msg = id ? `${NAME_PAGE} updated successfully!` : `${NAME_PAGE} added successfully!`;
    //             showSnackbarMessage(msg, 'success');
    //             navigate(URL_TABLES_PAGE)
    //         } else {
    //             setValidator(response && response.data)
    //         }
    //     }
    // };
    //
    // const getItemForUpdate = async () => {
    //     const response = await api.__get(`${URL_GET_ITEM_FOR_UPDATE}${id}`, null, (msg) => {
    //         showSnackbarMessage(msg, 'error');
    //     });
    //     if (response) {
    //         setFormData({
    //             name: response.data.name,
    //             description: response.data.description,
    //             logo: response.data.logo,
    //         })
    //     }
    // }
    //
    // useEffect(() => {
    //     if (id) {
    //         getItemForUpdate();
    //     }
    // }, [])

    return (
        <>
            <Helmet>
                <title> {NAME_PAGE} | { PROYECT_CONFIG.NAME } </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="left" justifyContent="space-between" mb={5}>
                    <Stack>
                        <BackButton path={URL_TABLES_PAGE}/>
                    </Stack>
                    <Typography variant="h4" gutterBottom>
                        {NAME_PAGE}
                    </Typography>
                </Stack>
                <Grid container>
                    {business.map((post, index) => (
                        <BusinessDetailsCard key={post.id} post={post} index={index} />
                    ))}
                </Grid>
                <Stack>
                    <Grid item xs={12} md={6} lg={8}>
                        <AppTasks
                            title="Areas"
                            list={[
                                { id: '1', label: 'Create FireStone Logo' },
                                { id: '2', label: 'Add SCSS and JS files if required' },
                                { id: '3', label: 'Stakeholder Meeting' },
                                { id: '4', label: 'Scoping & Estimations' },
                                { id: '5', label: 'Sprint Showcase' },
                            ]}
                        />
                    </Grid>
                </Stack>
            </Container>
        </>
    );
}

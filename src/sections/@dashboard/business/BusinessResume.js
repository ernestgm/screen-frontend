// @mui
import PropTypes from 'prop-types';
import {Box, Stack, Link, Card, Button, Divider, Typography, CardHeader} from '@mui/material';
// utils
import {useEffect, useState} from "react";
import {fToNow} from '../../../utils/formatTime';
// table
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import useApiHandlerStore from "../../../zustand/useApiHandlerStore";
import useMessagesAlert from "../../../hooks/messages/useMessagesAlert";
import useMessagesSnackbar from "../../../hooks/messages/useMessagesSnackbar";
import PROJECT_CONFIG from "../../../config/config";

// ----------------------------------------------------------------------

const URL_GET_DATA = PROJECT_CONFIG.API_CONFIG.BUSINESS.ALL;
const URL_GENERATE_JSON = PROJECT_CONFIG.API_CONFIG.BUSINESS.GENERATE_JSON;

export default function BusinessResume({...other}) {
    const {api} = useApiHandlerStore((state) => state);
    const showMessageAlert = useMessagesAlert();
    const showMessageSnackbar = useMessagesSnackbar()
    const [businesses, setBusinesses] = useState([]);

    const getBusinesses = async () => {
        const response = await api.__get(URL_GET_DATA, (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { getBusinesses() })

        if (response) {
            setBusinesses(Object.values(response.data));
        }
    };

    const generateJson = async (id) => {
        const response = await api.__get(`${URL_GENERATE_JSON}${id}`, (msg) => {
            showMessageSnackbar(msg, 'error');
        }, () => { generateJson(id) })

        if (response) {
            showMessageAlert(`JSON URL: ${response.json_url}`, 'success')
        }
    }

    useEffect(() => {
        getBusinesses()
    }, []);
    
    return (
        <Card {...other}>
            <CardHeader title="Business" subheader="Here you can generate the json for each business"/>
            <Scrollbar>
                <Stack spacing={3} sx={{p: 3, pr: 0}}>
                    {businesses.map((business) => (
                        <NewsItem key={business.id} business={business} generateJson={() => generateJson(business.id)}/>
                    ))}
                </Stack>
            </Scrollbar>
        </Card>
    );
}

// ----------------------------------------------------------------------

NewsItem.propTypes = {
    business: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        createdAt: PropTypes.instanceOf(Date),
        generateJson: PropTypes.func
    }),
};

function NewsItem({business, generateJson}) {
    const {name, description, createdAt} = business;

    const style = {
        width: '100%',
        borderWidth: '1px',
        borderColor: '#c9c9c9',
    };

    return (
        <>
            <Stack direction="row" alignItems="center" spacing={2}>
            <Box component="img" alt={name} src='/assets/images/covers/cover_5.jpg'
                 sx={{width: 48, height: 48, borderRadius: 1.5, flexShrink: 0}}/>

            <Box sx={{minWidth: 240, flexGrow: 1}}>
                <Link color="inherit" variant="subtitle2" underline="hover" noWrap>
                    {name}
                </Link>

                <Typography variant="body2" sx={{color: 'text.secondary'}} noWrap>
                    {description}
                </Typography>
            </Box>

            <Typography variant="caption" sx={{pr: 3, flexShrink: 0, color: 'text.secondary'}}>
                {fToNow(createdAt)}
            </Typography>

            <Button onClick={generateJson} endIcon={<Iconify icon={'carbon:json-reference'}/>}>
                Generate JSON
            </Button>
        </Stack>
            <Divider sx={style} />
        </>
    );
}

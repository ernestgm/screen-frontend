import React, {useEffect, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import SaveIcon from '@mui/icons-material/Save';
import useApiHandlerStore from "../../../zustand/useApiHandlerStore";
import useMessagesAlert from "../../../hooks/messages/useMessagesAlert";
import useMessagesSnackbar from "../../../hooks/messages/useMessagesSnackbar";
import PROJECT_CONFIG from "../../../config/config";


const AREA_URL_GET_DATA = PROJECT_CONFIG.API_CONFIG.AREA.ALL;
const AREA_URL_GET_DATA_UPDATE = PROJECT_CONFIG.API_CONFIG.AREA.GET;
const AREA_URL_DELETE_ROW = PROJECT_CONFIG.API_CONFIG.AREA.DELETE;
const AREA_URL_CREATE_ROW = PROJECT_CONFIG.API_CONFIG.AREA.CREATE;
const AREA_URL_UPDATE_ROW = PROJECT_CONFIG.API_CONFIG.AREA.UPDATE;
const ROUTE_DETAILS_ROW = '/dashboard/area/details/';

export default function AreaModalDialog({updateAreaId, areaFormData, openDialog, handleClose, handleFormChange}) {
    const {api} = useApiHandlerStore((state) => state);
    const showMessageSnackbar = useMessagesSnackbar();
    const [validator, setValidator] = useState({});
    const [loading, setLoading] = useState(false);

    const createNewAreaAction = async () => {
        let response;

        if (updateAreaId) {
            response = await api.__update(`${AREA_URL_UPDATE_ROW}${updateAreaId}`, areaFormData, (msg) => {
                showMessageSnackbar(msg, 'error');
            }, () => { createNewAreaAction() }, ( isLoading ) => { setLoading(isLoading) });
        } else {
            response = await api.__post(AREA_URL_CREATE_ROW, areaFormData, (msg) => {
                showMessageSnackbar(msg, 'error');
            }, () => { createNewAreaAction() }, ( isLoading ) => { setLoading(isLoading) });
        }


        if (response) {
            if (response.success) {
                const msg = updateAreaId ? `Area updated successfully!` : `Area added successfully!`;
                showMessageSnackbar(msg, 'success');
                handleCloseRefreshData()
            } else {
                setValidator(response.data && response.data)
            }
        }
    }

    const handleCloseNewArea = () => {
        handleClose(false);
        setValidator([])
    };

    const handleCloseRefreshData = () => {
        handleClose(true);
        setValidator([])
    }


    return (<>
            <Dialog open={openDialog} onClose={handleCloseNewArea}>
                <DialogTitle>{updateAreaId ? 'Edit' : 'Create'} Area</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {updateAreaId ? 'Edit' : 'Create a new' } area
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Name"
                        value={areaFormData.name ?? ''}
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={handleFormChange}
                        error={validator.name && true}
                        helperText={validator.name}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseNewArea}>Cancel</Button>
                    <LoadingButton
                        color="secondary"
                        onClick={createNewAreaAction}
                        loading={loading}
                        loadingPosition="start"
                        startIcon={<SaveIcon />}
                        variant="contained"
                    >
                        <span>{updateAreaId ? 'Save' : 'Create'}</span>
                    </LoadingButton>
                </DialogActions>
            </Dialog>
    </>
    )
}
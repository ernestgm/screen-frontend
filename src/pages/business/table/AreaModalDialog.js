import React, {useEffect, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
import useApiHandlerStore from "../../../zustand/useApiHandlerStore";
import useMessagesAlert from "../../../hooks/messages/useMessagesAlert";
import useMessagesSnackbar from "../../../hooks/messages/useMessagesSnackbar";
import PROYECT_CONFIG from "../../../config/config";


const AREA_URL_GET_DATA = PROYECT_CONFIG.API_CONFIG.AREA.ALL;
const AREA_URL_GET_DATA_UPDATE = PROYECT_CONFIG.API_CONFIG.AREA.GET;
const AREA_URL_DELETE_ROW = PROYECT_CONFIG.API_CONFIG.AREA.DELETE;
const AREA_URL_CREATE_ROW = PROYECT_CONFIG.API_CONFIG.AREA.CREATE;
const AREA_URL_UPDATE_ROW = PROYECT_CONFIG.API_CONFIG.AREA.UPDATE;
const ROUTE_DETAILS_ROW = '/dashboard/area/details/';

export default function AreaModalDialog({updateAreaId, areaFormData, openDialog, handleClose, handleFormChange}) {
    const {api} = useApiHandlerStore((state) => state);
    const showMessageSnackbar = useMessagesSnackbar();
    const [validator, setValidator] = useState({});

    const createNewAreaAction = async () => {
        let response;

        if (updateAreaId) {
            response = await api.__update(`${AREA_URL_UPDATE_ROW}${updateAreaId}`, areaFormData, (msg) => {
                showMessageSnackbar(msg, 'error');
            }, () => { createNewAreaAction() });
        } else {
            response = await api.__post(AREA_URL_CREATE_ROW, areaFormData, (msg) => {
                showMessageSnackbar(msg, 'error');
            }, () => { createNewAreaAction() });
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
                        value={areaFormData.name}
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
                    <Button onClick={createNewAreaAction}>{updateAreaId ? 'Save' : 'Create'}</Button>
                </DialogActions>
            </Dialog>
    </>
    )
}
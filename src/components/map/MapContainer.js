import React from 'react'
import {Autocomplete, GoogleMap, LoadScript , Marker} from '@react-google-maps/api';
import {InputAdornment, TextField} from "@mui/material";
import {Outlet} from "react-router-dom";
import PROYECT_CONFIG from "../../config/config";
import Iconify from "../iconify";

const containerStyle = {
    width: '100%',
    height: '100%'
};

export default function MapContainer({map, setAdress , geolocation , children}) {
    const {address, latitude, longitude} = geolocation;
    const libs = ["places"];
    const center = {
        lat: latitude ? parseFloat(latitude) : 0,
        lng: longitude ? parseFloat(longitude) : 0
    };

    const onLoad = (autocomplete) => {
        autocomplete.addListener('place_changed', () => {
            setAdress(autocomplete.getPlace())
        });
    };

    return (
        <LoadScript
            googleMapsApiKey={PROYECT_CONFIG.GOOGLE_API_KEY}
            libraries={libs}
        >
            {map ?
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={16}
                >
                    <Marker
                        position={center}
                    />
                </GoogleMap>
                :
                <Autocomplete
                    onLoad={onLoad}
                    onPlaceChanged={() => {}}
                >
                    {children}
                </Autocomplete>
            }
        </LoadScript>
    )
}


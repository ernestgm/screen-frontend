import React from 'react'
import {Autocomplete, GoogleMap, LoadScript , Marker} from '@react-google-maps/api';
import {TextField} from "@mui/material";
import PROYECT_CONFIG from "../../config/config";

const containerStyle = {
    width: '100%',
    height: '100%'
};

export default function MapContainer({map, setAdress, geolocation}) {
    const {address, latitude, longitude} = geolocation;
    const center = {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude)
    };

    const onLoad = (autocomplete) => {
        autocomplete.addListener('place_changed', () => {
            setAdress(autocomplete.getPlace())
        });
    };

    return (
        <LoadScript
            googleMapsApiKey={PROYECT_CONFIG.GOOGLE_API_KEY}
            libraries={["places"]}
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
                    onPlaceChanged={() => {
                    }}
                >
                    <TextField
                        name="address"
                        label="Address"
                        sx={{width: '100%'}}
                    />
                </Autocomplete>
            }
        </LoadScript>
    )
}


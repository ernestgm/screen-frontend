import React, {useState} from 'react'
import {Autocomplete, GoogleMap, LoadScript , Marker} from '@react-google-maps/api';
import PROYECT_CONFIG from "../../config/config";

const containerStyle = {
    width: '100%',
    height: '100%'
};

export default function MapContainer({map, setAddress , geolocation , children}) {
    const {address, latitude, longitude} = geolocation;
    const [ libs ] = useState(['places']);
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    const center = {
        lat: latitude ? parseFloat(latitude) : 0,
        lng: longitude ? parseFloat(longitude) : 0
    };

    const onLoad = (autocomplete) => {
        autocomplete.addListener('place_changed', () => {
            setAddress(autocomplete.getPlace())
        });
    };

    return (
        <LoadScript
            googleMapsApiKey={apiKey}
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


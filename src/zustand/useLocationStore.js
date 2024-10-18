import {create} from 'zustand';
import {persist} from 'zustand/middleware';

const initialState = {
    currentLocation: null,
};

const useLocationStore = create(
    persist(
        (set) => ({
            ...initialState,
            setCurrentLocation: (location) => set(() => ({currentLocation: location})),
            resetLocation: () => set(initialState),
            userLocation: () => { console.log(initialState) }
        }),
        {
            name: 'current-location', // unique name
        }
    )
);

export default useLocationStore;

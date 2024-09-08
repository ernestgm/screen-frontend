import {create} from 'zustand';
import {persist} from 'zustand/middleware';

const initialState = {
    currentUser: null,
};

const useAuthStore = create(
    persist(
        (set) => ({
            ...initialState,
            setCurrentUser: (user) => set(() => ({currentUser: user})),
            resetCurrentUser: () => set(initialState),
            userAccount: () => { console.log(initialState) }
        }),
        {
            name: 'current-user', // unique name
        }
    )
);

export default useAuthStore;

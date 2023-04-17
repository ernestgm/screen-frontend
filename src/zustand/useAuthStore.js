import {create} from 'zustand';
import {persist} from 'zustand/middleware';

const initialState = {
    currentUser: null,
};

const useAuthStore = create(
    persist(
        (set, get) => ({
            ...initialState,
            setCurrentUser: (user) => set((_) => ({currentUser: user})),
            resetCurrentUser: () => set(initialState),
            userAccount: () => { console.log(initialState) }
            //     set(() => ({
            //     displayName: `${initialState.currentUser.user.name} ${initialState.currentUser.user.lastname}`,
            //     email: initialState.currentUser.user.email,
            //     photoURL: '/assets/images/avatars/avatar_default.jpg',
            // }))
        }),
        {
            name: 'current-user', // unique name
        }
    )
);

export default useAuthStore;

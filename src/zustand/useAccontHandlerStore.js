import {create} from 'zustand';
import useAuthStore from "./useAuthStore";


const useAccountHandlerStore = create(
    (set, get) => ({
        account: {
            displayName: `${
                useAuthStore.getState().currentUser ? useAuthStore.getState().currentUser.user.name : ''
            } ${
                useAuthStore.getState().currentUser ? useAuthStore.getState().currentUser.user.lastname : ''
            }`,
            email: `${useAuthStore.getState().currentUser ? useAuthStore.getState().currentUser.user.email : ''}`,
            role: useAuthStore.getState().currentUser ? useAuthStore.getState().currentUser.user.role : '',
            photoURL: '/assets/images/avatars/avatar_default.jpg',
        },

        // new ApiHandler(),
        setAccountData: (user) => set({
            account: {
                displayName: `${user.name} ${user.lastname}`,
                email: `${user.email}`,
                role: user.role,
                photoURL: '/assets/images/avatars/avatar_default.jpg',
            }
        }),
    })
);

// export default useAuthStore;
export default useAccountHandlerStore


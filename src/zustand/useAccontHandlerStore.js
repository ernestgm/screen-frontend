import {create} from 'zustand';
import useAuthStore from "./useAuthStore";


const useAccountHandlerStore = create(
    (set) => ({
        account: {
            uid: `${useAuthStore.getState().currentUser ? useAuthStore.getState().currentUser.user.id : ''}`,
            displayName: `${
                useAuthStore.getState().currentUser ? useAuthStore.getState().currentUser.user.name : ''
            } ${
                useAuthStore.getState().currentUser ? useAuthStore.getState().currentUser.user.lastname : ''
            }`,
            email: `${useAuthStore.getState().currentUser ? useAuthStore.getState().currentUser.user.email : ''}`,
            role: useAuthStore.getState().currentUser ? useAuthStore.getState().currentUser.user.role : '',
            photoURL: '/assets/images/avatars/avatar_default.jpg',
            sign: `${
              useAuthStore.getState().currentUser ? useAuthStore.getState().currentUser.user.name.charAt(0) : ''
            }${
              useAuthStore.getState().currentUser ? useAuthStore.getState().currentUser.user.lastname.charAt(0) : ''
            }`
        },

        // new ApiHandler(),
        setAccountData: (user) => set({
            account: {
                uid: `${user.id}`,
                displayName: `${user.name} ${user.lastname}`,
                email: `${user.email}`,
                role: user.role,
                photoURL: '/assets/images/avatars/avatar_default.jpg',
                sign: `${user.name.charAt(0).toLocaleUpperCase()}${user.lastname.charAt(0).toUpperCase()}`
            }
        }),
    })
);

// export default useAuthStore;
export default useAccountHandlerStore


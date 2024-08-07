import {create} from 'zustand';
import useAuthStore from "./useAuthStore";
import ApiHandler from "../utils/handlers/ApiHandler";




const useApiHandlerStore = create(
    (set, get) => ({
        api: new ApiHandler(
            useAuthStore.getState().currentUser ? useAuthStore.getState().currentUser.token : null,
            useAuthStore.getState().currentUser ? useAuthStore.getState().currentUser.refresh_token : null
        ),
        setApiToken: (token, refreshToken) => set({
            api: get().api.setUserToken(token).setUserRefreshToken(refreshToken)
        }
        ),
    })
);

export default useApiHandlerStore


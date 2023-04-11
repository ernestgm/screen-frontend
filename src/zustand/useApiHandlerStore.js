import {create} from 'zustand';
import useAuthStore from "./useAuthStore";
import ApiHandler from "../utils/handlers/ApiHandler";




const useApiHandlerStore = create(
    (set, get) => ({
        api: new ApiHandler(useAuthStore.getState().currentUser ? useAuthStore.getState().currentUser.token : null),
        setApiToken: (token) => set({ api: get().api.setUserToken(token)}),
    })
);

// export default useAuthStore;
export default useApiHandlerStore


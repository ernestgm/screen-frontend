import {create} from 'zustand';
import useAuthStore from "./useAuthStore";
import ApiHandler from "../utils/handlers/ApiHandler";




const useApiHandlerStore = create(
    (set, get) => ({
        api: new ApiHandler(useAuthStore.getState().currentUser),
        setApiToken: (currentUser) => set({ api: get().api.setCurrentUser(currentUser)}),
    })
);

// export default useAuthStore;
export default useApiHandlerStore


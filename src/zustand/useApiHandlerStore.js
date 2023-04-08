import {create} from 'zustand';
import useAuthStore from "./useAuthStore";
import ApiHandler from "../utils/handlers/ApiHandler";




const useApiHandlerStore = create(
    () => {
        const currentUser  = useAuthStore.getState().currentUser;
        console.log(currentUser)
        return new ApiHandler(currentUser)
    }
);

const currentUserSubcribe = useAuthStore.subscribe(console.log)

// export default useAuthStore;
export default useApiHandlerStore


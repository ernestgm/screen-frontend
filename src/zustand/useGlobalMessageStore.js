import {create} from 'zustand';
import useAuthStore from "./useAuthStore";
import ApiHandler from "../utils/handlers/ApiHandler";

const initialState = {
    openAlert: false,
    openSnackbar: false,
    message: '',
    type: 'success',
};

const useGlobalMessageStore = create(
    (set, get) => ({
        options: initialState,
        showMessage: (optionValue) => set(state => ({options: {...state.options, ...optionValue}})),
        closeAlert: () => set({ options: initialState })
    })
);

export default useGlobalMessageStore
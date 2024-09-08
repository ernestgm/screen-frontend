import {create} from 'zustand';

const initialState = {
    openAlert: false,
    openSnackbar: false,
    message: '',
    type: 'success',
};

const useGlobalMessageStore = create(
    (set) => ({
        options: initialState,
        showMessage: (optionValue) => set(state => ({options: {...state.options, ...optionValue}})),
        closeAlert: () => set({ options: initialState })
    })
);

export default useGlobalMessageStore
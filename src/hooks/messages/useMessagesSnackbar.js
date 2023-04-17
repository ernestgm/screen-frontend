import useGlobalMessageStore from "../../zustand/useGlobalMessageStore";

export default function useMessagesSnackbar() {
    const { showMessage } = useGlobalMessageStore((state) => state)

    return (msg, _type) => showMessage({
        openAlert: false,
        openSnackbar: true,
        message: msg,
        type: _type
    })
}
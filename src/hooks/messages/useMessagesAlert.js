import useGlobalMessageStore from "../../zustand/useGlobalMessageStore";

export default function useMessagesAlert() {
    const { showMessage } = useGlobalMessageStore((state) => state)

    return (msg, _type) => showMessage({
        openAlert: true,
        openSnackbar: false,
        message: msg,
        type: _type
    })
}


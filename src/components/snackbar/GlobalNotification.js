import {Alert, Snackbar} from "@mui/material";
import useGlobalMessageStore from "../../zustand/useGlobalMessageStore";



export default function GlobalNotification() {
    const {options, closeAlert } = useGlobalMessageStore((state) => state)
    const handleClose = () => {
        closeAlert()
    };


    return (
        <Snackbar
            anchorOrigin={ {vertical: 'top', horizontal: 'right' }}
            open={options.openSnackbar}
            onClose={handleClose}
            key={options.message}
            autoHideDuration={6000}
        >
             <Alert
                onClose={handleClose}
                severity={options.type}
                sx={{ width: '100%' }}>
                {options.message}
             </Alert>
        </Snackbar>
    );
}
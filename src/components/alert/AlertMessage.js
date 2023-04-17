import {Alert, AlertTitle, Box, Collapse, IconButton, List} from "@mui/material";
import Iconify from "../iconify";
import useGlobalMessageStore from "../../zustand/useGlobalMessageStore";



export default function AlertMessage() {
    const {options, closeAlert } = useGlobalMessageStore((state) => state)

    const titles = {
        error : 'Error',
        success: 'Success'
    }


    return (
        <Collapse in={options.openAlert}>
            <Alert
                severity={options.type}
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            closeAlert()
                        }}
                    >
                        <Iconify icon="material-symbols:close" />
                    </IconButton>
                }
                sx={{ mb: 2 }}
            >
                <AlertTitle>{titles[options.type]}</AlertTitle>
                { options.message }
            </Alert>
        </Collapse>
    );
}
import {Button} from "@mui/material";
import Iconify from "../../../components/iconify";
import useNavigateTo from "../../../hooks/navigateTo";



export default function BackButton({path}) {
    const {navigateTo} = useNavigateTo();

    const handleOnClick = () => {
        navigateTo(path)
    };

    return (
        <>
            <Button onClick={handleOnClick} variant="outlined" startIcon={<Iconify icon="material-symbols:arrow-back-rounded" />}>
                Back
            </Button>
        </>
    );
}
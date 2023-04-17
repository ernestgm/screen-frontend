import {useNavigate} from "react-router-dom";
import {Button} from "@mui/material";
import Iconify from "../../../components/iconify";



export default function BackButton({path}) {
    const navigate = useNavigate();

    const handleOnClick = () => {
        navigate(path)
    };

    return (
        <>
            <Button onClick={handleOnClick} variant="outlined" startIcon={<Iconify icon="material-symbols:arrow-back-rounded" />}>
                Back
            </Button>
        </>
    );
}
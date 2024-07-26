import {useNavigate} from "react-router-dom";

export default function useNavigateTo() {
    const navigate = useNavigate();

    const navigateTo = (path) => {
        navigate(path, { relative: "path", replace: true });
    };

    return { navigateTo };
}
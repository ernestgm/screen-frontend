// @mui
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Iconify from '../iconify';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});



// eslint-disable-next-line react/prop-types
export default function UploadVideo({ onChange }) {
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange(file);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<Iconify icon="material-symbols:video-camera-back-add-outline" />}
            >
                Upload Video
                <VisuallyHiddenInput type="file" onChange={handleImageChange}/>
            </Button>
        </div>
    );
}
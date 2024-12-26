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
export default function SaveImage({ onChange, updatePreview, previewImage }) {
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange(file);
                updatePreview(reader.result);
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
                startIcon={<Iconify icon="material-symbols:add-photo-alternate-outline" />}
            >
                Upload Image
                <VisuallyHiddenInput type="file" onChange={handleImageChange}/>
            </Button>
            {previewImage !== '' && (
                <div>
                    <h4>Preview:</h4>
                    <img src={previewImage} alt="Imagen subida" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                </div>
            )}
        </div>
    );
}
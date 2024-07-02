import { useState } from 'react';

// @mui
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

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



export default function SaveImage({ onChange, previewImage }) {

    const [image, setImage] = useState(null);
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(file);
                onChange(reader.result);
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
                startIcon={<CloudUploadIcon />}
            >
                Upload Image
                <VisuallyHiddenInput type="file" onChange={handleImageChange}/>
            </Button>
            {previewImage !== '' && (
                <div>
                    <h4>Previsualización:</h4>
                    <img src={previewImage} alt="Imagen subida" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                </div>
            )}
        </div>
    );
}
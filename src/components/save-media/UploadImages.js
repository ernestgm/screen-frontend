import React from 'react';
import ImageUploading from 'react-images-uploading';
import { Box, Button, Card, Grid, IconButton, Stack } from '@mui/material';
import { DeleteOutline } from '@mui/icons-material';
import Iconify from '../iconify';

// eslint-disable-next-line react/prop-types
export function UploadImages({ onChange }) {
  const [images, setImages] = React.useState([]);
  const maxNumber = 50;

  const handleImageChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
    onChange(imageList);
  };

  return (
    <div className="App">
      <ImageUploading
        multiple
        value={images}
        onChange={handleImageChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
        acceptType={['jpg', 'png', 'jpeg']}
      >
        {({ imageList, onImageUpload, onImageRemoveAll, onImageRemove }) => (
          // write your building UI
          <Card>
            <Stack direction="row" spacing={1}>
              <Button
                onClick={onImageUpload}
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<Iconify icon="material-symbols:add-photo-alternate-outline" />}
              >
                Upload Images
              </Button>
              {imageList.length > 0 && (
                <Button color="error" onClick={onImageRemoveAll} variant="outlined" startIcon={<DeleteOutline />}>
                  Remove all images
                </Button>
              )}
            </Stack>

            <Box sx={{ flexGrow: 1, p: 2 }}>
              <Grid
                container
                sx={{
                  '--Grid-borderWidth': '1px',
                  borderTop: 'var(--Grid-borderWidth) solid',
                  borderLeft: 'var(--Grid-borderWidth) solid',
                  borderColor: 'divider',
                  '& > div': {
                    borderRight: 'var(--Grid-borderWidth) solid',
                    borderBottom: 'var(--Grid-borderWidth) solid',
                    borderColor: 'divider',
                  },
                }}
              >
                {imageList.map((image, index) => (
                  <Grid
                    key={index}
                    minHeight={160}
                    size={{
                      xs: 12,
                      sm: 6,
                      md: 4,
                      lg: 3,
                    }}
                  >
                    <Stack direction="column" spacing={1} alignItems="center">
                      <img src={image.data_url} alt="" height="100" />
                      <IconButton aria-label="delete" onClick={() => onImageRemove(index)}>
                        <DeleteOutline />
                      </IconButton>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Card>
        )}
      </ImageUploading>
    </div>
  );
}
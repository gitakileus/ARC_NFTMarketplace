import { Button, CardMedia, Stack } from '@mui/material';
import upload from 'assets/upload.svg';
import React, { useState } from 'react';

interface IProps {
  id: string;
  width: number | string;
  height: number;
  rounded?: boolean;
  fit?: boolean;
  title?: string;
  mode?: string;
  imageFile: File | undefined;
  setImageFile: (arg0: File | undefined) => void;
  imageUrl?: string;
}

const UploadImage = (props: IProps) => {
  const { id, width, height, rounded, fit, imageFile, setImageFile, title, imageUrl, mode = 'MEDIA' } = props;
  const [previewImage, setPreviewImage] = useState('');

  const selectFile = (event: any) => {
    setImageFile(event.target.files[0]);
    if (mode === 'MEDIA') {
      setPreviewImage(URL.createObjectURL(event.target.files[0]));
    } else {
      setPreviewImage(event.target.files[0].name);
    }
  };

  return (
    <label htmlFor={id}>
      <input id={id} name={id} style={{ display: 'none' }} type="file" onChange={selectFile} />
      <Button
        className="btn-choose"
        variant="outlined"
        component="span"
        sx={{
          width,
          height,
          borderColor: '#2c2c2c',
          ...(rounded && { borderRadius: '100%', borderColor: '#3E3E3E' }),
        }}
      >
        {previewImage ? (
          mode === 'MEDIA' ? (
            <div>
              <CardMedia
                component="img"
                image={previewImage}
                alt="uploadImage"
                sx={{
                  width,
                  height,
                  borderRadius: 2,
                  ...(fit && { objectFit: 'fill' }),
                  ...(rounded && { borderRadius: '100%' }),
                }}
              />
            </div>
          ) : (
            <div>{previewImage}</div>
          )
        ) : imageUrl ? (
          mode === 'MEDIA' ? (
            <div>
              <CardMedia
                component="img"
                image={imageUrl}
                alt="uploadImage"
                sx={{
                  width,
                  height,
                  borderRadius: 2,
                  ...(fit && { objectFit: 'fill' }),
                  ...(rounded && { borderRadius: '100%' }),
                }}
              />
            </div>
          ) : (
            <></>
          )
        ) : (
          <Stack justifyContent="center" alignItems="center">
            <CardMedia component="img" image={upload} alt="upload" sx={{ width: 30, height: 20, mb: 2 }} />
            {title ? title : 'Click here to upload'}
          </Stack>
        )}
      </Button>
    </label>
  );
};

export default UploadImage;

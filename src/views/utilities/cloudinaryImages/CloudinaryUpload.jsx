import React, { useState, useEffect } from 'react';
import { Button, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CloudinaryUpload = ({ initialImageUrl = '', onUpload }) => {
  const [imageUrl, setImageUrl] = useState(initialImageUrl);

 

  useEffect(() => {
    if (initialImageUrl && initialImageUrl !== imageUrl) {
      setImageUrl(initialImageUrl); // Solo actualiza si la URL de imagen ha cambiado
    }
  }, [initialImageUrl]);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'bei-empl');

      fetch('https://api.cloudinary.com/v1_1/tarija/image/upload', {
        method: 'POST',
        body: formData
      })
        .then((res) => res.json())
        .then((data) => {
          setImageUrl(data.secure_url); 
          onUpload(data.secure_url);
        })
        .catch((err) => console.error('Error al subir la imagen', err));
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    onUpload(''); 
  };

  return (
    <Box position="relative" display="inline-block">
      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt="Fotografía del empleado"
            style={{ 
                maxWidth: '100%', 
                maxHeight: '100%', 
                borderRadius: '8px',
                objectFit: 'cover' // Ajusta la imagen para que no se deforme
              }}
          />
          <IconButton
            onClick={handleRemoveImage}
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.8)', 
              color: '#d42626'

            }}
            aria-label="Eliminar imagen"
          >
            <DeleteIcon />
          </IconButton>
        </>
      ) : (
        <>
          <p>No se ha agregado una fotografía</p>
          <Button variant="contained" component="label">
            Agregar una (+)
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
        </>
      )}
    </Box>
  );
};

export default CloudinaryUpload;

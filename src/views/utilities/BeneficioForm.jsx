import React, { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Divider } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/system';

const BeneficioForm = ({ open, handleClose, contrato }) => {
  const handleOpenNuevo = () => {
    console.log('nuevo');
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        Detalles del Contrato
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
            <Box>
              <Typography gutterBottom>
                <strong>Empleado:</strong> {contrato.empleado}
              </Typography>
              <Typography gutterBottom>
                <strong>Cargo:</strong> {contrato.cargo}
              </Typography>
            </Box>
            <Box>
              <DialogActions>
                <Button variant="outlined" color="primary" onClick={handleOpenNuevo}>
                  Nuevo
                </Button>
              </DialogActions>
            </Box>
          </Box>

          <Box>
            <p>osod</p>
          </Box>
        </Box>

        {/*     <Typography gutterBottom><strong>Fecha de Inicio:</strong> {contrato.fechaInicio}</Typography>
        <Typography gutterBottom><strong>Fecha de Finalización:</strong> {contrato.fechaFin}</Typography>
        <Typography gutterBottom><strong>Fecha de Finiquito:</strong> {contrato.fechaFiniquito}</Typography>
        <Typography gutterBottom><strong>Haber Inicial:</strong> {contrato.haberInicial}</Typography>
        <Typography gutterBottom><strong>Haber Actual:</strong> {contrato.haberActual}</Typography>
        <Typography gutterBottom><strong>Contrato Respaldo:</strong> {contrato.contratoRespaldo}</Typography>
        <Typography gutterBottom><strong>Finiquito Respaldo:</strong> {contrato.finiquitoRespaldo}</Typography> */}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BeneficioForm;

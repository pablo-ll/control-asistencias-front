import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import PropTypes from 'prop-types';
import { useCargoStore, useEmpleadoStore } from 'hooks';

const RechazarForm = ({ open, handleClose, solicitud, handleReject }) => {
  const [comment, setComment] = useState('');
  const { empleados, loadEmpleados } = useEmpleadoStore();
  const { cargos, loadCargos } = useCargoStore();

  useEffect(() => {
    loadEmpleados();
    loadCargos();
  }, []);

  const handleRejectWithComment = () => {
    handleReject(comment);
    setComment('');
  };

  const getEmpleadoName = (id) => {
    const empleado = empleados.find((emp) => emp.id === id);
    return empleado ? `${empleado.nombre} ${empleado.apellidoPaterno}` : 'Desconocido';
  };

  const getCargoName = (id) => {
    const empleado = empleados.find((emp) => emp.id === id);
    if (!empleado) {
      return 'Desconocido';
    }
    const cargo = cargos.find((dep) => dep.id === empleado.cargoId);
    return cargo ? `${cargo.nombre}` : 'Desconocido';
  };

  const SolicitudDias = ( solicitud ) => {
    const fechaInicio = new Date(solicitud.fechaInicio);
    const fechaFin = new Date(solicitud.fechaFin);

    // Calcular la diferencia en días (incluyendo ambos días)
    const diffTime = Math.abs(fechaFin - fechaInicio);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir ambos días

    return (
        <>
            <Typography variant="h6" component="div">
                Fechas:  {fechaInicio.toLocaleDateString()}  al  {fechaFin.toLocaleDateString()}
            </Typography>
            <Typography variant="body2" component="span">
                ({diffDays} días)
            </Typography>
        </>
    );
};

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
          width: '80%',
          maxWidth: 400
        }}
      >
        <Typography variant="h4" sx={{textAlign:'center'}} gutterBottom>Rechazar Solicitud</Typography>
        {solicitud && (
          <>
            <Typography variant="subtitle1">Solicitud de: {getEmpleadoName(solicitud.empleadoId)}</Typography>
            <Typography variant="subtitle2">Cargo: {getCargoName(solicitud.empleadoId)}</Typography>
            <Typography variant="body2" gutterBottom>
            {SolicitudDias(solicitud)}
            </Typography>
            <Typography variant="subtitle2"> {solicitud.descripcion}</Typography>
            <TextField
              label="Comentario"
              fullWidth
              multiline
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ my: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" color="primary" onClick={handleRejectWithComment} sx={{ mr: 2 }}>
                Notificar
              </Button>
              <Button variant="contained" color="secondary" onClick={handleClose}>
                Cancelar
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

RechazarForm.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  solicitud: PropTypes.object,
  handleReject: PropTypes.func.isRequired
};

export default RechazarForm;
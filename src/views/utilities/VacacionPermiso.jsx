import React, { useState } from 'react';
import MainCard from "ui-component/cards/MainCard";
import { Button, Modal, Box, Typography, TextField, Grid } from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { addHours } from 'date-fns';
import { localizer, getMessages } from "helpers";

// Datos de ejemplo para solicitudes
const solicitudes = [
  {
    id: 1,
    title: 'Vacaciones Pendientes',
    start: new Date(2024, 8, 15),
    end: addHours(new Date(2024, 8, 20), 2),
    bgColor: '#ffeb3b', // Amarillo para pendiente
    status: 'pending',
    user: { name: 'John Doe', email: 'john.doe@example.com' }
  },
  {
    id: 2,
    title: 'Permiso Aprobado',
    start: new Date(2024, 8, 25),
    end: addHours(new Date(2024, 8, 26), 2),
    bgColor: '#4caf50', // Verde para aprobado
    status: 'approved',
    user: { name: 'Jane Doe', email: 'jane.doe@example.com' }
  },
  {
    id: 3,
    title: 'Vacaciones Pendientes',
    start: new Date(2024, 9, 5),
    end: addHours(new Date(2024, 9, 10), 2),
    bgColor: '#ffeb3b', // Amarillo para pendiente
    status: 'pending',
    user: { name: 'Alice Smith', email: 'alice.smith@example.com' }
  }
];

const VacacionPermiso = () => {
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [comment, setComment] = useState('');

  const handleEventClick = (event) => {
    setSelectedSolicitud(event);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setComment('');
  };

  const handleApprove = () => {
    console.log('Aprobando solicitud:', selectedSolicitud, 'Comentario:', comment);
    // Aquí podrías actualizar el estado de la solicitud
    handleCloseModal();
  };

  const handleReject = () => {
    console.log('Rechazando solicitud:', selectedSolicitud, 'Comentario:', comment);
    // Aquí podrías actualizar el estado de la solicitud
    handleCloseModal();
  };

  return (
    <MainCard title="Gestión de vacaciones y permisos">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {/* Calendario */}
          <Calendar
            culture="es"
            localizer={localizer}
            events={solicitudes}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 'calc(100vh - 210px)', marginTop: '20px' }}
            messages={getMessages()}
            eventPropGetter={(event) => ({
              style: { backgroundColor: event.bgColor }
            })}
            onSelectEvent={handleEventClick}
          />
        </Grid>
      </Grid>

      {/* Modal para aprobar/rechazar solicitud */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 4, borderRadius: 2 }}>
          <Typography variant="h6">Gestionar Solicitud</Typography>
          {selectedSolicitud && (
            <>
              <Typography variant="subtitle1">Solicitud de: {selectedSolicitud.user.name}</Typography>
              <Typography variant="body2">Email: {selectedSolicitud.user.email}</Typography>
              <Typography variant="body2">Fechas: {selectedSolicitud.start.toDateString()} - {selectedSolicitud.end.toDateString()}</Typography>
              <TextField
                label="Comentario"
                fullWidth
                multiline
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{ my: 2 }}
              />
              <Button variant="contained" color="primary" onClick={handleApprove} sx={{ mr: 2 }}>Aprobar</Button>
              <Button variant="contained" color="secondary" onClick={handleReject}>Rechazar</Button>
            </>
          )}
        </Box>
      </Modal>
    </MainCard>
  );
};

export default VacacionPermiso;
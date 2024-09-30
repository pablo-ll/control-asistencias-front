// HorariosList.jsx
import React from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  IconButton,
  TextField,
  Modal,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ScheduleIcon from '@mui/icons-material/Schedule';

const HorariosList = ({ horarios, onEdit, onDelete }) => {
  return (
    <>
      {horarios.map((horario) => (
        <Paper key={horario.id} sx={{ padding: 2, marginBottom: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
            <Typography variant="h4" sx={{ gridColumn: 'span 2' }}>
              {horario.nombre}
            </Typography>
            <Box sx={{ textAlign: 'right' }}>
              <IconButton color="primary" onClick={() => onEdit(horario)}>
                <ScheduleIcon />
              </IconButton>
              <IconButton color="error" onClick={() => onDelete(horario.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>

            <Box>
              <Typography variant="body1">Hora Entrada:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField type="time" value={horario.horaEntrada} disabled sx={{ marginRight: 1 }} />
                <ScheduleIcon />
              </Box>
            </Box>

            {horario.tipo === 'completo' && (
              <>
                <Box>
                  <Typography variant="body1">Hora Salida Almuerzo:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField type="time" value={horario.horaSalidaAlmuerzo} disabled sx={{ marginRight: 1 }} />
                    <ScheduleIcon />
                  </Box>
                </Box>
                <Box>
                  <Typography variant="body1">Hora Reingreso:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField type="time" value={horario.horaReingreso} disabled sx={{ marginRight: 1 }} />
                    <ScheduleIcon />
                  </Box>
                </Box>
                <Box>
                  <Typography variant="body1">Hora Salida Final:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField type="time" value={horario.horaSalidaFinal} disabled sx={{ marginRight: 1 }} />
                    <ScheduleIcon />
                  </Box>
                </Box>
              </>
            )}
            {horario.tipo === 'continuo' && (
              <Box>
                <Typography variant="body1">Hora Salida:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextField type="time" value={horario.horaSalida} disabled sx={{ marginRight: 1 }} />
                  <ScheduleIcon />
                </Box>
              </Box>
            )}

            <Box>
              <Typography variant="body1">Tolerancia Entrada:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField type="time" value={horario.toleranciaEntrada} disabled sx={{ marginRight: 1 }} />
                <ScheduleIcon />
              </Box>
            </Box>
            <Box>
              <Typography variant="body1">Tolerancia Salida:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField type="time" value={horario.toleranciaSalida} disabled sx={{ marginRight: 1 }} />
                <ScheduleIcon />
              </Box>
            </Box>

            <Box sx={{ gridColumn: 'span 3' }}>
              <Typography variant="h5">Días Aplicables:</Typography>
              <Typography variant="body1">{horario.dias.join(', ')}</Typography>
            </Box>
          </Box>
        </Paper>
      ))}
    </>
  );
};

export default HorariosList;

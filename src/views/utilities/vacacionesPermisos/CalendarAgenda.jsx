import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export const CalendarAgenda = ({ event }) => {
  return (
    <Card sx={{ minWidth: 275, mb: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          {event.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {event.descripcion}
        </Typography>
        <Box mt={1} color='error'>
          <Typography variant="h6">Estado: {event.status}</Typography>
          <Typography variant="subtitle2">Cargo: {event.cargo}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

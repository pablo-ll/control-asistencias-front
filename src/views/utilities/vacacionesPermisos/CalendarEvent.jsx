import React from 'react';
import { Box, Typography } from '@mui/material';

export const CalendarEvent = ({ event }) => {
  const { title, status, cargo, descripcion } = event;

  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: event.bgColor,
        padding: '1px',
        borderRadius: '8px',
        color: 'white', // Texto blanco
        minWidth: '275px',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 1)' }}>
        {descripcion}
      </Typography>
      <Box mt={0.5} >
        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 1)' }}>{cargo}</Typography>
      </Box>
    </Box>
  );
};

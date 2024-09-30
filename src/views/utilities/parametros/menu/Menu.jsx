import React from 'react';
import { Box, Paper } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const Menu = ({ selectedMenuItem, setSelectedMenuItem }) => {
  const menuItems = [
    'Carreras profesionales',
    'Áreas de experiencia',
    'Grados de Formación',
    'Diccionario de Competencias',
    'Procesos',
    'Centros de Costo',
    'Cajas de Salud',
    'Días de Vacación',
    'Parámetros y Porcentajes de Aportes',
    "AFP's",
    'Bono de Antigüedad',
    'Horarios Sucursal',
    'Importación de Datos',
  ];

  return (
    <Paper
      sx={{
        width: { xs: '100%', md: '200px' },
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        marginBottom: { xs: 2, md: 0 },
        marginRight: { md: 2 },
      }}
    >
      {menuItems.map((item, index) => (
        <Box
          key={index}
          sx={{
            padding: 1.5,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: selectedMenuItem === item ? 'primary.main' : 'transparent',
            color: selectedMenuItem === item ? 'primary.contrastText' : 'inherit',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
          onClick={() => setSelectedMenuItem(item)}
        >
          <CalendarMonthIcon sx={{ marginRight: 1.5 }} />
          {item}
        </Box>
      ))}
    </Paper>
  );
};

export default Menu;

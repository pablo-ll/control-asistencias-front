import React, { useState } from 'react';
import { Container, Box, useTheme } from '@mui/material';
import VacationForm from './vistas/vacaciones/VacationForm';
import Menu from './menu/Menu';
import HorariosSucursal from './vistas/horario/HorariosSucursal';
import BonoAntiguedadForm from './vistas/bonoAntiguedad/BonoAntiguedadForm';

export const Parametros = () => {
  const theme = useTheme();

  // Estado para manejar el componente seleccionado
  const [selectedMenuItem, setSelectedMenuItem] = useState('Días de Vacación');

  // Función para renderizar el componente correspondiente
  const renderComponent = () => {
    switch (selectedMenuItem) {
      case 'Áreas de experiencia':
        return <div>Componente de Áreas de experiencia</div>;
      case 'Días de Vacación':
        return <VacationForm />;

      case 'Horarios Sucursal':
        return <HorariosSucursal/>;

      case 'Bono de Antigüedad':
        return <BonoAntiguedadForm/>;
      // Añadir más casos para otros componentes
      default:
        return <div>Selecciona una opción</div>;
    }
  };

  console.log(selectedMenuItem,'selectedMenuItem');

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        padding: theme.spacing(2),
      }}
    >
      <Menu selectedMenuItem={selectedMenuItem} setSelectedMenuItem={setSelectedMenuItem} />
      <Box sx={{ flex: 1 }}>{renderComponent()}</Box>
    </Container>
  );
};

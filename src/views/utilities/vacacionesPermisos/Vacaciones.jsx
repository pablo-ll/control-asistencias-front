import React, { useEffect, useState } from 'react';

import MainCard from 'ui-component/cards/MainCard';
import { Grid } from '@mui/material';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTheme } from '@mui/material/styles';

import { addHours } from 'date-fns';
import { localizer, getMessages } from 'helpers';
import { CalendarEvent } from './CalendarEvent';
import { CalendarAgenda } from './CalendarAgenda';
import NotificationSection from 'views/utilities/vacacionesPermisos/NotificationSection';
import { useCargoStore, useEmpleadoStore, useSolicitudStore } from 'hooks';



export const Vacaciones = () => {
  const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'week');
  const { empleados, loadEmpleados } = useEmpleadoStore();
  const { cargos, loadCargos } = useCargoStore();
  const theme  = useTheme();

  const { solicitudes, loadSolicitudes, isLoading, error } = useSolicitudStore();
  useEffect(() => {
    loadSolicitudes();
    loadEmpleados();
    loadCargos();
  }, []);

  const pendientesCount = solicitudes.filter((solicitud) => solicitud.estado === 'PENDIENTE').length;

  const colorCalendar = (solicitud) => {
    switch (solicitud.estado) {
      case 'PENDIENTE':
        return theme.palette.warning.dark;
      case 'APROBADA':
        return solicitud.tipo === 'VACACION' ? theme.palette.success.dark : theme.palette.primary.main;
      default:
        return theme.palette.grey[500]; // Un color de tema para "estado desconocido"
    }
  };

  const getCargoName = (id) => {
    const empleado = empleados.find((emp) => emp.id === id);
    if (!empleado) {
      return 'Desconocido';
    }
    const cargo = cargos.find((dep) => dep.id === empleado.cargoId);
    return cargo ? `${cargo.nombre}` : 'Desconocido';
  };

  

  const solicitudesCalendar = () => {
    let solicitudesArray = [];
  
    if (solicitudes.length > 0) {
      // Primero filtras las solicitudes rechazadas
      solicitudesArray = solicitudes
        .filter((solicitud) => solicitud.estado !== 'RECHAZADA')
        .map((solicitud) => ({
          id: solicitud.empleadoId,
          title: getEmpleadoName(solicitud.empleadoId),
          start: new Date(new Date(solicitud.fechaInicio).setUTCHours(23, 59, 59, 999)), 
          end: addHours(new Date(new Date(solicitud.fechaFin).setUTCHours(23, 59, 59, 999)),2), 
          bgColor: colorCalendar(solicitud),
          status: solicitud.estado.toLowerCase(), // Convertir estado a minúsculas
          cargo: getCargoName(solicitud.empleadoId),
          descripcion: solicitud.descripcion // Agregar la descripción de la solicitud
        }));
    }
  
    return solicitudesArray;
  };
  

  const getEmpleadoName = (id) => {
    const empleado = empleados.find((emp) => emp.id === id);
    return empleado ? `${empleado.nombre} ${empleado.apellidoPaterno}` : 'desconocido';
  };

  const onViewChanged = (event) => {
    localStorage.setItem('lastView', event);
  };
  return (
    <MainCard title="Gestión de vacaciones y permisos">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {/* Calendario */}
          <Calendar
            culture="es"
            localizer={localizer}
            events={solicitudesCalendar()}
            defaultView={lastView}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 'calc(100vh - 210px)', marginTop: '20px' }}
            messages={getMessages()}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: event.bgColor,
                fontFamily: 'Roboto, sans-serif',
                fontSize: '0.875rem', // Usar camelCase para fontSize
                padding: '6px 16px' // Los valores numéricos deben ir entre comillas como cadena
              }
            })}
            components={{ event: CalendarEvent, agenda: CalendarAgenda }}
            onView={onViewChanged}
            /* onSelectEvent={handleEventClick} */
          />
          <div
            style={{
              position: 'fixed',
              bottom: 25,
              right: 25,
              zIndex: 1000 // Asegura que el botón esté por encima del calendario
            }}
          >
            <NotificationSection count={pendientesCount} />
          </div>
        </Grid>
      </Grid>
    </MainCard>
  );
};
